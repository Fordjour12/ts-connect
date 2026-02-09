import { and, eq, gte, lte, desc } from "drizzle-orm";
import { db } from "../index";
import { 
  insight, 
  transaction, 
  budget, 
  insightType,
  signalSeverity
} from "../schema/financial";
import { nanoid } from "nanoid";

export interface BudgetProjection {
  categoryId: string;
  categoryName: string;
  currentSpending: number;
  projectedTotal: number;
  budgetAmount: number;
  overage: number;
  overagePercentage: number;
  daysRemaining: number;
  severity: "low" | "medium" | "high" | "critical";
}

export interface SavingsForecast {
  currentSavings: number;
  monthlyBurnRate: number;
  projectedDepletionDate: Date | null;
  monthsOfRunway: number;
  recommendedActions: string[];
  severity: "low" | "medium" | "high" | "critical";
}

export interface DebtStagnationAlert {
  debtPayments: number;
  debtReduction: number;
  paymentEfficiency: number; // How much debt is actually being reduced per dollar paid
  stagnationMonths: number;
  recommendedActions: string[];
  severity: "low" | "medium" | "high" | "critical";
}

export class EarlyWarningSystem {
  /**
   * Generate all early warning alerts for a user
   */
  static async generateAlerts(userId: string): Promise<void> {
    const alerts: Array<{
      type: typeof insightType.enumValues[number];
      severity: typeof signalSeverity.enumValues[number];
      title: string;
      explanation: string;
      supportingData: any;
    }> = [];

    // Check for budget overruns
    const budgetAlerts = await this.checkBudgetOverruns(userId);
    alerts.push(...budgetAlerts);

    // Check for savings depletion forecasts
    const savingsAlerts = await this.checkSavingsDepletion(userId);
    alerts.push(...savingsAlerts);

    // Check for debt stagnation
    const debtAlerts = await this.checkDebtStagnation(userId);
    alerts.push(...debtAlerts);

    // Store all alerts
    await this.storeAlerts(userId, alerts);
  }

