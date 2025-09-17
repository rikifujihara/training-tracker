// Import Prisma-generated enums
import { ContactType, ContactPointOutcome } from "@prisma/client";

// Re-export for convenience
export { ContactType, ContactPointOutcome };

export type CreateContactPointInput = {
  leadId: string;
  contactType: ContactType;
  contactDate: Date;
  outcome?: ContactPointOutcome;
  notes?: string;
  messageTemplateId?: string;
};

export type RawContactPoint = {
  id: string;
  leadId: string;
  userId: string;
  contactType: ContactType;
  outcome: ContactPointOutcome | null;
  notes: string | null;
  contactDate: Date;
  messageTemplateId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactPoint = RawContactPoint;

export type ContactPointWithTemplate = ContactPoint & {
  messageTemplate?: {
    id: string;
    name: string;
  } | null;
};