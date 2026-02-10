import { createServerFn } from "@tanstack/react-start";
import { TaskManagementSystem } from "@ts-connnect/db/services";
import { authMiddleware } from "@/middleware/auth";

export const createTaskFromInsight = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context = {} as any, data = {} as any }) => {
    const session = context.session;
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const { insightId, dueDate, priority, customTitle, customDescription } = data;

    if (!insightId) {
      throw new Error("Insight ID is required");
    }

    try {
      const task = await TaskManagementSystem.createTaskFromInsight(
        session.user.id,
        insightId,
        customTitle,
        customDescription,
        dueDate ? new Date(dueDate) : undefined,
        priority,
      );

      return {
        success: true,
        message: "Task created successfully",
        data: task,
      };
    } catch (error) {
      console.error("Error creating task from insight:", error);
      throw new Error("Failed to create task");
    }
  });