  /**
   * Check for projected budget overruns
   */
  private static async checkBudgetOverruns(userId: string): Promise<Array<{
    type: "budget_leakage";
    severity: "low" | "medium" | "high" | "critical";
    title: string;
    explanation: string;
    supportingData: any;
  }>> {
    const alerts = [];
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7); // YYYY-MM
    const monthStart = new Date(currentMonth + '-01');
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const daysRemaining = Math.ceil((nextMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Get current month budgets
    const activeBudgets = await db
      .select()
      .from(budget)
      .where(
        and(
          eq(budget.userId, userId),
          eq(budget.isActive, true)
        )
      );

    for (const budgetItem of activeBudgets) {
      const projection = await this.projectBudgetOverrun(
        userId, 
        budgetItem, 
        monthStart, 
        today, 
        daysRemaining
      );

      if (projection && projection.severity !== "low") {
        alerts.push({
          type: "budget_leakage" as const,
          severity: projection.severity,
          title: `Projected Budget Overrun: ${projection.categoryName}`,
          explanation: this.generateBudgetAlertExplanation(projection),
          supportingData: projection
        });
      }
    }

    return alerts;
  }

  /**
   * Project budget overrun for a specific budget
   */
  private static async projectBudgetOverrun(
    userId: string,
    budgetItem: typeof budget.$inferSelect,
    monthStart: Date,
    today: Date,
    daysRemaining: number
  ): Promise<BudgetProjection | null> {
    // Get current month transactions for this category
    const categoryTransactions = await db
      .select()
      .from(transaction)
      .where(
        and(
          eq(transaction.userId, userId),
          eq(transaction.categoryId, budgetItem.categoryId),
          gte(transaction.transactionDate, monthStart),
          lte(transaction.transactionDate, today)
        )
      );

    const currentSpending = Math.abs(
      categoryTransactions
        .filter(t => parseFloat(t.amount.toString()) < 0)
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.toString())), 0)
    );

    const daysInMonth = today.getDate();
    const dailyAverage = currentSpending / daysInMonth;
    const projectedTotal = dailyAverage * (daysInMonth + daysRemaining);

    const budgetAmount = parseFloat(budgetItem.amount.toString());
    const overage = projectedTotal - budgetAmount;
    const overagePercentage = (overage / budgetAmount) * 100;

    // Determine severity based on overage percentage
    let severity: "low" | "medium" | "high" | "critical" = "low";
    if (overagePercentage > 50) severity = "critical";
    else if (overagePercentage > 25) severity = "high";
    else if (overagePercentage > 10) severity = "medium";

    if (severity === "low") return null;

    return {
      categoryId: budgetItem.categoryId,
      categoryName: `Category ${budgetItem.categoryId}`, // Would need to join with category table
      currentSpending,
      projectedTotal,
      budgetAmount,
      overage,
      overagePercentage,
      daysRemaining,
      severity
    };
  }

  /**
   * Check for savings depletion forecasts
   */
  private static async checkSavingsDepletion(userId: string): Promise<Array<{
    type: "savings_drop";
    severity: "low" | "medium" | "high" | "critical";
    title: string;
    explanation: string;
    supportingData: any;
  }>> {
    const forecast = await this.calculateSavingsForecast(userId);
    const alerts = [];

    if (forecast.severity !== "low") {
      alerts.push({
        type: "savings_drop" as const,
        severity: forecast.severity,
        title: "Savings Depletion Warning",
        explanation: this.generateSavingsAlertExplanation(forecast),
        supportingData: forecast
      });
    }

    return alerts;
  }

  /**
   * Calculate savings forecast and runway
   */
  private static async calculateSavingsForecast(userId: string): Promise<SavingsForecast> {
    const today = new Date();
    const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());

    // Get recent transactions to calculate savings rate
    const recentTransactions = await db
      .select()
      .from(transaction)
      .where(
        and(
          eq(transaction.userId, userId),
          gte(transaction.transactionDate, threeMonthsAgo)
        )
      );

    // Calculate average monthly savings (income - expenses)
    const monthlyData = this.calculateMonthlySavings(recentTransactions);
    const avgMonthlySavings = monthlyData.length > 0 
      ? monthlyData.reduce((sum, data) => sum + data.savings, 0) / monthlyData.length
      : 0;

    // Get current savings balance (would need to calculate from account balances)
    // For now, we'll use a simplified approach
    const currentSavings = Math.max(0, avgMonthlySavings * 2); // Assume 2 months of average savings

    const monthlyBurnRate = Math.abs(Math.min(0, avgMonthlySavings)); // Negative savings = burn rate
    const monthsOfRunway = monthlyBurnRate > 0 ? currentSavings / monthlyBurnRate : Infinity;
    
    let projectedDepletionDate: Date | null = null;
    if (monthsOfRunway !== Infinity && monthsOfRunway < Infinity) {
      projectedDepletionDate = new Date(today.getTime() + (monthsOfRunway * 30 * 24 * 60 * 60 * 1000));
    }

    const recommendedActions = this.generateSavingsRecommendations(monthsOfRunway, monthlyBurnRate);

    // Determine severity
    let severity: "low" | "medium" | "high" | "critical" = "low";
    if (monthsOfRunway < 1) severity = "critical";
    else if (monthsOfRunway < 3) severity = "high";
    else if (monthsOfRunway < 6) severity = "medium";

    return {
      currentSavings,
      monthlyBurnRate,
      projectedDepletionDate,
      monthsOfRunway: monthsOfRunway === Infinity ? 999 : monthsOfRunway,
      recommendedActions,
      severity
    };
  }

  /**
   * Calculate monthly savings from transactions
   */
  private static calculateMonthlySavings(transactions: typeof transaction.$inferSelect[]): Array<{
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }> {
    const monthlyData: { [month: string]: { income: number; expenses: number } } = {};

    transactions.forEach(t => {
      const month = new Date(t.transactionDate).toISOString().slice(0, 7);
      const amount = parseFloat(t.amount.toString());

      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }

      if (amount > 0) {
        monthlyData[month].income += amount;
      } else {
        monthlyData[month].expenses += Math.abs(amount);
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      savings: data.income - data.expenses
    }));
  }

  /**
   * Check for debt stagnation
   */
  private static async checkDebtStagnation(userId: string): Promise<Array<{
    type: "debt_growth";
    severity: "low" | "medium" | "high" | "critical";
    title: string;
    explanation: string;
    supportingData: any;
  }>> {
    const alert = await this.calculateDebtStagnation(userId);
    const alerts = [];

    if (alert.severity !== "low") {
      alerts.push({
        type: "debt_growth" as const,
        severity: alert.severity,
        title: "Debt Payment Inefficiency Detected",
        explanation: this.generateDebtAlertExplanation(alert),
        supportingData: alert
      });
    }

    return alerts;
  }

  /**
   * Calculate debt stagnation metrics
   */
  private static async calculateDebtStagnation(userId: string): Promise<DebtStagnationAlert> {
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());

    // Get debt-related transactions (simplified - would need more sophisticated logic)
    const debtTransactions = await db
      .select()
      .from(transaction)
      .where(
        and(
          eq(transaction.userId, userId),
          gte(transaction.transactionDate, sixMonthsAgo)
        )
      );

    // Group by month to track debt payment trends
    const monthlyDebtData = this.calculateMonthlyDebtPayments(debtTransactions);
    
    if (monthlyDebtData.length < 3) {
      return {
        debtPayments: 0,
        debtReduction: 0,
        paymentEfficiency: 0,
        stagnationMonths: 0,
        recommendedActions: ["Need more transaction history to analyze debt patterns"],
        severity: "low"
      };
    }

    const recentMonths = monthlyDebtData.slice(-3);
    const olderMonths = monthlyDebtData.slice(-6, -3);

    const recentAvgPayment = recentMonths.reduce((sum, m) => sum + m.payments, 0) / recentMonths.length;
    const olderAvgPayment = olderMonths.reduce((sum, m) => sum + m.payments, 0) / olderMonths.length;
    const recentAvgReduction = recentMonths.reduce((sum, m) => sum + m.debtReduction, 0) / recentMonths.length;
    const olderAvgReduction = olderMonths.reduce((sum, m) => sum + m.debtReduction, 0) / olderMonths.length;

    const paymentIncrease = olderAvgPayment > 0 ? ((recentAvgPayment - olderAvgPayment) / olderAvgPayment) * 100 : 0;
    const reductionDecrease = olderAvgReduction > 0 ? ((recentAvgReduction - olderAvgReduction) / olderAvgReduction) * 100 : 0;

    // Calculate payment efficiency
    const recentEfficiency = recentAvgPayment > 0 ? (recentAvgReduction / recentAvgPayment) * 100 : 0;
    // const olderEfficiency = olderAvgPayment > 0 ? (olderAvgReduction / olderAvgPayment) * 100 : 0;

    const stagnationMonths = reductionDecrease < -10 ? 1 : 0; // Simplified detection

    const recommendedActions = this.generateDebtRecommendations(paymentIncrease, reductionDecrease, recentEfficiency);

    // Determine severity
    let severity: "low" | "medium" | "high" | "critical" = "low";
    if (stagnationMonths > 0 && paymentIncrease > 20 && reductionDecrease < -20) {
      severity = "high";
    } else if (stagnationMonths > 0 && paymentIncrease > 10) {
      severity = "medium";
    }

    return {
      debtPayments: recentAvgPayment,
      debtReduction: recentAvgReduction,
      paymentEfficiency: recentEfficiency,
      stagnationMonths,
      recommendedActions,
      severity
    };
  }

  /**
   * Calculate monthly debt payments and reductions
   */
  private static calculateMonthlyDebtPayments(transactions: typeof transaction.$inferSelect[]): Array<{
    month: string;
    payments: number;
    debtReduction: number;
  }> {
    const monthlyData: { [month: string]: { payments: number; estimatedReduction: number } } = {};

    transactions.forEach(t => {
      const month = new Date(t.transactionDate).toISOString().slice(0, 7);
      const amount = parseFloat(t.amount.toString());

      if (!monthlyData[month]) {
        monthlyData[month] = { payments: 0, estimatedReduction: 0 };
      }

      // Simplified debt payment detection - would need more sophisticated logic
      if (amount < 0 && Math.abs(amount) > 50) {
        monthlyData[month].payments += Math.abs(amount);
        // Assume 80% of large payments actually reduce debt principal
        monthlyData[month].estimatedReduction += Math.abs(amount) * 0.8;
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      payments: data.payments,
      debtReduction: data.estimatedReduction
    }));
  }

  /**
   * Generate budget alert explanation
   */
  private static generateBudgetAlertExplanation(projection: BudgetProjection): string {
    return `Based on your current spending pace, you're projected to exceed your ${projection.categoryName} budget by ${projection.overagePercentage.toFixed(1)}% (${projection.overage.toFixed(2)}) by the end of the month. With ${projection.daysRemaining} days remaining, consider adjusting your spending or budget allocation.`;
  }

  /**
   * Generate savings alert explanation
   */
  private static generateSavingsAlertExplanation(forecast: SavingsForecast): string {
    if (forecast.monthsOfRunway === 999) {
      return "Your current savings rate is positive. Keep up the good work!";
    }

    if (forecast.projectedDepletionDate) {
      return `At your current savings rate, your savings are projected to run out in ${forecast.monthsOfRunway.toFixed(1)} months (around ${forecast.projectedDepletionDate.toLocaleDateString()}). Consider increasing income or reducing expenses to extend your runway.`;
    }

    return `Your savings are being depleted at a rate of ${forecast.monthlyBurnRate.toFixed(2)} per month. This trend should be addressed to maintain financial stability.`;
  }

  /**
   * Generate debt alert explanation
   */
  private static generateDebtAlertExplanation(alert: DebtStagnationAlert): string {
    return `Your debt payments have increased by ${((alert.debtPayments / alert.debtReduction - 1) * 100).toFixed(1)}%, but debt reduction has decreased. This suggests payment inefficiency - consider reviewing your payment strategy and ensuring payments are going toward principal reduction.`;
  }

  /**
   * Generate savings recommendations
   */
  private static generateSavingsRecommendations(monthsOfRunway: number, monthlyBurnRate: number): string[] {
    const recommendations = [];

    if (monthsOfRunway < 1) {
      recommendations.push("Immediate action required: Consider emergency expense reduction");
      recommendations.push("Look into temporary income increases");
    } else if (monthsOfRunway < 3) {
      recommendations.push("Review and reduce non-essential expenses");
      recommendations.push("Consider temporarily pausing some financial goals");
    } else if (monthsOfRunway < 6) {
      recommendations.push("Optimize budget allocations");
      recommendations.push("Look for subscription and recurring payment optimization");
    }

    if (monthlyBurnRate > 1000) {
      recommendations.push("High monthly burn rate detected - review major expense categories");
    }

    return recommendations;
  }

  /**
   * Generate debt recommendations
   */
  private static generateDebtRecommendations(
    paymentIncrease: number, 
    reductionDecrease: number, 
    efficiency: number
  ): string[] {
    const recommendations = [];

    if (paymentIncrease > 20 && reductionDecrease < -20) {
      recommendations.push("Review debt payment strategy - ensure payments are reducing principal");
      recommendations.push("Consider debt consolidation or refinancing options");
    }

    if (efficiency < 50) {
      recommendations.push("High payment inefficiency detected - check for fees or interest-only payments");
      recommendations.push("Prioritize high-interest debt reduction");
    }

    recommendations.push("Review debt payment allocation and timing");

    return recommendations;
  }

  /**
   * Store alerts in database
   */
  private static async storeAlerts(userId: string, alerts: Array<{
    type: typeof insightType.enumValues[number];
    severity: typeof signalSeverity.enumValues[number];
    title: string;
    explanation: string;
    supportingData: any;
  }>): Promise<void> {
    for (const alert of alerts) {
      // Check for duplicate alerts
      const existingAlert = await this.findDuplicateAlert(userId, alert);
      
      if (!existingAlert) {
        await db.insert(insight).values({
          id: nanoid(),
          userId,
          insightType: alert.type,
          severity: alert.severity,
          title: alert.title,
          explanation: alert.explanation,
          supportingData: alert.supportingData,
          status: "active",
          createdAt: new Date()
        });
      }
    }
  }

  /**
   * Find duplicate alerts to avoid spamming
   */
  private static async findDuplicateAlert(
    userId: string, 
    alert: { type: typeof insightType.enumValues[number]; title: string }
  ): Promise<typeof insight.$inferSelect | null> {
    // Look for similar alerts in the last 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const existingAlerts = await db
      .select()
      .from(insight)
      .where(
        and(
          eq(insight.userId, userId),
          eq(insight.insightType, alert.type),
          gte(insight.createdAt, threeDaysAgo)
        )
      )
      .orderBy(desc(insight.createdAt))
      .limit(1);

    return existingAlerts[0] || null;
  }
}