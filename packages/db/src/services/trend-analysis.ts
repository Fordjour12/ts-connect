import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "../index";
import { 
  trendAnalysis, 
  transaction
} from "../schema/financial";

export interface PeriodMetrics {
  incomeTotal: number;
  expenseTotal: number;
  savingsTotal: number;
  savingsRate: number;
  transactionCount: number;
  averageTransaction: number;
}

export interface PeriodComparison {
  vsPreviousPeriod: number; // percentage change
  vs3MonthAverage: number;  // percentage change
  vs6MonthAverage: number;   // percentage change
}

export class TrendAnalysisEngine {
  /**
   * Generate comprehensive trend analysis for all periods
   */
  static async generateTrendAnalysis(userId: string): Promise<void> {
    const today = new Date();

    // Generate daily analysis for last 30 days
    await this.generateDailyAnalysis(userId, today);

    // Generate weekly analysis for last 12 weeks
    await this.generateWeeklyAnalysis(userId, today);

    // Generate monthly analysis for last 12 months
    await this.generateMonthlyAnalysis(userId, today);
  }

  /**
   * Generate daily trend analysis
   */
  private static async generateDailyAnalysis(userId: string, endDate: Date): Promise<void> {
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 30);

    const dailyMetrics = await this.calculateDailyMetrics(userId, startDate, endDate);

