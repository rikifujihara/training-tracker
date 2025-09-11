// Import Prisma-generated enums and types
import { Consultation, ConsultationStatus, ConsultationOutcome } from "@prisma/client";

// Re-export for convenience
export { ConsultationStatus, ConsultationOutcome };

export type CreateConsultationInput = {
  leadId: string;
  scheduledTime: Date;
  durationMinutes: number;
  notes?: string;
  messageTemplateId?: string;
  reminderTime?: Date;
};

export type UpdateConsultationInput = {
  scheduledTime?: Date;
  durationMinutes?: number;
  notes?: string;
  status?: ConsultationStatus;
  outcome?: ConsultationOutcome;
  messageTemplateId?: string;
  reminderTime?: Date | null;
};

export type RawConsultation = {
  id: string;
  userId: string;
  leadId: string;
  createdAt: Date;
  updatedAt: Date;
  scheduledTime: Date;
  durationMinutes: number;
  notes: string | null;
  status: ConsultationStatus;
  outcome: ConsultationOutcome | null;
  messageTemplateId: string | null;
  reminderTime: Date | null;
};

// Enhanced consultation with lead and message template information
export type ConsultationWithRelations = Consultation & {
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

export type { Consultation };