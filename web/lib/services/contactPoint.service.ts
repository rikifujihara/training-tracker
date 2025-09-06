import { prisma } from "@/lib/prisma";
import { ContactPoint, CreateContactPointInput, ContactType, ContactPointOutcome } from "@/lib/types/contactPoint";

export class ContactPointService {
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
   * Get all contact points for a user
   */
  static async getContactPointsByUserId(userId: string): Promise<ContactPoint[]> {
    return prisma.contactPoint.findMany({
      where: { userId },
      orderBy: { contactDate: 'desc' },
    });
  }

  /**
   * Get all contact points for a specific lead
   */
  static async getContactPointsByLeadId(leadId: string, userId: string): Promise<ContactPoint[]> {
    // Verify the lead belongs to the user
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        userId,
      },
    });

    if (!lead) {
      throw new Error("Lead not found or access denied");
    }

    return prisma.contactPoint.findMany({
      where: { leadId },
      orderBy: { contactDate: 'desc' },
    });
  }

  /**
   * Get contact point by ID (with user ownership check)
   */
  static async getContactPointById(contactPointId: string, userId: string): Promise<ContactPoint | null> {
    return prisma.contactPoint.findFirst({
      where: {
        id: contactPointId,
        userId,
      },
    });
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
    const existingContactPoint = await this.getContactPointById(contactPointId, userId);
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
    const existingContactPoint = await this.getContactPointById(contactPointId, userId);
    if (!existingContactPoint) {
      throw new Error("Contact point not found or access denied");
    }

    await prisma.contactPoint.delete({
      where: { id: contactPointId },
    });
  }

  /**
   * Get contact point statistics for a user
   */
  static async getContactPointStats(userId: string) {
    const [total, byOutcome, byType, last7Days] = await Promise.all([
      // Total contact points
      prisma.contactPoint.count({ where: { userId } }),
      
      // Group by outcome
      prisma.contactPoint.groupBy({
        by: ['outcome'],
        where: { userId },
        _count: { outcome: true },
      }),
      
      // Group by contact type
      prisma.contactPoint.groupBy({
        by: ['contactType'],
        where: { userId },
        _count: { contactType: true },
      }),
      
      // Contact points in last 7 days
      prisma.contactPoint.count({
        where: {
          userId,
          contactDate: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      total,
      byOutcome: byOutcome.reduce((acc, item) => {
        if (item.outcome) {
          acc[item.outcome] = item._count.outcome;
        }
        return acc;
      }, {} as Record<ContactPointOutcome, number>),
      byType: byType.reduce((acc, item) => {
        acc[item.contactType] = item._count.contactType;
        return acc;
      }, {} as Record<ContactType, number>),
      last7Days,
    };
  }

  /**
   * Get recent contact points with lead information
   */
  static async getRecentContactPointsWithLeads(userId: string, limit: number = 10) {
    return prisma.contactPoint.findMany({
      where: { userId },
      include: {
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: { contactDate: 'desc' },
      take: limit,
    });
  }
}