    for (const dayData of dailyMetrics) {
      const previousDayData = await this.getDayMetrics(userId, 
        new Date(dayData.date.getTime() - 24 * 60 * 60 * 1000));
      
      const threeDayAverage = await this.getAverageMetrics(userId, "daily", 
        new Date(dayData.date.getTime() - 3 * 24 * 60 * 60 * 1000), 
        dayData.date);

      const comparisons: PeriodComparison = {
        vsPreviousPeriod: this.calculatePercentageChange(dayData.metrics, previousDayData?.metrics),
        vs3MonthAverage: this.calculatePercentageChange(dayData.metrics, threeDayAverage?.metrics),
        vs6MonthAverage: 0 // Not applicable for daily
      };

      await this.storeTrendAnalysis(userId, "daily", dayData.date, dayData.date, dayData.metrics, comparisons);
    }
  }

  /**
   * Generate weekly trend analysis
   */
  private static async generateWeeklyAnalysis(userId: string, endDate: Date): Promise<void> {
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (12 * 7)); // 12 weeks

    const weeklyMetrics = await this.calculateWeeklyMetrics(userId, startDate, endDate);

    for (const weekData of weeklyMetrics) {
      const previousWeekData = await this.getWeekMetrics(userId, 
        new Date(weekData.startDate.getTime() - 7 * 24 * 60 * 60 * 1000));
      
      const threeWeekAverage = await this.getAverageMetrics(userId, "weekly", 
        new Date(weekData.startDate.getTime() - 3 * 7 * 24 * 60 * 60 * 1000), 
        weekData.startDate);

      const comparisons: PeriodComparison = {
        vsPreviousPeriod: this.calculatePercentageChange(weekData.metrics, previousWeekData?.metrics),
        vs3MonthAverage: this.calculatePercentageChange(weekData.metrics, threeWeekAverage?.metrics),
        vs6MonthAverage: 0 // Not applicable for weekly
      };

      await this.storeTrendAnalysis(userId, "weekly", weekData.startDate, weekData.endDate, weekData.metrics, comparisons);
    }
  }

  /**
   * Generate monthly trend analysis
   */
  private static async generateMonthlyAnalysis(userId: string, endDate: Date): Promise<void> {
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 12);

    const monthlyMetrics = await this.calculateMonthlyMetrics(userId, startDate, endDate);

    for (const monthData of monthlyMetrics) {
      const previousMonthData = await this.getMonthMetrics(userId, 
        new Date(monthData.startDate.getFullYear(), monthData.startDate.getMonth() - 1, 1));
      
      const threeMonthAverage = await this.getAverageMetrics(userId, "monthly", 
        new Date(monthData.startDate.getFullYear(), monthData.startDate.getMonth() - 3, 1), 
        monthData.startDate);

      const sixMonthAverage = await this.getAverageMetrics(userId, "monthly", 
        new Date(monthData.startDate.getFullYear(), monthData.startDate.getMonth() - 6, 1), 
        monthData.startDate);

      const comparisons: PeriodComparison = {
        vsPreviousPeriod: this.calculatePercentageChange(monthData.metrics, previousMonthData?.metrics),
        vs3MonthAverage: this.calculatePercentageChange(monthData.metrics, threeMonthAverage?.metrics),
        vs6MonthAverage: this.calculatePercentageChange(monthData.metrics, sixMonthAverage?.metrics)
      };

      await this.storeTrendAnalysis(userId, "monthly", monthData.startDate, monthData.endDate, monthData.metrics, comparisons);
    }
  }

  /**
   * Calculate daily metrics for a date range
   */
  private static async calculateDailyMetrics(userId: string, startDate: Date, endDate: Date): Promise<Array<{
    date: Date;
    metrics: PeriodMetrics;
  }>> {
    const results: Array<{ date: Date; metrics: PeriodMetrics }> = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayStart = new Date(d);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      const transactions = await db
        .select()
        .from(transaction)
        .where(
          and(
            eq(transaction.userId, userId),
            gte(transaction.transactionDate, dayStart),
            lte(transaction.transactionDate, dayEnd)
          )
        );

      const metrics = this.calculatePeriodMetrics(transactions);
      results.push({ date: new Date(d), metrics });
    }

    return results;
  }

  /**
   * Calculate weekly metrics for a date range
   */
  private static async calculateWeeklyMetrics(userId: string, startDate: Date, endDate: Date): Promise<Array<{
    startDate: Date;
    endDate: Date;
    metrics: PeriodMetrics;
  }>> {
    const results: Array<{ startDate: Date; endDate: Date; metrics: PeriodMetrics }> = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
      const weekStart = new Date(d);
      const weekEnd = new Date(d);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const transactions = await db
        .select()
        .from(transaction)
        .where(
          and(
            eq(transaction.userId, userId),
            gte(transaction.transactionDate, weekStart),
            lte(transaction.transactionDate, weekEnd)
          )
        );

      const metrics = this.calculatePeriodMetrics(transactions);
      results.push({ startDate: weekStart, endDate: weekEnd, metrics });
    }

    return results;
  }

  /**
   * Calculate monthly metrics for a date range
   */
  private static async calculateMonthlyMetrics(userId: string, startDate: Date, endDate: Date): Promise<Array<{
    startDate: Date;
    endDate: Date;
    metrics: PeriodMetrics;
  }>> {
    const results: Array<{ startDate: Date; endDate: Date; metrics: PeriodMetrics }> = [];
    
    const firstMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    
    for (let month = new Date(firstMonth); month <= endDate; month.setMonth(month.getMonth() + 1)) {
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);

      const transactions = await db
        .select()
        .from(transaction)
        .where(
          and(
            eq(transaction.userId, userId),
            gte(transaction.transactionDate, monthStart),
            lte(transaction.transactionDate, monthEnd)
          )
        );

      const metrics = this.calculatePeriodMetrics(transactions);
      results.push({ startDate: monthStart, endDate: monthEnd, metrics });
    }

    return results;
  }

  /**
   * Calculate metrics from transaction data
   */
  private static calculatePeriodMetrics(transactions: typeof transaction.$inferSelect[]): PeriodMetrics {
    const incomeTransactions = transactions.filter(t => parseFloat(t.amount.toString()) > 0);
    const expenseTransactions = transactions.filter(t => parseFloat(t.amount.toString()) < 0);

    const incomeTotal = incomeTransactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    const expenseTotal = Math.abs(expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0));
    const savingsTotal = incomeTotal - expenseTotal;
    const savingsRate = incomeTotal > 0 ? (savingsTotal / incomeTotal) * 100 : 0;

    return {
      incomeTotal,
      expenseTotal,
      savingsTotal,
      savingsRate,
      transactionCount: transactions.length,
      averageTransaction: transactions.length > 0 ? 
        transactions.reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.toString())), 0) / transactions.length : 0
    };
  }

  /**
   * Get metrics for a specific day
   */
  private static async getDayMetrics(userId: string, date: Date): Promise<{
    date: Date;
    metrics: PeriodMetrics;
  } | null> {
    const dayStart = new Date(date);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const transactions = await db
      .select()
      .from(transaction)
      .where(
        and(
          eq(transaction.userId, userId),
          gte(transaction.transactionDate, dayStart),
          lte(transaction.transactionDate, dayEnd)
        )
      );

    const metrics = this.calculatePeriodMetrics(transactions);
    return { date, metrics };
  }

  /**
   * Get metrics for a specific week
   */
  private static async getWeekMetrics(userId: string, weekStart: Date): Promise<{
    startDate: Date;
    endDate: Date;
    metrics: PeriodMetrics;
  } | null> {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const transactions = await db
      .select()
      .from(transaction)
      .where(
        and(
          eq(transaction.userId, userId),
          gte(transaction.transactionDate, weekStart),
          lte(transaction.transactionDate, weekEnd)
        )
      );

    const metrics = this.calculatePeriodMetrics(transactions);
    return { startDate: weekStart, endDate: weekEnd, metrics };
  }

  /**
   * Get metrics for a specific month
   */
  private static async getMonthMetrics(userId: string, monthStart: Date): Promise<{
    startDate: Date;
    endDate: Date;
    metrics: PeriodMetrics;
  } | null> {
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);

    const transactions = await db
      .select()
      .from(transaction)
      .where(
        and(
          eq(transaction.userId, userId),
          gte(transaction.transactionDate, monthStart),
          lte(transaction.transactionDate, monthEnd)
        )
      );

    const metrics = this.calculatePeriodMetrics(transactions);
    return { startDate: monthStart, endDate: monthEnd, metrics };
  }

  /**
   * Get average metrics for a period
   */
  private static async getAverageMetrics(
    userId: string, 
    periodType: "daily" | "weekly" | "monthly", 
    startDate: Date, 
    endDate: Date
  ): Promise<{ metrics: PeriodMetrics } | null> {
    const transactions = await db
      .select()
      .from(transaction)
      .where(
        and(
          eq(transaction.userId, userId),
          gte(transaction.transactionDate, startDate),
          lte(transaction.transactionDate, endDate)
        )
      );

    const metrics = this.calculatePeriodMetrics(transactions);
    return { metrics };
  }

  /**
   * Calculate percentage change between two periods
   */
  private static calculatePercentageChange(current: PeriodMetrics, previous?: PeriodMetrics): number {
    if (!previous || previous.incomeTotal === 0) return 0;

    const currentIncome = current.incomeTotal;
    const previousIncome = previous.incomeTotal;

    return ((currentIncome - previousIncome) / Math.abs(previousIncome)) * 100;
  }

  /**
   * Store trend analysis in database
   */
  private static async storeTrendAnalysis(
    userId: string,
    periodTypeValue: "daily" | "weekly" | "monthly",
    periodStart: Date,
    periodEnd: Date,
    metrics: PeriodMetrics,
    comparisons: PeriodComparison
  ): Promise<void> {
    // TODO: Fix Drizzle ORM insert syntax
    // await db.insert(trendAnalysis).values({
    //   userId,
    //   periodType: periodTypeValue,
    //   periodStart: periodStart.toISOString().split('T')[0],
    //   periodEnd: periodEnd.toISOString().split('T')[0],
    //   metrics,
    //   comparisons
    // });
    console.log(`Would store trend analysis for user ${userId}, period ${periodTypeValue}`);
  }
}