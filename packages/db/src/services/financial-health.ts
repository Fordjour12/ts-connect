import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "../index";
import { 
  financialHealthScore, 
  transaction, 
  goal
} from "../schema/financial";
import { nanoid } from "nanoid";

export interface HealthScoreComponents {
  savingsRate: number;
  budgetAdherence: number;
  incomeStability: number;
  expenseVolatility: number;
  goalProgress: number;
}

export interface FinancialMetrics {
  incomeTotal: number;
  expenseTotal: number;
  savingsTotal: number;
  savingsRate: number;
  transactionCount: number;
  averageTransaction: number;
  budgetAdherence: number;
  incomeStability: number;
  expenseVolatility: number;
  goalProgress: number;
}

export type HealthState = "stable" | "improving" | "drifting" | "at_risk";
export type TrendDirection = "improving" | "stable" | "declining";

export class FinancialHealthCalculator {
  /**
   * Calculate comprehensive financial health score (0-100)
   */
  static async calculateHealthScore(userId: string): Promise<{
    score: number;
    healthState: HealthState;
    trendDirection: TrendDirection;
    components: HealthScoreComponents;
    previousScore?: number;
  }> {
    const metrics = await this.calculateFinancialMetrics(userId);
    const components = this.calculateScoreComponents(metrics);
    const score = this.calculateOverallScore(components);
    
    const previousScore = await this.getPreviousScore(userId);
    const trendDirection = this.calculateTrendDirection(score, previousScore);
    const healthState = this.determineHealthState(score, trendDirection);

    // Store the score
    await this.storeHealthScore(userId, score, healthState, trendDirection, components);

    return {
      score,
      healthState,
      trendDirection,
      components,
      previousScore
    };
  }

  /**
   * Calculate comprehensive financial metrics for a user
   */
  private static async calculateFinancialMetrics(userId: string): Promise<FinancialMetrics> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Get recent transactions (last 30 days)
    const recentTransactions = await db
      .select()
      .from(transaction)
      .where(
        and(
          eq(transaction.userId, userId),
          gte(transaction.transactionDate, thirtyDaysAgo)
        )
      );

    // Get transactions for trend comparison (last 90 days)
    const trendTransactions = await db
      .select()
      .from(transaction)
      .where(
        and(
          eq(transaction.userId, userId),
          gte(transaction.transactionDate, ninetyDaysAgo)
        )
      );

    const incomeTransactions = recentTransactions.filter(t => parseFloat(t.amount.toString()) > 0);
    const expenseTransactions = recentTransactions.filter(t => parseFloat(t.amount.toString()) < 0);

