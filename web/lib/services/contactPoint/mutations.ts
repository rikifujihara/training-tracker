import { prisma } from "@/lib/prisma";
import { ContactPoint, CreateContactPointInput } from "@/lib/types/contactPoint";
import { ContactPointQueries } from "./queries";

export class ContactPointMutations {
  /**
   * Create a contact point for a lead
   */
  static async createContactPoint(
    userId: string,
    data: CreateContactPointInput
  ): Promise<ContactPoint> {
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

    const contactPoint = await prisma.contactPoint.create({
      data: {
        userId,
        leadId: data.leadId,
        contactType: data.contactType,
        contactDate: data.contactDate,
        outcome: data.outcome || null,
        notes: data.notes?.trim() || null,
      },
    });

    return contactPoint;
  }

  /**
   * Update a contact point
   */
  static async updateContactPoint(
    contactPointId: string,
    userId: string,
    data: Partial<CreateContactPointInput>
  ): Promise<ContactPoint> {
    // First check if contact point belongs to user
    const existingContactPoint = await ContactPointQueries.getContactPointById(contactPointId, userId);
    if (!existingContactPoint) {
      throw new Error("Contact point not found or access denied");
    }

    // If leadId is being updated, verify the new lead belongs to the user
    if (data.leadId && data.leadId !== existingContactPoint.leadId) {
      const lead = await prisma.lead.findFirst({
        where: {
          id: data.leadId,
          userId,
        },
      });

      if (!lead) {
        throw new Error("Target lead not found or access denied");
      }
    }

    return prisma.contactPoint.update({
      where: { id: contactPointId },
      data: {
        ...(data.leadId && { leadId: data.leadId }),
        ...(data.contactType && { contactType: data.contactType }),
        ...(data.contactDate && { contactDate: data.contactDate }),
        ...(data.outcome !== undefined && { outcome: data.outcome }),
        ...(data.notes !== undefined && { notes: data.notes?.trim() || null }),
      },
    });
  }

  /**
   * Delete a contact point
   */
  static async deleteContactPoint(contactPointId: string, userId: string): Promise<void> {
    // First check if contact point belongs to user
    const existingContactPoint = await ContactPointQueries.getContactPointById(contactPointId, userId);
    if (!existingContactPoint) {
      throw new Error("Contact point not found or access denied");
    }

    await prisma.contactPoint.delete({
      where: { id: contactPointId },
    });
  }
}