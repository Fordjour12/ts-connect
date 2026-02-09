import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/middleware/auth";

export const getInsights = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context = {} as any }) => {
    const session = context.session;
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    try {
      // TODO: Import and use SignalDetectionEngine
      // const insights = await SignalDetectionEngine.getInsights(session.user.id, { status, severity, limit });
      
      // Mock data for now
      const mockInsights = [
        {
          id: "1",
          type: "spending_spike",
          severity: "high",
          title: "Spending Spike Detected",
          explanation: "Your spending increased by 35% compared to your recent average. This spike may indicate unusual expenses or a change in spending patterns that warrants attention.",
          supportingData: {
            currentSpending: 2500,
            historicalAverage: 1850,
            percentageIncrease: 35.1
          },
          status: "active",
          createdAt: new Date(),
          resolvedAt: null,
          updatedAt: new Date()
        },
        {
          id: "2",
          type: "budget_leakage",
          severity: "medium",
          title: "Projected Budget Overrun: Dining",
          explanation: "Based on your current spending pace, you're projected to exceed your Dining budget by 15.3% ($185) by the end of the month. With 8 days remaining, consider adjusting your spending or budget allocation.",
          supportingData: {
            categoryName: "Dining",
            currentSpending: 420,
            projectedTotal: 485,
            budgetAmount: 420,
            overage: 65,
            overagePercentage: 15.5,
            daysRemaining: 8
          },
          status: "active",
          createdAt: new Date(),
          resolvedAt: null,
          updatedAt: new Date()
        },
        {
          id: "3",
          type: "savings_drop",
          severity: "critical",
          title: "Savings Depletion Warning",
          explanation: "At your current savings rate, your savings are projected to run out in 2.3 months. Consider increasing income or reducing expenses to extend your runway.",
          supportingData: {
            currentSavings: 3500,
            monthlyBurnRate: 1520,
            monthsOfRunway: 2.3,
            projectedDepletionDate: new Date(Date.now() + 2.3 * 30 * 24 * 60 * 60 * 1000),
            recommendedActions: ["Review and reduce non-essential expenses", "Consider temporarily pausing some financial goals"]
          },
          status: "active",
          createdAt: new Date(),
          resolvedAt: null,
          updatedAt: new Date()
        }
      ];

      return { success: true, data: mockInsights };
    } catch (error) {
      console.error("Error fetching insights:", error);
      throw new Error("Failed to fetch insights");
    }
  });