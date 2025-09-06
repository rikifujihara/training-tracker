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
};

export type RawContactPoint = {
  id: string;
  leadId: string;
  userId: string;
  contactType: ContactType;
  outcome: ContactPointOutcome | null;
  notes: string | null;
  contactDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactPoint = RawContactPoint;