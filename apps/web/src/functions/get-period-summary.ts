import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/middleware/auth";

export const getPeriodSummary = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context = {} as any }) => {
    const session = context.session;
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    try {
      // TODO: Import and use TrendAnalysisEngine
      // const summary = await TrendAnalysisEngine.getPeriodSummary(session.user.id, period, comparisonPeriod);
      
      // Mock period summary data
      const mockSummary = {
        currentPeriod: {
          income: 5200,
          expenses: 3850,
          savings: 1350,
          savingsRate: 26.0,
          transactionCount: 45,
          period: "January 2024"
        },
        previousPeriod: {
          income: 5100,
          expenses: 3200,
          savings: 1900,
          savingsRate: 37.3,
          transactionCount: 52,
          period: "December 2023"
        },
        comparison: {
          incomeChange: 1.96,
          expenseChange: 20.31,
          savingsChange: -28.95,
          savingsRateChange: -11.3,
          transactionChange: -13.46
        },
        trends: {
          incomeTrend: "stable",
          expenseTrend: "increasing",
          savingsTrend: "decreasing"
        }
      };

      return { success: true, data: mockSummary };
    } catch (error) {
      console.error("Error fetching period summary:", error);
      throw new Error("Failed to fetch period summary");
    }
  });