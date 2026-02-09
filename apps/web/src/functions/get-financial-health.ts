import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/middleware/auth";

export const getFinancialHealth = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context = {} as any }) => {
    const session = context.session;
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    try {
      // TODO: Import and use FinancialHealthCalculator
      // const healthScore = await FinancialHealthCalculator.calculateHealthScore(session.user.id);
      
      // Mock data for now
      const mockHealthScore = {
        score: 75,
        healthState: "improving" as const,
        trendDirection: "improving" as const,
        components: {
          savingsRate: 80,
          budgetAdherence: 75,
          incomeStability: 90,
          expenseVolatility: 70,
          goalProgress: 65
        },
        previousScore: 70
      };

      return { success: true, data: mockHealthScore };
    } catch (error) {
      console.error("Error calculating financial health:", error);
      throw new Error("Failed to calculate financial health score");
    }
  });