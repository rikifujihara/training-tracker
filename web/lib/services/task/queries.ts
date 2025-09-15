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
   * Get task statistics for a user
   */
  static async getTaskStats(userId: string) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // Get all tasks for the user
    const tasks = await prisma.task.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        dueDate: true,
        completedAt: true,
      },
    });

    let totalTasks = 0;
    let completedTasks = 0;
    let pendingTasks = 0;
    let overdueTasks = 0;
    let todayTasks = 0;
    let upcomingTasks = 0;

    tasks.forEach(task => {
      totalTasks++;

      if (task.status === 'COMPLETED') {
        completedTasks++;
      } else {
        pendingTasks++;

        const taskDueDate = new Date(task.dueDate);

        if (taskDueDate < todayStart) {
          overdueTasks++;
        } else if (taskDueDate >= todayStart && taskDueDate < todayEnd) {
          todayTasks++;
        } else {
          upcomingTasks++;
        }
      }
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
   * Get upcoming tasks for a user within specified days
   */
  static async getUpcomingTasks(userId: string, days: number = 7): Promise<TaskWithRelations[]> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));

    return await prisma.task.findMany({
      where: {
        userId,
        status: 'PENDING',
        dueDate: {
          gte: now,
          lte: futureDate,
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
   * Get overdue tasks for a user
   */
  static async getOverdueTasks(userId: string): Promise<TaskWithRelations[]> {
    const now = new Date();

    return await prisma.task.findMany({
      where: {
        userId,
        status: 'PENDING',
        dueDate: {
          lt: now,
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