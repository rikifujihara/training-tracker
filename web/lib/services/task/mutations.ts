import { prisma } from "@/lib/prisma";
import { CreateTaskInput, UpdateTaskInput, Task } from "@/lib/types/task";

/**
 * Task mutation operations
 */
export class TaskMutations {
  /**
   * Create a new task
   */
  static async createTask(
    userId: string,
    data: CreateTaskInput
  ): Promise<Task> {
    // Verify the lead exists and belongs to the user
    const lead = await prisma.lead.findFirst({
      where: { id: data.leadId, userId },
    });

    if (!lead) {
      throw new Error("Lead not found or you don't have permission to create tasks for it");
    }

    // If a message template is specified, verify it exists and belongs to the user
    if (data.messageTemplateId) {
      const template = await prisma.messageTemplate.findFirst({
        where: { id: data.messageTemplateId, userId },
      });

      if (!template) {
        throw new Error("Message template not found or you don't have permission to use it");
      }
    }

    // Create the task
    return await prisma.task.create({
      data: {
        userId,
        leadId: data.leadId,
        title: data.title,
        description: data.description || null,
        dueDate: data.dueDate,
        taskType: data.taskType,
        messageTemplateId: data.messageTemplateId || null,
        status: 'PENDING',
        updatedAt: new Date(),
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
    // Verify the task exists and belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!existingTask) {
      throw new Error("Task not found or you don't have permission to update it");
    }

    // If a message template is being updated, verify it exists and belongs to the user
    if (data.messageTemplateId !== undefined) {
      if (data.messageTemplateId) {
        const template = await prisma.messageTemplate.findFirst({
          where: { id: data.messageTemplateId, userId },
        });

        if (!template) {
          throw new Error("Message template not found or you don't have permission to use it");
        }
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) {
      updateData.title = data.title;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate;
    }
    if (data.taskType !== undefined) {
      updateData.taskType = data.taskType;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.messageTemplateId !== undefined) {
      updateData.messageTemplateId = data.messageTemplateId;
    }
    if (data.completedAt !== undefined) {
      updateData.completedAt = data.completedAt;
    }
    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    // Always update the updatedAt timestamp
    updateData.updatedAt = new Date();

    return await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });
  }

  /**
   * Delete a task
   */
  static async deleteTask(taskId: string, userId: string): Promise<void> {
    // Verify the task exists and belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!existingTask) {
      throw new Error("Task not found or you don't have permission to delete it");
    }

    await prisma.task.delete({
      where: { id: taskId },
    });
  }

  /**
   * Mark a task as completed
   */
  static async markTaskCompleted(taskId: string, userId: string, notes?: string): Promise<Task> {
    return await this.updateTask(taskId, userId, {
      status: 'COMPLETED',
      completedAt: new Date(),
      notes: notes || undefined,
    });
  }
}