    const incomeTotal = incomeTransactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    const expenseTotal = Math.abs(expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0));
    const savingsTotal = incomeTotal - expenseTotal;
    const savingsRate = incomeTotal > 0 ? (savingsTotal / incomeTotal) * 100 : 0;

    // Calculate income stability (variance in monthly income)
    const incomeStability = this.calculateIncomeStability(trendTransactions);

    // Calculate expense volatility (variance in daily/weekly spending)
    const expenseVolatility = this.calculateExpenseVolatility(recentTransactions);

    // Calculate budget adherence
    const budgetAdherence = await this.calculateBudgetAdherence();

    // Calculate goal progress
    const goalProgress = await this.calculateGoalProgress(userId);

    return {
      incomeTotal,
      expenseTotal,
      savingsTotal,
      savingsRate,
      transactionCount: recentTransactions.length,
      averageTransaction: recentTransactions.length > 0 ? 
        recentTransactions.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.toString())), 0) / recentTransactions.length : 0,
      budgetAdherence,
      incomeStability,
      expenseVolatility,
      goalProgress
    };
  }

  /**
   * Calculate income stability (0-100, higher is more stable)
   */
  private static calculateIncomeStability(transactions: typeof transaction.$inferSelect[]): number {
    const incomeByMonth = new Map<string, number>();

    transactions
      .filter(t => parseFloat(t.amount.toString()) > 0)
      .forEach(t => {
        const month = new Date(t.transactionDate).toISOString().slice(0, 7); // YYYY-MM
        const amount = parseFloat(t.amount.toString());
        incomeByMonth.set(month, (incomeByMonth.get(month) || 0) + amount);
      });

    const monthlyIncomes = Array.from(incomeByMonth.values());
    if (monthlyIncomes.length < 2) return 100;

    const avgIncome = monthlyIncomes.reduce((sum, inc) => sum + inc, 0) / monthlyIncomes.length;
    const variance = monthlyIncomes.reduce((sum, inc) => sum + Math.pow(inc - avgIncome, 2), 0) / monthlyIncomes.length;
    const coefficientOfVariation = Math.sqrt(variance) / avgIncome;

    // Convert to 0-100 scale (lower CV = higher score)
    return Math.max(0, Math.min(100, 100 - (coefficientOfVariation * 50)));
  }

  /**
   * Calculate expense volatility (0-100, lower volatility = higher score)
   */
  private static calculateExpenseVolatility(transactions: typeof transaction.$inferSelect[]): number {
    const expensesByDay: { [key: string]: number } = {};

    transactions
      .filter(t => parseFloat(t.amount.toString()) < 0)
      .forEach(t => {
        const date = new Date(t.transactionDate);
        if (isNaN(date.getTime())) return; // Skip invalid dates
        const day = date.toISOString().split('T')[0];
        const amount = Math.abs(parseFloat(t.amount.toString()));
        const key = day as keyof typeof expensesByDay;
        if (!expensesByDay[key]) {
          expensesByDay[key] = amount;
        } else {
          expensesByDay[key] += amount;
        }
      });

    const dailyExpenses = Object.values(expensesByDay);
    if (dailyExpenses.length < 2) return 100;

    const avgExpense = dailyExpenses.reduce((sum, exp) => sum + exp, 0) / dailyExpenses.length;
    const variance = dailyExpenses.reduce((sum, exp) => sum + Math.pow(exp - avgExpense, 2), 0) / dailyExpenses.length;
    const coefficientOfVariation = Math.sqrt(variance) / avgExpense;

    // Convert to 0-100 scale (lower CV = higher score)
    return Math.max(0, Math.min(100, 100 - (coefficientOfVariation * 100)));
  }

  /**
   * Calculate budget adherence percentage
   */
  private static async calculateBudgetAdherence(): Promise<number> {
    // Simplified budget adherence calculation for now
    // TODO: Implement proper budget period calculations
    return 100; // Default to perfect adherence for MVP
  }

  /**
   * Calculate goal progress percentage
   */
  private static async calculateGoalProgress(userId: string): Promise<number> {
    const activeGoals = await db
      .select()
      .from(goal)
      .where(
        and(
          eq(goal.userId, userId),
          eq(goal.status, "active")
        )
      );

    if (activeGoals.length === 0) return 100; // No goals = perfect progress

    const totalProgress = activeGoals.reduce((sum, goal) => {
      const target = parseFloat(goal.targetAmount.toString());
      const current = parseFloat(goal.currentAmount.toString());
      return sum + (target > 0 ? Math.min(current / target, 1) : 0);
    }, 0);

    return (totalProgress / activeGoals.length) * 100;
  }

  /**
   * Calculate individual score components
   */
  private static calculateScoreComponents(metrics: FinancialMetrics): HealthScoreComponents {
    return {
      savingsRate: Math.max(0, Math.min(100, metrics.savingsRate + 50)), // Convert -50 to 150 scale to 0-100
      budgetAdherence: metrics.budgetAdherence,
      incomeStability: metrics.incomeStability,
      expenseVolatility: metrics.expenseVolatility,
      goalProgress: metrics.goalProgress
    };
  }

  /**
   * Calculate overall health score from components
   */
  private static calculateOverallScore(components: HealthScoreComponents): number {
    // Weighted scoring as specified in PRD
    const weights = {
      savingsRate: 0.25,
      budgetAdherence: 0.25,
      incomeStability: 0.20,
      expenseVolatility: 0.15,
      goalProgress: 0.15
    };

    return Math.round(
      components.savingsRate * weights.savingsRate +
      components.budgetAdherence * weights.budgetAdherence +
      components.incomeStability * weights.incomeStability +
      components.expenseVolatility * weights.expenseVolatility +
      components.goalProgress * weights.goalProgress
    );
  }

  /**
   * Get previous health score for trend calculation
   */
  private static async getPreviousScore(userId: string): Promise<number | undefined> {
    const previousScore = await db
      .select()
      .from(financialHealthScore)
      .where(eq(financialHealthScore.userId, userId))
      .orderBy(desc(financialHealthScore.calculatedAt))
      .limit(1)
      .then(rows => rows[0]?.score);

    return previousScore ?? undefined;
  }

  /**
   * Calculate trend direction based on current and previous scores
   */
  private static calculateTrendDirection(
    currentScore: number, 
    previousScore?: number
  ): TrendDirection {
    if (!previousScore) return "stable";
    
    const change = currentScore - previousScore;
    if (change > 5) return "improving";
    if (change < -5) return "declining";
    return "stable";
  }

  /**
   * Determine health state based on score and trend
   */
  private static determineHealthState(
    score: number, 
    trendDirection: TrendDirection
  ): HealthState {
    if (score >= 80) return "stable";
    if (score >= 60 && trendDirection === "improving") return "improving";
    if (score >= 60 && trendDirection === "stable") return "drifting";
    if (score >= 40) return "drifting";
    return "at_risk";
  }

  /**
   * Store health score in database
   */
  private static async storeHealthScore(
    userId: string,
    score: number,
    healthState: HealthState,
    trendDirection: TrendDirection,
    components: HealthScoreComponents
  ): Promise<void> {
    await db.insert(financialHealthScore).values({
      id: nanoid(),
      userId,
      score,
      healthState,
      trendDirection,
      scoreComponents: components,
      calculatedAt: new Date()
    });
  }
}