// Import Prisma-generated enums and types
import { Task, TaskType, TaskStatus } from "@prisma/client";

// Re-export for convenience
export { TaskType, TaskStatus };

export type CreateTaskInput = {
  leadId: string;
  title: string;
  description?: string;
  dueDate: Date;
  taskType: TaskType;
  messageTemplateId?: string;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string;
  dueDate?: Date;
  taskType?: TaskType;
  status?: TaskStatus;
  messageTemplateId?: string;
  completedAt?: Date;
  notes?: string;
};

export type RawTask = {
  id: string;
  userId: string;
  leadId: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string | null;
  dueDate: Date;
  taskType: TaskType;
  status: TaskStatus;
  messageTemplateId: string | null;
  completedAt: Date | null;
  notes: string | null;
};

// Enhanced task with lead and message template information
export type TaskWithRelations = Task & {
  lead: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
  };
  messageTemplate?: {
    id: string;
    name: string;
    content: string;
  } | null;
};

export type { Task };