import { LeadStatus } from '@prisma/client';

export type CreateLeadInput = {
  firstName?: string;
  lastName?: string;
  age?: string;
  birthday?: string;
  gender?: string;
  phoneNumber?: string;
  email?: string;
  goals?: string;
  generalNotes?: string;
};

export type UpdateLeadInput = {
  firstName?: string;
  lastName?: string;
  age?: string;
  birthday?: string;
  gender?: string;
  phoneNumber?: string;
  email?: string;
  goals?: string;
  generalNotes?: string;
  status?: LeadStatus;
};

export { LeadStatus };


export type Lead = {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  age: string | null;
  birthday: string | null;
  gender: string | null;
  phoneNumber: string | null;
  email: string | null;
  goals: string | null;
  generalNotes: string | null;
  source: string;
  importedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  // Computed display fields
  displayName: string;
  status: LeadStatus;
  statusAgeDays: number;
};
