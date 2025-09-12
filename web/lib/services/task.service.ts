import { prisma } from "@/lib/prisma";
import { Task, CreateTaskInput, UpdateTaskInput, TaskWithRelations, TaskType, TaskStatus } from "@/lib/types/task";

export class TaskService {
  /**
   * Create a task for a lead
   */
  static async createTask(
    userId: string, 
    data: CreateTaskInput
  ): Promise<Task> {
    // Verify the lead belongs to the user
    const lead = await prisma.lead.findFirst({
      where: {
        id: data.leadId,
        userId,
      },
    });

    if (!lead) {
      throw new Error("Lead not found or access denied");
    }

    // If messageTemplateId is provided, verify it belongs to the user
    if (data.messageTemplateId) {
      const template = await prisma.messageTemplate.findFirst({
        where: {
          id: data.messageTemplateId,
          userId,
        },
      });

      if (!template) {
        throw new Error("Message template not found or access denied");
      }
    }

    const task = await prisma.task.create({
      data: {
        userId,
        leadId: data.leadId,
        title: data.title.trim(),
        description: data.description?.trim() || null,
        dueDate: data.dueDate,
        taskType: data.taskType,
        messageTemplateId: data.messageTemplateId || null,
        updatedAt: new Date(),
      },
    });

    return task;
  }

  /**
   * Get all tasks for a user
   */
  static async getTasksByUserId(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { userId },
      orderBy: [
        { status: 'asc' }, // Pending first
        { dueDate: 'asc' }, // Earliest due date first
      ],
    });
  }

  /**
   * Get all tasks for a specific lead
   */
  static async getTasksByLeadId(leadId: string, userId: string): Promise<Task[]> {
    // Verify the lead belongs to the user
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        userId,
      },
    });

    if (!lead) {
      throw new Error("Lead not found or access denied");
    }

    return prisma.task.findMany({
      where: { leadId },
      orderBy: [
        { status: 'asc' }, // Pending first
        { dueDate: 'asc' }, // Earliest due date first
      ],
    });
  }

  /**
   * Get tasks with lead and template information
   */
  static async getTasksWithRelations(userId: string): Promise<TaskWithRelations[]> {
    return prisma.task.findMany({
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
      orderBy: [
        { status: 'asc' }, // Pending first
        { dueDate: 'asc' }, // Earliest due date first
      ],
    });
  }

  /**
   * Get task by ID (with user ownership check)
   */
  static async getTaskById(taskId: string, userId: string): Promise<Task | null> {
    return prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });
  }

  /**
   * Get task by ID with relations
   */
  static async getTaskByIdWithRelations(taskId: string, userId: string): Promise<TaskWithRelations | null> {
    return prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
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
    });
  }

  /**
   * Update a task
   */
  static async updateTask(
    taskId: string,
    userId: string,
    data: UpdateTaskInput
  ): Promise<Task> {
    // First check if task belongs to user
    const existingTask = await this.getTaskById(taskId, userId);
    if (!existingTask) {
      throw new Error("Task not found or access denied");
    }

    // If messageTemplateId is being updated, verify it belongs to the user
    if (data.messageTemplateId) {
      const template = await prisma.messageTemplate.findFirst({
        where: {
          id: data.messageTemplateId,
          userId,
        },
      });

      if (!template) {
        throw new Error("Message template not found or access denied");
      }
    }

    // Build update object with proper typing
    const updateData: {
      title?: string;
      description?: string | null;
      dueDate?: Date;
      taskType?: TaskType;
      status?: TaskStatus;
      messageTemplateId?: string | null;
      completedAt?: Date | null;
      notes?: string | null;
    } = {};
    
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.description !== undefined) updateData.description = data.description?.trim() || null;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
    if (data.taskType !== undefined) updateData.taskType = data.taskType;
    if (data.messageTemplateId !== undefined) updateData.messageTemplateId = data.messageTemplateId || null;
    if (data.notes !== undefined) updateData.notes = data.notes?.trim() || null;
    
    if (data.status !== undefined) {
      updateData.status = data.status;
      
      // If marking as completed and no completedAt provided, set it to now
      if (data.status === TaskStatus.COMPLETED && !data.completedAt) {
        updateData.completedAt = new Date();
      }
      // If marking as pending, clear completedAt
      else if (data.status === TaskStatus.PENDING) {
        updateData.completedAt = null;
      }
    }
    
    if (data.completedAt !== undefined) {
      updateData.completedAt = data.completedAt;
    }

    return prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });
  }

  /**
   * Delete a task
   */
  static async deleteTask(taskId: string, userId: string): Promise<void> {
    // First check if task belongs to user
    const existingTask = await this.getTaskById(taskId, userId);
    if (!existingTask) {
      throw new Error("Task not found or access denied");
    }

    await prisma.task.delete({
      where: { id: taskId },
    });
  }

  /**
   * Mark task as completed
   */
  static async markTaskCompleted(taskId: string, userId: string, notes?: string): Promise<Task> {
    return this.updateTask(taskId, userId, {
      status: TaskStatus.COMPLETED,
      completedAt: new Date(),
      notes,
    });
  }

  /**
   * Get task statistics for a user
   */
  static async getTaskStats(userId: string) {
    const [total, pending, completed, overdue, byType, dueToday, dueThisWeek] = await Promise.all([
      // Total tasks
      prisma.task.count({ where: { userId } }),
      
      // Pending tasks
      prisma.task.count({ where: { userId, status: TaskStatus.PENDING } }),
      
      // Completed tasks
      prisma.task.count({ where: { userId, status: TaskStatus.COMPLETED } }),
      
      // Overdue tasks (pending and past due date)
      prisma.task.count({
        where: {
          userId,
          status: TaskStatus.PENDING,
          dueDate: {
            lt: new Date(),
          },
        },
      }),
      
      // Group by task type
      prisma.task.groupBy({
        by: ['taskType'],
        where: { userId },
        _count: { taskType: true },
      }),
      
      // Due today
      prisma.task.count({
        where: {
          userId,
          status: TaskStatus.PENDING,
          dueDate: {
            gte: (() => {
              const now = new Date();
              return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
            })(),
            lt: (() => {
              const now = new Date();
              return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
            })(),
          },
        },
      }),
      
      // Due this week
      prisma.task.count({
        where: {
          userId,
          status: TaskStatus.PENDING,
          dueDate: {
            gte: new Date(),
            lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      total,
      pending,
      completed,
      overdue,
      dueToday,
      dueThisWeek,
      byType: byType.reduce((acc, item) => {
        acc[item.taskType] = item._count.taskType;
        return acc;
      }, {} as Record<TaskType, number>),
    };
  }

  /**
   * Get upcoming tasks for a user
   */
  static async getUpcomingTasks(userId: string, days: number = 7): Promise<TaskWithRelations[]> {
    const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    
    return prisma.task.findMany({
      where: {
        userId,
        status: TaskStatus.PENDING,
        dueDate: {
          gte: new Date(),
          lte: endDate,
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
      orderBy: { dueDate: 'asc' },
    });
  }

  /**
   * Get overdue tasks for a user
   */
  static async getOverdueTasks(userId: string): Promise<TaskWithRelations[]> {
    return prisma.task.findMany({
      where: {
        userId,
        status: TaskStatus.PENDING,
        dueDate: {
          lt: new Date(),
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
      orderBy: { dueDate: 'asc' },
    });
  }
}