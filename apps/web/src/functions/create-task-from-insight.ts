import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/middleware/auth";

export const createTaskFromInsight = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context = {} as any, data = {} as any }) => {
    const session = context.session;
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const { insightId, taskType, dueDate, priority } = data;

    try {
      // TODO: Import and use task management service
      // const task = await TaskManager.createTaskFromInsight(session.user.id, insightId, taskType, dueDate, priority);
      
      // Mock task creation
      const mockTask = {
        id: "task_" + Date.now(),
        sourceInsightId: insightId,
        title: "Review spending patterns",
        description: "Review recent spending to identify areas for improvement based on insight",
        taskType: taskType || "spending_review",
        priority: priority || "medium",
        status: "open",
        dueDate: dueDate ? new Date(dueDate) : null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return { 
        success: true, 
        message: "Task created successfully",
        data: mockTask
      };
    } catch (error) {
      console.error("Error creating task from insight:", error);
      throw new Error("Failed to create task");
    }
  });