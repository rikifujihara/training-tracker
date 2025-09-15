import { prisma } from "@/lib/prisma";
import { CreateLeadInput, UpdateLeadInput, Lead } from "@/lib/types/lead";
import { TaskType, TaskStatus } from "@/lib/types/task";
import { LeadUtils } from "./utils";

/**
 * Lead mutation operations
 */
export class LeadMutations {
  /**
   * Create multiple leads for a user
   */
  static async createLeads(
    userId: string,
    leads: CreateLeadInput[]
  ): Promise<Lead[]> {
    // Clean and validate lead data
    const validLeads = LeadUtils.cleanLeadData(leads, userId);

    // TODO: this service probably shouldn't contain the task creation logic directly, will refactor in the future
    // Create leads and their initial call tasks in database
    const createdLeads = await prisma.$transaction(async (tx) => {
      const results = [];
      for (const leadData of validLeads) {
        // Create the lead
        const createdLead = await tx.lead.create({
          data: leadData,
        });

        // Create an "Initial call" task for this lead
        await tx.task.create({
          data: {
            userId: userId,
            leadId: createdLead.id,
            title: "Initial call",
            description: null,
            dueDate: createdLead.createdAt, // Due date same as creation date
            taskType: TaskType.CALL,
            status: TaskStatus.PENDING,
            updatedAt: new Date(),
          },
        });

        results.push(createdLead);
      }
      return results;
    });

    return createdLeads.map((lead) => LeadUtils.enrichLeadWithDisplayFields(lead));
  }

  /**
   * Update a lead
   */
  static async updateLead(
    leadId: string,
    userId: string,
    data: UpdateLeadInput
  ): Promise<Lead> {
    // Verify the lead exists and belongs to the user
    const existingLead = await prisma.lead.findFirst({
      where: { id: leadId, userId },
    });

    if (!existingLead) {
      throw new Error("Lead not found or you don't have permission to update it");
    }

    // Clean and prepare update data
    const cleanData: Record<string, unknown> = {};

    if (data.firstName !== undefined) {
      cleanData.firstName = data.firstName?.trim() || null;
    }
    if (data.lastName !== undefined) {
      cleanData.lastName = data.lastName?.trim() || null;
    }
    if (data.age !== undefined) {
      cleanData.age = data.age?.trim() || null;
    }
    if (data.birthday !== undefined) {
      cleanData.birthday = data.birthday?.trim() || null;
    }
    if (data.gender !== undefined) {
      cleanData.gender = data.gender?.trim() || null;
    }
    if (data.phoneNumber !== undefined) {
      cleanData.phoneNumber = data.phoneNumber?.trim() || null;
    }
    if (data.email !== undefined) {
      cleanData.email = data.email?.trim() || null;
    }
    if (data.leadType !== undefined) {
      cleanData.leadType = data.leadType?.trim() || null;
    }
    if (data.goals !== undefined) {
      cleanData.goals = data.goals?.trim() || null;
    }
    if (data.status !== undefined) {
      cleanData.status = data.status;
    }
    if (data.generalNotes !== undefined) {
      cleanData.generalNotes = data.generalNotes?.trim() || null;
    }

    // Always update the updatedAt timestamp
    cleanData.updatedAt = new Date();

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: cleanData,
    });

    return LeadUtils.enrichLeadWithDisplayFields(updatedLead);
  }

  /**
   * Delete a lead (and all associated tasks/contact points)
   */
  static async deleteLead(leadId: string, userId: string): Promise<void> {
    // Verify the lead exists and belongs to the user
    const existingLead = await prisma.lead.findFirst({
      where: { id: leadId, userId },
    });

    if (!existingLead) {
      throw new Error("Lead not found or you don't have permission to delete it");
    }

    // Delete lead and cascade to related records
    await prisma.lead.delete({
      where: { id: leadId },
    });
  }
}