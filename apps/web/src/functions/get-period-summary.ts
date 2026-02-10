import { and, eq, gte, lt } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@ts-connnect/db";
import { transaction } from "@ts-connnect/db/schema/financial";
import { authMiddleware } from "@/middleware/auth";

type PeriodSummary = {
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
  transactionCount: number;
  period: string;
};

const summarizePeriod = (periodTransactions: Array<typeof transaction.$inferSelect>, label: string): PeriodSummary => {
  const income = periodTransactions
    .filter((entry) => Number(entry.amount) > 0)
    .reduce((sum, entry) => sum + Number(entry.amount), 0);

  const expenses = Math.abs(
    periodTransactions
      .filter((entry) => Number(entry.amount) < 0)
      .reduce((sum, entry) => sum + Number(entry.amount), 0),
  );

  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  return {
    income,
    expenses,
    savings,
    savingsRate,
    transactionCount: periodTransactions.length,
    period: label,
  };
};

const pctChange = (current: number, previous: number) => {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
};

const trendLabel = (change: number): "stable" | "increasing" | "decreasing" => {
  if (change > 2) return "increasing";
  if (change < -2) return "decreasing";
  return "stable";
};

export const getPeriodSummary = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context = {} as any }) => {
    const session = context.session;
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    try {
      const now = new Date();
      const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const currentTransactions = await db
        .select()
        .from(transaction)
        .where(
          and(
            eq(transaction.userId, session.user.id),
            gte(transaction.transactionDate, currentStart),
            lt(transaction.transactionDate, nextMonthStart),
          ),
        );

      const previousTransactions = await db
        .select()
        .from(transaction)
        .where(
          and(
            eq(transaction.userId, session.user.id),
            gte(transaction.transactionDate, previousStart),
            lt(transaction.transactionDate, currentStart),
          ),
        );

      const currentPeriod = summarizePeriod(
        currentTransactions,
        currentStart.toLocaleString("en-US", { month: "long", year: "numeric" }),
      );

      const previousPeriod = summarizePeriod(
        previousTransactions,
        previousStart.toLocaleString("en-US", { month: "long", year: "numeric" }),
      );

      const comparison = {
        incomeChange: pctChange(currentPeriod.income, previousPeriod.income),
        expenseChange: pctChange(currentPeriod.expenses, previousPeriod.expenses),
        savingsChange: pctChange(currentPeriod.savings, previousPeriod.savings),
        savingsRateChange: currentPeriod.savingsRate - previousPeriod.savingsRate,
        transactionChange: pctChange(currentPeriod.transactionCount, previousPeriod.transactionCount),
      };

      return {
        success: true,
        data: {
          currentPeriod,
          previousPeriod,
          comparison,
          trends: {
            incomeTrend: trendLabel(comparison.incomeChange),
            expenseTrend: trendLabel(comparison.expenseChange),
            savingsTrend: trendLabel(comparison.savingsChange),
          },
        },
      };
    } catch (error) {
      console.error("Error fetching period summary:", error);
      throw new Error("Failed to fetch period summary");
    }
  });
