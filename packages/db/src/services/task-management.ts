import { and, eq, gte, lte, desc, asc, lt, inArray } from "drizzle-orm";
import { db } from "../index";
import { 
  task, 
  insight,
  taskType,
  taskPriority,
  taskStatus
} from "../schema/financial";
import { nanoid } from "nanoid";

export interface TaskData {
  userId: string;
  sourceInsightId?: string;
  title: string;
  description?: string;
  taskType: typeof taskType.enumValues[number];
  priority: typeof taskPriority.enumValues[number];
  dueDate?: Date;
}

export interface TaskFilters {
  status?: typeof taskStatus.enumValues[number];
  priority?: typeof taskPriority.enumValues[number];
  taskType?: typeof taskType.enumValues[number];
  sourceInsightId?: string;
  dueBefore?: Date;
  dueAfter?: Date;
  limit?: number;
  offset?: number;
}

export class TaskManagementSystem {
  /**
   * Create a new task
   */
  static async createTask(taskData: TaskData): Promise<typeof task.$inferSelect> {
    const newTask = {
      id: nanoid(),
      userId: taskData.userId,
      sourceInsightId: taskData.sourceInsightId,
      title: taskData.title,
      description: taskData.description,
      taskType: taskData.taskType,
      priority: taskData.priority,
      status: "open" as const,
      dueDate: taskData.dueDate,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const [result] = await db.insert(task).values(newTask).returning();
    return result!;
  }

  /**
   * Create a task from an insight
   */
  static async createTaskFromInsight(
    userId: string,
    insightId: string,
    customTitle?: string,
    customDescription?: string,
    dueDate?: Date,
    priority?: typeof taskPriority.enumValues[number]
  ): Promise<typeof task.$inferSelect> {
    // First, get the insight details
    const [insightData] = await db
      .select()
      .from(insight)
      .where(and(eq(insight.id, insightId), eq(insight.userId, userId)))
      .limit(1);

    if (!insightData) {
      throw new Error("Insight not found");
    }

    // Generate task details based on insight type
    const taskDetails = this.generateTaskFromInsight(insightData, customTitle, customDescription, priority);

    return this.createTask({
      userId,
      sourceInsightId: insightId,
      title: taskDetails.title,
      description: taskDetails.description,
      taskType: taskDetails.taskType,
      priority: priority || taskDetails.priority,
      dueDate
    });
  }

  /**
   * Generate task details from insight data
   */
  private static generateTaskFromInsight(
    insightData: typeof insight.$inferSelect,
    customTitle?: string,
    customDescription?: string,
    priority?: typeof taskPriority.enumValues[number]
  ): {
    title: string;
    description: string;
    taskType: typeof taskType.enumValues[number];
    priority: typeof taskPriority.enumValues[number];
  } {
    const baseTitle = customTitle || `Review: ${insightData.title}`;
    const baseDescription = customDescription || insightData.explanation;

    switch (insightData.insightType) {
      case "spending_spike":
        return {
          title: baseTitle,
          description: `${baseDescription}\n\nSuggested actions:\n• Review recent transactions to identify the source of the spike\n• Consider if these are one-time expenses or new patterns\n• Adjust budget categories if this becomes a new normal\n• Set up spending alerts for future monitoring`,
          taskType: "spending_review",
          priority: priority || this.mapSeverityToPriority(insightData.severity)
        };

      case "savings_drop":
        return {
          title: baseTitle,
          description: `${baseDescription}\n\nSuggested actions:\n• Review recent expense increases\n• Identify areas where spending can be reduced\n• Consider increasing income sources\n• Adjust savings goals if needed`,
          taskType: "goal_review",
          priority: priority || this.mapSeverityToPriority(insightData.severity)
        };

      case "budget_leakage":
        return {
          title: baseTitle,
          description: `${baseDescription}\n\nSuggested actions:\n• Review spending in the affected category\n• Adjust budget allocations if needed\n• Set up category-specific spending alerts\n• Consider setting spending limits`,
          taskType: "budget_adjustment",
          priority: priority || this.mapSeverityToPriority(insightData.severity)
        };

      case "income_dip":
        return {
          title: baseTitle,
          description: `${baseDescription}\n\nSuggested actions:\n• Review income sources for stability\n• Consider additional income streams\n• Adjust budget to account for lower income\n• Review and prioritize essential expenses`,
          taskType: "spending_review",
          priority: priority || this.mapSeverityToPriority(insightData.severity)
        };

      case "debt_growth":
        return {
          title: baseTitle,
          description: `${baseDescription}\n\nSuggested actions:\n• Review debt payment strategy\n• Consider debt consolidation options\n• Ensure payments are going toward principal\n• Review interest rates and refinancing opportunities`,
          taskType: "payment_reminder",
          priority: priority || this.mapSeverityToPriority(insightData.severity)
        };

      case "transaction_silence":
        return {
          title: baseTitle,
          description: `${baseDescription}\n\nSuggested actions:\n• Check if transactions are being imported correctly\n• Consider manual entry of recent transactions\n• Review account connections\n• Set up transaction reminders`,
          taskType: "account_review",
          priority: "low"
        };

      default:
        return {
          title: baseTitle,
          description: baseDescription,
          taskType: "spending_review",
          priority: priority || "medium"
        };
    }
  }

  /**
   * Map insight severity to task priority
   */
  private static mapSeverityToPriority(severity: string): typeof taskPriority.enumValues[number] {
    switch (severity) {
      case "critical":
        return "urgent";
      case "high":
        return "high";
      case "medium":
        return "medium";
      case "low":
        return "low";
      default:
        return "medium";
    }
  }

  /**
   * Get tasks for a user with optional filters
   */
  static async getTasks(userId: string, filters: TaskFilters = {}): Promise<typeof task.$inferSelect[]> {
    const conditions = [eq(task.userId, userId)];
    
    if (filters.status) {
      conditions.push(eq(task.status, filters.status));
    }
    
    if (filters.priority) {
      conditions.push(eq(task.priority, filters.priority));
    }
    
    if (filters.taskType) {
      conditions.push(eq(task.taskType, filters.taskType));
    }
    
    if (filters.sourceInsightId) {
      conditions.push(eq(task.sourceInsightId, filters.sourceInsightId));
    }
    
    if (filters.dueBefore) {
      conditions.push(lte(task.dueDate, filters.dueBefore));
    }
    
    if (filters.dueAfter) {
      conditions.push(gte(task.dueDate, filters.dueAfter));
    }

    const query = db
      .select()
      .from(task)
      .where(and(...conditions));

    if (filters.limit) {
      query.limit(filters.limit);
    }
    
    if (filters.offset) {
      query.offset(filters.offset);
    }

    // Default ordering: priority desc, then due date asc, then created date desc
    query.orderBy(
      desc(task.priority),
      asc(task.dueDate),
      desc(task.createdAt)
    );

    return query;
  }

  /**
   * Update task status
   */
  static async updateTaskStatus(
    userId: string,
    taskId: string,
    status: typeof taskStatus.enumValues[number],
    notes?: string
  ): Promise<typeof task.$inferSelect> {
    // Verify task belongs to user
    const [existingTask] = await db
      .select()
      .from(task)
      .where(and(eq(task.id, taskId), eq(task.userId, userId)))
      .limit(1);

    if (!existingTask) {
      throw new Error("Task not found or access denied");
    }

    const updates: any = {
      status,
      updatedAt: new Date()
    };

    if (status === "completed") {
      updates.completedAt = new Date();
    }

    if (notes) {
      updates.description = existingTask.description ? 
        `${existingTask.description}\n\nNotes: ${notes}` : 
        `Notes: ${notes}`;
    }

    const [result] = await db
      .update(task)
      .set(updates)
      .where(eq(task.id, taskId))
      .returning();

    return result!;
  }

  /**
   * Delete a task
   */
  static async deleteTask(userId: string, taskId: string): Promise<void> {
    const result = await db
      .delete(task)
      .where(and(eq(task.id, taskId), eq(task.userId, userId)));

    if (result.rowCount === 0) {
      throw new Error("Task not found or access denied");
    }
  }

  /**
   * Get task statistics for a user
   */
  static async getTaskStatistics(userId: string): Promise<{
    total: number;
    open: number;
    inProgress: number;
    completed: number;
    overdue: number;
    byPriority: Record<string, number>;
    byType: Record<string, number>;
  }> {
    const tasks = await db
      .select()
      .from(task)
      .where(eq(task.userId, userId));

    const now = new Date();
    const stats = {
      total: tasks.length,
      open: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
      byPriority: {} as Record<string, number>,
      byType: {} as Record<string, number>
    };

    for (const task of tasks) {
      // Count by status
      switch (task.status) {
        case "open":
          stats.open++;
          break;
        case "in_progress":
          stats.inProgress++;
          break;
        case "completed":
          stats.completed++;
          break;
      }

      // Count by priority
      stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1;

      // Count by type
      stats.byType[task.taskType] = (stats.byType[task.taskType] || 0) + 1;

      // Check if overdue
      if (task.dueDate && task.dueDate < now && task.status !== "completed") {
        stats.overdue++;
      }
    }

    return stats;
  }

  /**
   * Get upcoming tasks (due within 7 days)
   */
  static async getUpcomingTasks(userId: string, days: number = 7): Promise<typeof task.$inferSelect[]> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));

    return db
      .select()
      .from(task)
      .where(
        and(
          eq(task.userId, userId),
          eq(task.status, "open"),
          gte(task.dueDate, now),
          lte(task.dueDate, futureDate)
        )
      )
      .orderBy(asc(task.dueDate))
      .limit(20);
  }

  /**
   * Get overdue tasks
   */
  static async getOverdueTasks(userId: string): Promise<typeof task.$inferSelect[]> {
    const now = new Date();

    return db
      .select()
      .from(task)
      .where(
        and(
          eq(task.userId, userId),
          eq(task.status, "open"),
          lt(task.dueDate, now)
        )
      )
      .orderBy(asc(task.dueDate));
  }

  /**
   * Bulk update task status
   */
  static async bulkUpdateTaskStatus(
    userId: string,
    taskIds: string[],
    status: typeof taskStatus.enumValues[number]
  ): Promise<number> {
    const updates: any = {
      status,
      updatedAt: new Date()
    };

    if (status === "completed") {
      updates.completedAt = new Date();
    }

    const result = await db
      .update(task)
      .set(updates)
      .where(
        and(
          eq(task.userId, userId),
          inArray(task.id, taskIds)
        )
      );

    return result.rowCount || 0;
  }
}