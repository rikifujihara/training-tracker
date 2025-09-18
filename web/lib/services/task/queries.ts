import { prisma } from "@/lib/prisma";
import { Task, TaskWithRelations } from "@/lib/types/task";

/**
 * Task query operations
 */
export class TaskQueries {
  /**
   * Get all tasks for a user
   */
  static async getTasksByUserId(userId: string): Promise<Task[]> {
    return await prisma.task.findMany({
      where: { userId },
      orderBy: { dueDate: "asc" },
    });
  }

  /**
   * Get all tasks for a specific lead
   */
  static async getTasksByLeadId(leadId: string, userId: string): Promise<Task[]> {
    const lead = await prisma.lead.findFirst({
      where: { id: leadId, userId },
    });

    if (!lead) {
      throw new Error("Lead not found or you don't have permission to access it");
    }

    return await prisma.task.findMany({
      where: { leadId, userId },
      orderBy: { dueDate: "asc" },
    });
  }

  /**
   * Get tasks with lead and message template information
   */
  static async getTasksWithRelations(userId: string): Promise<TaskWithRelations[]> {
    return await prisma.task.findMany({
      where: { userId },
      include: {
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        messageTemplate: {
          select: {
            id: true,
            name: true,
            content: true,
          },
        },
      },
      orderBy: { dueDate: "asc" },
    });
  }

  /**
   * Get a single task by ID
   */
  static async getTaskById(taskId: string, userId: string): Promise<Task | null> {
    return await prisma.task.findFirst({
      where: { id: taskId, userId },
    });
  }

  /**
   * Get a single task by ID with relations
   */
  static async getTaskByIdWithRelations(taskId: string, userId: string): Promise<TaskWithRelations | null> {
    return await prisma.task.findFirst({
      where: { id: taskId, userId },
      include: {
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        messageTemplate: {
          select: {
            id: true,
            name: true,
            content: true,
          },
        },
      },
    });
  }

  /**
   * Get task statistics for a user using client-provided date ranges
   */
  static async getTaskStats(
    userId: string,
    dateRanges: {
      today: { startDate: Date; endDate: Date };
      overdue: { startDate?: Date; endDate: Date };
      upcoming: { startDate: Date; endDate?: Date };
    }
  ) {
    // Get total and completed task counts
    const totalTasks = await prisma.task.count({
      where: { userId },
    });

    const completedTasks = await prisma.task.count({
      where: { userId, status: 'COMPLETED' },
    });

    const pendingTasks = await prisma.task.count({
      where: { userId, status: 'PENDING' },
    });

    // Count tasks by date ranges
    const todayTasks = await prisma.task.count({
      where: {
        userId,
        status: 'PENDING',
        dueDate: {
          gte: dateRanges.today.startDate,
          lte: dateRanges.today.endDate,
        },
      },
    });

    const overdueTasks = await prisma.task.count({
      where: {
        userId,
        status: 'PENDING',
        dueDate: {
          lt: dateRanges.overdue.endDate,
        },
      },
    });

    const upcomingTasks = await prisma.task.count({
      where: {
        userId,
        status: 'PENDING',
        dueDate: {
          gte: dateRanges.upcoming.startDate,
        },
      },
    });

    return {
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      overdue: overdueTasks,
      today: todayTasks,
      upcoming: upcomingTasks,
    };
  }

  /**
   * Get upcoming tasks for a user within a date range
   */
  static async getUpcomingTasks(
    userId: string,
    dateRange: { startDate: Date; endDate: Date }
  ): Promise<TaskWithRelations[]> {
    return await prisma.task.findMany({
      where: {
        userId,
        status: 'PENDING',
        dueDate: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
      },
      include: {
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        messageTemplate: {
          select: {
            id: true,
            name: true,
            content: true,
          },
        },
      },
      orderBy: { dueDate: "asc" },
    });
  }

  /**
   * Get overdue tasks for a user (before a specific date)
   */
  static async getOverdueTasks(
    userId: string,
    beforeDate: Date
  ): Promise<TaskWithRelations[]> {
    return await prisma.task.findMany({
      where: {
        userId,
        status: 'PENDING',
        dueDate: {
          lt: beforeDate,
        },
      },
      include: {
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
        messageTemplate: {
          select: {
            id: true,
            name: true,
            content: true,
          },
        },
      },
      orderBy: { dueDate: "asc" },
    });
  }
}