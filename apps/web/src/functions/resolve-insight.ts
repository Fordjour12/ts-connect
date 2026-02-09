import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/middleware/auth";

export const resolveInsight = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context = {} as any, data = {} as any }) => {
    const session = context.session;
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const { insightId, action, notes } = data;

    try {
      // TODO: Import and use insight management service
      // await InsightManager.resolveInsight(session.user.id, insightId, action, notes);
      
      // Mock successful resolution
      console.log(`Resolving insight ${insightId} with action: ${action}`);
      
      return { 
        success: true, 
        message: "Insight resolved successfully",
        data: {
          insightId,
          status: "resolved",
          resolvedAt: new Date(),
          action,
          notes
        }
      };
    } catch (error) {
      console.error("Error resolving insight:", error);
      throw new Error("Failed to resolve insight");
    }
  });