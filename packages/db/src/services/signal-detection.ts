import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "../index";
import { 
  insight, 
  transaction, 
  trendAnalysis,
  insightType,
  signalSeverity
} from "../schema/financial";
import { nanoid } from "nanoid";

export interface SignalRule {
  type: typeof insightType.enumValues[number];
  name: string;
  description: string;
  severity: typeof signalSeverity.enumValues[number];
  threshold: number;
  windowDays: number;
  check: (data: SignalData) => boolean;
}

export interface SignalData {
  currentPeriod: {
    transactions: typeof transaction.$inferSelect[];
    trends: typeof trendAnalysis.$inferSelect[];
    categorySpending: { [categoryId: string]: number };
  };
  comparisonPeriod: {
    transactions: typeof transaction.$inferSelect[];
    trends: typeof trendAnalysis.$inferSelect[];
    categorySpending: { [categoryId: string]: number };
  };
  historicalData: {
    transactions: typeof transaction.$inferSelect[];
    trends: typeof trendAnalysis.$inferSelect[];
  };
}

export interface GeneratedInsight {
  id?: string;
  type: typeof insightType.enumValues[number];
  severity: typeof signalSeverity.enumValues[number];
  title: string;
  explanation: string;
  supportingData: any;
}

export class SignalDetectionEngine {
  private static signalRules: SignalRule[] = [
    {
      type: "spending_spike",
      name: "Spending Spike",
      description: "Unusual increase in spending compared to recent history",
      severity: "high",
      threshold: 30, // 30% increase
      windowDays: 90,
      check: (data) => {
        const currentMonth = this.getMonthlyTotal(data.currentPeriod.transactions);
        const previous3Months = this.getAverageMonthlyTotal(data.historicalData.transactions);
        
        return previous3Months > 0 && 
               ((currentMonth - previous3Months) / previous3Months) * 100 > 30;
      }
    },
    {
      type: "savings_drop",
      name: "Savings Rate Drop",
      description: "Significant decrease in savings rate",
      severity: "critical",
      threshold: 20, // 20% decrease
      windowDays: 60,
      check: (data) => {
        const currentSavingsRate = this.calculateSavingsRate(data.currentPeriod.transactions);
        const previousSavingsRate = this.calculateSavingsRate(data.comparisonPeriod.transactions);
        
        return previousSavingsRate > 0 && 
               ((previousSavingsRate - currentSavingsRate) / previousSavingsRate) * 100 > 20;
      }
    },
    {
      type: "budget_leakage",
      name: "Budget Leakage",
      description: "Spending significantly over budget in a category",
      severity: "medium",
      threshold: 25, // 25% over budget
      windowDays: 30,
      check: (data) => {
        // This would need budget data integration
        // For now, we'll use category anomalies
        const categorySpending = data.currentPeriod.categorySpending;
        const historicalSpending = data.comparisonPeriod.categorySpending;
        
        for (const [categoryId, currentSpending] of Object.entries(categorySpending)) {
          const historicalAverage = historicalSpending[categoryId] || 0;
          if (historicalAverage > 0 && 
              ((currentSpending - historicalAverage) / historicalAverage) * 100 > 50) {
            return true;
          }
        }
        return false;
      }
    },
    {
      type: "income_dip",
      name: "Income Dip",
      description: "Significant decrease in income",
      severity: "high",
      threshold: 20, // 20% decrease
      windowDays: 60,
      check: (data) => {
        const currentIncome = this.getMonthlyIncome(data.currentPeriod.transactions);
        const previousIncome = this.getMonthlyIncome(data.comparisonPeriod.transactions);
        
        return previousIncome > 0 && 
               ((previousIncome - currentIncome) / previousIncome) * 100 > 20;
      }
    },
    {
      type: "debt_growth",
      name: "Debt Growth",
      description: "Increasing debt payments without corresponding debt reduction",
      severity: "medium",
      threshold: 15, // 15% increase in debt payments
      windowDays: 90,
      check: (data) => {
        const currentDebtPayments = this.getDebtPayments(data.currentPeriod.transactions);
        const previousDebtPayments = this.getDebtPayments(data.comparisonPeriod.transactions);
        
        return previousDebtPayments > 0 && 
               ((currentDebtPayments - previousDebtPayments) / previousDebtPayments) * 100 > 15;
      }
    },
    {
      type: "transaction_silence",
      name: "Transaction Silence",
      description: "No financial activity for an extended period",
      severity: "low",
      threshold: 7, // 7 days
      windowDays: 30,
      check: (data) => {
        const latestTransaction = data.currentPeriod.transactions
          .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())[0];
        
        if (!latestTransaction) return true;
        
        const daysSinceLastTransaction = Math.floor(
          (new Date().getTime() - new Date(latestTransaction.transactionDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        return daysSinceLastTransaction > 7;
      }
    }
  ];

  /**
   * Generate all signals for a user
   */
  static async generateSignals(userId: string): Promise<GeneratedInsight[]> {
    const signalData = await this.prepareSignalData(userId);
    const insights: GeneratedInsight[] = [];

    for (const rule of this.signalRules) {
      if (rule.check(signalData)) {
        const insight = this.createInsight(rule, signalData);
        insights.push(insight);
      }
    }

    // Store insights and return them
    await this.storeInsights(userId, insights);
    return insights;
  }

  /**
   * Prepare data for signal detection
   */
  private static async prepareSignalData(userId: string): Promise<SignalData> {
    const now = new Date();
    const currentPeriodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
    const comparisonPeriodStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // 30-90 days ago
    const historicalStart = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000); // Last 6 months

    // Get current period transactions
    const currentPeriodTransactions = await db
      .select()
      .from(transaction)
      .where(
        and(
          eq(transaction.userId, userId),
          gte(transaction.transactionDate, currentPeriodStart),
          lte(transaction.transactionDate, now)
        )
      );

    // Get comparison period transactions
    const comparisonPeriodTransactions = await db
      .select()
      .from(transaction)
      .where(
        and(
          eq(transaction.userId, userId),
          gte(transaction.transactionDate, comparisonPeriodStart),
          lte(transaction.transactionDate, currentPeriodStart)
        )
      );

    // Get historical transactions
    const historicalTransactions = await db
      .select()
      .from(transaction)
      .where(
        and(
          eq(transaction.userId, userId),
          gte(transaction.transactionDate, historicalStart),
          lte(transaction.transactionDate, now)
        )
      );

    // Get trend analysis data
    const currentTrends = await db
      .select()
      .from(trendAnalysis)
      .where(eq(trendAnalysis.userId, userId));

    // Calculate category spending
    const currentCategorySpending = this.calculateCategorySpending(currentPeriodTransactions);
    const comparisonCategorySpending = this.calculateCategorySpending(comparisonPeriodTransactions);

    return {
      currentPeriod: {
        transactions: currentPeriodTransactions,
        trends: currentTrends,
        categorySpending: currentCategorySpending
      },
      comparisonPeriod: {
        transactions: comparisonPeriodTransactions,
        trends: currentTrends, // Use same trends for now
        categorySpending: comparisonCategorySpending
      },
      historicalData: {
        transactions: historicalTransactions,
        trends: currentTrends
      }
    };
  }

  /**
   * Calculate spending by category
   */
  private static calculateCategorySpending(transactions: typeof transaction.$inferSelect[]): { [categoryId: string]: number } {
    const spending: { [categoryId: string]: number } = {};

    transactions
      .filter(t => parseFloat(t.amount.toString()) < 0) // Only expenses
      .forEach(t => {
        if (t.categoryId) {
          const amount = Math.abs(parseFloat(t.amount.toString()));
          spending[t.categoryId] = (spending[t.categoryId] || 0) + amount;
        }
      });

    return spending;
  }

  /**
   * Calculate monthly total from transactions
   */
  private static getMonthlyTotal(transactions: typeof transaction.$inferSelect[]): number {
    return transactions
      .filter(t => parseFloat(t.amount.toString()) < 0)
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.toString())), 0);
  }

  /**
   * Calculate average monthly total from transactions
   */
  private static getAverageMonthlyTotal(transactions: typeof transaction.$inferSelect[]): number {
    const monthlyTotals = this.getMonthlyTotalsByPeriod(transactions);
    const months = Object.keys(monthlyTotals).length;
    
    if (months === 0) return 0;
    
    return Object.values(monthlyTotals).reduce((sum, total) => sum + total, 0) / months;
  }

  /**
   * Get monthly totals grouped by period
   */
  private static getMonthlyTotalsByPeriod(transactions: typeof transaction.$inferSelect[]): { [month: string]: number } {
    const monthlyTotals: { [month: string]: number } = {};

    transactions
      .filter(t => parseFloat(t.amount.toString()) < 0)
      .forEach(t => {
        const month = new Date(t.transactionDate).toISOString().slice(0, 7); // YYYY-MM
        const amount = Math.abs(parseFloat(t.amount.toString()));
        monthlyTotals[month] = (monthlyTotals[month] || 0) + amount;
      });

    return monthlyTotals;
  }

  /**
   * Calculate savings rate from transactions
   */
  private static calculateSavingsRate(transactions: typeof transaction.$inferSelect[]): number {
    const income = this.getMonthlyIncome(transactions);
    const expenses = this.getMonthlyTotal(transactions);
    
    if (income === 0) return 0;
    return ((income - expenses) / income) * 100;
  }

  /**
   * Get monthly income from transactions
   */
  private static getMonthlyIncome(transactions: typeof transaction.$inferSelect[]): number {
    return transactions
      .filter(t => parseFloat(t.amount.toString()) > 0)
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
  }

  /**
   * Calculate debt payments from transactions
   */
  private static getDebtPayments(transactions: typeof transaction.$inferSelect[]): number {
    // This would need to be enhanced to identify debt payments specifically
    // For now, we'll use a simple heuristic
    return transactions
      .filter(t => {
        const amount = parseFloat(t.amount.toString());
        return amount < 0 && Math.abs(amount) > 100; // Large expenses could be debt payments
      })
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.toString())), 0);
  }

  /**
   * Create insight from signal rule and data
   */
  private static createInsight(rule: SignalRule, data: SignalData): GeneratedInsight {
    const supportingData = this.generateSupportingData(rule, data);
    
    return {
      type: rule.type,
      severity: rule.severity,
      title: rule.name,
      explanation: this.generateExplanation(rule, data, supportingData),
      supportingData
    };
  }

  /**
   * Generate supporting data for an insight
   */
  private static generateSupportingData(rule: SignalRule, data: SignalData): any {
    switch (rule.type) {
      case "spending_spike":
        return {
          currentSpending: this.getMonthlyTotal(data.currentPeriod.transactions),
          historicalAverage: this.getAverageMonthlyTotal(data.historicalData.transactions),
          percentageIncrease: this.calculatePercentageIncrease(
            this.getMonthlyTotal(data.currentPeriod.transactions),
            this.getAverageMonthlyTotal(data.historicalData.transactions)
          )
        };
      
      case "savings_drop":
        return {
          currentSavingsRate: this.calculateSavingsRate(data.currentPeriod.transactions),
          previousSavingsRate: this.calculateSavingsRate(data.comparisonPeriod.transactions),
          income: this.getMonthlyIncome(data.currentPeriod.transactions),
          expenses: this.getMonthlyTotal(data.currentPeriod.transactions)
        };
      
      case "income_dip":
        return {
          currentIncome: this.getMonthlyIncome(data.currentPeriod.transactions),
          previousIncome: this.getMonthlyIncome(data.comparisonPeriod.transactions),
          percentageDecrease: this.calculatePercentageDecrease(
            this.getMonthlyIncome(data.currentPeriod.transactions),
            this.getMonthlyIncome(data.comparisonPeriod.transactions)
          )
        };
      
      case "transaction_silence":
        const latestTransaction = data.currentPeriod.transactions
          .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())[0];
        return {
          daysSinceLastTransaction: latestTransaction ? 
            Math.floor((new Date().getTime() - new Date(latestTransaction.transactionDate).getTime()) / (1000 * 60 * 60 * 24)) : null,
          lastTransactionDate: latestTransaction?.transactionDate
        };
      
      default:
        return {
          currentPeriodTransactions: data.currentPeriod.transactions.length,
          comparisonPeriodTransactions: data.comparisonPeriod.transactions.length
        };
    }
  }

  /**
   * Generate explanation text for an insight
   */
  private static generateExplanation(rule: SignalRule, data: SignalData, supportingData: any): string {
    switch (rule.type) {
      case "spending_spike":
        return `Your spending increased by ${supportingData.percentageIncrease.toFixed(1)}% compared to your recent average. This spike may indicate unusual expenses or a change in spending patterns that warrants attention.`;
      
      case "savings_drop":
        return `Your savings rate dropped from ${supportingData.previousSavingsRate.toFixed(1)}% to ${supportingData.currentSavingsRate.toFixed(1)}%. This significant decrease could impact your financial goals and should be addressed.`;
      
      case "income_dip":
        return `Your income decreased by ${supportingData.percentageDecrease.toFixed(1)}% compared to the previous period. This decline may require adjusting your budget or financial planning.`;
      
      case "budget_leakage":
        return `You've exceeded your typical spending in certain categories. Review your recent expenses to identify any unusual purchases or budget adjustments needed.`;
      
      case "debt_growth":
        return `Your debt payments have increased significantly. While paying down debt is positive, ensure this aligns with your overall debt reduction strategy.`;
      
      case "transaction_silence":
        return `No financial transactions have been recorded for ${supportingData.daysSinceLastTransaction} days. This may indicate you're not tracking expenses or there could be an issue with data import.`;
      
      default:
        return rule.description;
    }
  }

  /**
   * Calculate percentage increase
   */
  private static calculatePercentageIncrease(current: number, baseline: number): number {
    if (baseline === 0) return 0;
    return ((current - baseline) / baseline) * 100;
  }

  /**
   * Calculate percentage decrease
   */
  private static calculatePercentageDecrease(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((previous - current) / previous) * 100;
  }

  /**
   * Store insights in database
   */
  private static async storeInsights(userId: string, insights: GeneratedInsight[]): Promise<void> {
    for (const insightData of insights) {
      // Check for duplicate insights first
      const existingInsight = await this.findDuplicateInsight(userId, insightData);
      
      if (!existingInsight) {
        await db.insert(insight).values({
          id: nanoid(),
          userId,
          insightType: insightData.type,
          severity: insightData.severity,
          title: insightData.title,
          explanation: insightData.explanation,
          supportingData: insightData.supportingData,
          status: "active",
          createdAt: new Date()
        });
      }
    }
  }

  /**
   * Find duplicate insights to avoid spamming
   */
  private static async findDuplicateInsight(
    userId: string, 
    insightData: GeneratedInsight
  ): Promise<typeof insight.$inferSelect | null> {
    // Look for similar insights in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const existingInsights = await db
      .select()
      .from(insight)
      .where(
        and(
          eq(insight.userId, userId),
          eq(insight.insightType, insightData.type),
          gte(insight.createdAt, sevenDaysAgo)
        )
      )
      .orderBy(desc(insight.createdAt))
      .limit(1);

    return existingInsights[0] || null;
  }
}