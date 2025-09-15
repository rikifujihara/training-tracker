import { Lead } from "@/lib/types/lead";
import { Lead as PrismaLead, Task as PrismaTask } from "@prisma/client";

// Type for the raw lead data that comes from Prisma queries
type RawLeadData = PrismaLead | (PrismaLead & { tasks?: PrismaTask[] });

/**
 * Lead utility functions for data processing and enrichment
 */
export class LeadUtils {
  /**
   * Enriches raw lead data with computed display fields
   */
  static enrichLeadWithDisplayFields(rawLead: RawLeadData): Lead {
    const lead = rawLead as Lead;
    lead.displayName = this.parseDisplayName(rawLead);
    lead.statusAgeDays = this.calculateStatusAgeDays(rawLead.createdAt);
    return lead;
  }

  /**
   * Parses and formats the display name for a lead
   */
  private static parseDisplayName(
    lead: Pick<PrismaLead, "firstName" | "lastName" | "email" | "phoneNumber">
  ): string {
    const { firstName, lastName, email, phoneNumber } = lead;

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    } else if (email) {
      return email;
    } else if (phoneNumber) {
      return phoneNumber;
    } else {
      return "Unknown Contact";
    }
  }

  /**
   * Calculates the age of a lead status in days
   */
  private static calculateStatusAgeDays(createdAt: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Cleans and validates lead data for creation
   */
  static cleanLeadData(leads: Record<string, unknown>[], userId: string) {
    const cleanLeads = leads.map((lead) => ({
      userId,
      firstName: typeof lead.firstName === 'string' ? lead.firstName.trim() || null : null,
      lastName: typeof lead.lastName === 'string' ? lead.lastName.trim() || null : null,
      age: typeof lead.age === 'string' ? lead.age.trim() || null : null,
      birthday: typeof lead.birthday === 'string' ? lead.birthday.trim() || null : null,
      joinDate: typeof lead.joinDate === 'string' && lead.joinDate.trim() ? new Date(lead.joinDate.trim()) : null,
      yearOfBirth: typeof lead.yearOfBirth === 'string' && lead.yearOfBirth.trim() ? parseInt(lead.yearOfBirth.trim()) : null,
      dateOfBirth: typeof lead.dateOfBirth === 'string' && lead.dateOfBirth.trim() ? new Date(lead.dateOfBirth.trim()) : null,
      gender: typeof lead.gender === 'string' ? lead.gender.trim() || null : null,
      phoneNumber: typeof lead.phoneNumber === 'string' ? lead.phoneNumber.trim() || null : null,
      email: typeof lead.email === 'string' ? lead.email.trim() || null : null,
      leadType: typeof lead.leadType === 'string' ? lead.leadType.trim() || null : null,
      goals: typeof lead.goals === 'string' ? lead.goals.trim() || null : null,
      source: "email_upload",
    }));

    // Filter out completely empty leads
    const validLeads = cleanLeads.filter(
      (lead) =>
        lead.firstName || lead.lastName || lead.email || lead.phoneNumber
    );

    if (validLeads.length === 0) {
      throw new Error("No valid leads found to import");
    }

    return validLeads;
  }
}