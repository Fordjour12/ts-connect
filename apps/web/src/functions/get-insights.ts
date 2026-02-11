import { and, desc, eq } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@ts-connnect/db";
import { SignalDetectionEngine } from "@ts-connnect/db/services";
import { insight } from "@ts-connnect/db/schema/financial";
import { authMiddleware } from "@/middleware/auth";

export const getInsights = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context = {} as any }) => {
    const session = context.session;
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    try {
      SignalDetectionEngine.triggerSignalRefresh(session.user.id);

      const insights = await db
        .select()
        .from(insight)
        .where(and(eq(insight.userId, session.user.id), eq(insight.status, "active")))
        .orderBy(desc(insight.severity), desc(insight.createdAt))
        .limit(25);

      const mappedInsights = insights.map(row => ({
        ...row,
        type: row.insightType,
      }));

      return { success: true, data: mappedInsights };
    } catch (error) {
      console.error("Error fetching insights:", error);
      throw new Error("Failed to fetch insights");
    }
  });
