import { prisma } from "@/lib/prisma";
import { Consultation, CreateConsultationInput, UpdateConsultationInput, ConsultationStatus, ConsultationOutcome } from "@/lib/types/consultation";
import { ConsultationQueries } from "./queries";

export class ConsultationMutations {
  /**
   * Create a consultation for a lead
   */
  static async createConsultation(
    userId: string,
    data: CreateConsultationInput
  ): Promise<Consultation> {
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

    const consultation = await prisma.consultation.create({
      data: {
        userId,
        leadId: data.leadId,
        scheduledTime: data.scheduledTime,
        durationMinutes: data.durationMinutes,
        notes: data.notes?.trim() || null,
        messageTemplateId: data.messageTemplateId || null,
        reminderTime: data.reminderTime || null,
        updatedAt: new Date(),
      },
    });

    return consultation;
  }

  /**
   * Update a consultation
   */
  static async updateConsultation(
    consultationId: string,
    userId: string,
    data: UpdateConsultationInput
  ): Promise<Consultation> {
    // First check if consultation belongs to user
    const existingConsultation = await ConsultationQueries.getConsultationById(consultationId, userId);
    if (!existingConsultation) {
      throw new Error("Consultation not found or access denied");
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
      scheduledTime?: Date;
      durationMinutes?: number;
      notes?: string | null;
      status?: ConsultationStatus;
      outcome?: ConsultationOutcome | null;
      messageTemplateId?: string | null;
      reminderTime?: Date | null;
    } = {};

    if (data.scheduledTime !== undefined) updateData.scheduledTime = data.scheduledTime;
    if (data.durationMinutes !== undefined) updateData.durationMinutes = data.durationMinutes;
    if (data.notes !== undefined) updateData.notes = data.notes?.trim() || null;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.outcome !== undefined) updateData.outcome = data.outcome;
    if (data.messageTemplateId !== undefined) updateData.messageTemplateId = data.messageTemplateId || null;
    if (data.reminderTime !== undefined) updateData.reminderTime = data.reminderTime;

    return prisma.consultation.update({
      where: { id: consultationId },
      data: updateData,
    });
  }

  /**
   * Delete a consultation
   */
  static async deleteConsultation(consultationId: string, userId: string): Promise<void> {
    // First check if consultation belongs to user
    const existingConsultation = await ConsultationQueries.getConsultationById(consultationId, userId);
    if (!existingConsultation) {
      throw new Error("Consultation not found or access denied");
    }

    await prisma.consultation.delete({
      where: { id: consultationId },
    });
  }

  /**
   * Mark consultation as completed
   */
  static async markConsultationCompleted(consultationId: string, userId: string, outcome: ConsultationOutcome, notes?: string): Promise<Consultation> {
    return this.updateConsultation(consultationId, userId, {
      status: ConsultationStatus.COMPLETED,
      outcome,
      notes,
    });
  }
}