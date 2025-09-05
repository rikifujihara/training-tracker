import { prisma } from "@/lib/prisma";
import { CreateLeadInput, Lead } from "@/lib/types/lead";

export class LeadService {
  /**
   * Create multiple leads for a user
   */
  static async createLeads(userId: string, leads: CreateLeadInput[]): Promise<Lead[]> {
    // Clean and prepare lead data
    const cleanLeads = leads.map(lead => ({
      userId,
      firstName: lead.firstName?.trim() || null,
      lastName: lead.lastName?.trim() || null,
      age: lead.age?.trim() || null,
      birthday: lead.birthday?.trim() || null,
      gender: lead.gender?.trim() || null,
      phoneNumber: lead.phoneNumber?.trim() || null,
      email: lead.email?.trim() || null,
      goals: lead.goals?.trim() || null,
      source: "email_upload",
    }));

    // Filter out completely empty leads
    const validLeads = cleanLeads.filter(lead => 
      lead.firstName || lead.lastName || lead.email || lead.phoneNumber
    );

    if (validLeads.length === 0) {
      throw new Error("No valid leads found to import");
    }

    // Create leads in database
    const createdLeads = await prisma.$transaction(async (tx) => {
      const results = [];
      for (const leadData of validLeads) {
        const created = await tx.lead.create({
          data: leadData,
        });
        results.push(created);
      }
      return results;
    });

    return createdLeads;
  }

  /**
   * Get all leads for a user
   */
  static async getLeadsByUserId(userId: string): Promise<Lead[]> {
    return prisma.lead.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get lead by ID (with user ownership check)
   */
  static async getLeadById(leadId: string, userId: string): Promise<Lead | null> {
    return prisma.lead.findFirst({
      where: {
        id: leadId,
        userId,
      },
    });
  }

  /**
   * Update a lead
   */
  static async updateLead(
    leadId: string,
    userId: string,
    data: Partial<CreateLeadInput>
  ): Promise<Lead> {
    // First check if lead belongs to user
    const existingLead = await this.getLeadById(leadId, userId);
    if (!existingLead) {
      throw new Error("Lead not found or access denied");
    }

    return prisma.lead.update({
      where: { id: leadId },
      data: {
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        age: data.age?.trim(),
        birthday: data.birthday?.trim(),
        gender: data.gender?.trim(),
        phoneNumber: data.phoneNumber?.trim(),
        email: data.email?.trim(),
        goals: data.goals?.trim(),
      },
    });
  }

  /**
   * Delete a lead
   */
  static async deleteLead(leadId: string, userId: string): Promise<void> {
    // First check if lead belongs to user
    const existingLead = await this.getLeadById(leadId, userId);
    if (!existingLead) {
      throw new Error("Lead not found or access denied");
    }

    await prisma.lead.delete({
      where: { id: leadId },
    });
  }

  /**
   * Get lead statistics for a user
   */
  static async getLeadStats(userId: string) {
    const [total, withEmail, withPhone, recentImports] = await Promise.all([
      prisma.lead.count({ where: { userId } }),
      prisma.lead.count({ 
        where: { 
          userId, 
          AND: [
            { email: { not: null } },
            { email: { not: "" } }
          ]
        } 
      }),
      prisma.lead.count({ 
        where: { 
          userId, 
          AND: [
            { phoneNumber: { not: null } },
            { phoneNumber: { not: "" } }
          ]
        } 
      }),
      prisma.lead.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    return {
      total,
      withEmail,
      withPhone,
      recentImports,
    };
  }
}