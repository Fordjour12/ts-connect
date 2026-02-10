import { createServerFn } from "@tanstack/react-start";
import { FinancialHealthCalculator } from "@ts-connnect/db/services";
import { authMiddleware } from "@/middleware/auth";

export const getFinancialHealth = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context = {} as any }) => {
    const session = context.session;
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    try {
      const healthScore = await FinancialHealthCalculator.calculateHealthScore(session.user.id);
      return { success: true, data: healthScore };
    } catch (error) {
      console.error("Error calculating financial health:", error);
      throw new Error("Failed to calculate financial health score");
    }
  });
