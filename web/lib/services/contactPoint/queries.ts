import { prisma } from "@/lib/prisma";
import { ContactPoint, ContactPointWithTemplate, ContactPointOutcome, ContactType } from "@/lib/types/contactPoint";

export class ContactPointQueries {
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
  static async getContactPointsByLeadId(leadId: string, userId: string): Promise<ContactPointWithTemplate[]> {
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
      include: {
        messageTemplate: {
          select: {
            id: true,
            name: true,
          },
        },
      },
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