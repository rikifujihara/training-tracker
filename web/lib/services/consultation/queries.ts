import { prisma } from "@/lib/prisma";
import { Consultation, ConsultationWithRelations, ConsultationStatus } from "@/lib/types/consultation";

export class ConsultationQueries {
  /**
   * Get all consultations for a user
   */
  static async getConsultationsByUserId(userId: string): Promise<Consultation[]> {
    return prisma.consultation.findMany({
      where: { userId },
      orderBy: [
        { status: 'asc' }, // Scheduled first
        { scheduledTime: 'asc' }, // Earliest scheduled time first
      ],
    });
  }

  /**
   * Get all consultations for a specific lead
   */
  static async getConsultationsByLeadId(leadId: string, userId: string): Promise<Consultation[]> {
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

    return prisma.consultation.findMany({
      where: { leadId },
      orderBy: [
        { status: 'asc' }, // Scheduled first
        { scheduledTime: 'asc' }, // Earliest scheduled time first
      ],
    });
  }

  /**
   * Get consultations with lead and template information
   */
  static async getConsultationsWithRelations(userId: string): Promise<ConsultationWithRelations[]> {
    return prisma.consultation.findMany({
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
        messageTemplate: {
          select: {
            id: true,
            name: true,
            content: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' }, // Scheduled first
        { scheduledTime: 'asc' }, // Earliest scheduled time first
      ],
    });
  }

  /**
   * Get consultation by ID (with user ownership check)
   */
  static async getConsultationById(consultationId: string, userId: string): Promise<Consultation | null> {
    return prisma.consultation.findFirst({
      where: {
        id: consultationId,
        userId,
      },
    });
  }

  /**
   * Get consultation by ID with relations
   */
  static async getConsultationByIdWithRelations(consultationId: string, userId: string): Promise<ConsultationWithRelations | null> {
    return prisma.consultation.findFirst({
      where: {
        id: consultationId,
        userId,
      },
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
        messageTemplate: {
          select: {
            id: true,
            name: true,
            content: true,
          },
        },
      },
    });
  }

  /**
   * Get upcoming consultations for a user
   */
  static async getUpcomingConsultations(userId: string, days: number = 7): Promise<ConsultationWithRelations[]> {
    const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    return prisma.consultation.findMany({
      where: {
        userId,
        status: ConsultationStatus.SCHEDULED,
        scheduledTime: {
          gte: new Date(),
          lte: endDate,
        },
      },
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
        messageTemplate: {
          select: {
            id: true,
            name: true,
            content: true,
          },
        },
      },
      orderBy: { scheduledTime: 'asc' },
    });
  }

  /**
   * Get consultation statistics for a user
   */
  static async getConsultationStats(userId: string) {
    const [total, scheduled, completed, converted, notConverted, scheduledToday, scheduledThisWeek] = await Promise.all([
      // Total consultations
      prisma.consultation.count({ where: { userId } }),

      // Scheduled consultations
      prisma.consultation.count({ where: { userId, status: ConsultationStatus.SCHEDULED } }),

      // Completed consultations
      prisma.consultation.count({ where: { userId, status: ConsultationStatus.COMPLETED } }),

      // Converted consultations
      prisma.consultation.count({ where: { userId, outcome: 'CONVERTED' } }),

      // Not converted consultations
      prisma.consultation.count({ where: { userId, outcome: 'NOT_CONVERTED' } }),

      // Scheduled today
      prisma.consultation.count({
        where: {
          userId,
          status: ConsultationStatus.SCHEDULED,
          scheduledTime: {
            gte: (() => {
              const now = new Date();
              return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
            })(),
            lt: (() => {
              const now = new Date();
              return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
            })(),
          },
        },
      }),

      // Scheduled this week
      prisma.consultation.count({
        where: {
          userId,
          status: ConsultationStatus.SCHEDULED,
          scheduledTime: {
            gte: new Date(),
            lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      total,
      scheduled,
      completed,
      converted,
      notConverted,
      scheduledToday,
      scheduledThisWeek,
      conversionRate: completed > 0 ? (converted / completed * 100) : 0,
    };
  }
}