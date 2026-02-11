import { and, eq } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@ts-connnect/db";
import { insight } from "@ts-connnect/db/schema/financial";
import { authMiddleware } from "@/middleware/auth";

export const resolveInsight = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context = {} as any, data = {} as any }) => {
    const session = context.session;
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const { insightId, action, notes } = data;

    if (!insightId) {
      throw new Error("Insight ID is required");
    }

    try {
      const [existingInsight] = await db
        .select()
        .from(insight)
        .where(and(eq(insight.id, insightId), eq(insight.userId, session.user.id)))
        .limit(1);

      if (!existingInsight) {
        throw new Error("Insight not found");
      }

      const status = action === "dismissed" ? "dismissed" : "resolved";

      const updatePayload: Partial<typeof insight.$inferInsert> = {
        status,
        resolvedAt: new Date(),
        updatedAt: new Date(),
      };

      if (notes) {
        const mergedSupportingData = {
          ...(existingInsight.supportingData && typeof existingInsight.supportingData === "object"
            ? existingInsight.supportingData
            : {}),
          resolutionNotes: notes,
        };

        updatePayload.supportingData = mergedSupportingData;
      }

      const [updatedInsight] = await db
        .update(insight)
        .set(updatePayload)
        .where(and(eq(insight.id, insightId), eq(insight.userId, session.user.id)))
        .returning();

      if (!updatedInsight) {
        throw new Error("Insight not found");
      }

      const mappedInsight = {
        ...updatedInsight,
        type: updatedInsight.insightType,
      };

      return {
        success: true,
        message: "Insight updated successfully",
        data: mappedInsight,
      };
    } catch (error) {
      console.error("Error resolving insight:", error);
      if (error instanceof Error && error.message === "Insight not found") {
        throw error;
      }
      throw new Error("Failed to resolve insight");
    }
  });
