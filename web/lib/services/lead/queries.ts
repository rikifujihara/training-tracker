import { prisma } from "@/lib/prisma";
import { Lead, LeadStatus } from "@/lib/types/lead";
import { LeadUtils } from "./utils";

/**
 * Lead query operations
 */
export class LeadQueries {
  /**
   * Get all leads for a user with computed display fields
   */
  static async getLeadsByUserId(userId: string): Promise<Lead[]> {
    const rawLeads = await prisma.lead.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return rawLeads.map((lead) => LeadUtils.enrichLeadWithDisplayFields(lead));
  }

  /**
   * Get leads for a user with pagination and filtering based on task due dates
   * Uses UTC date ranges provided by client for timezone-aware filtering
   */
  static async getLeadsByUserIdPaginated(
    userId: string,
    options: {
      page: number;
      pageSize: number;
      dateRange?: {
        startDate?: Date;
        endDate?: Date;
      };
      status?: LeadStatus;
    }
  ): Promise<{
    leads: Lead[];
    hasNextPage: boolean;
    totalCount: number;
  }> {
    const { page, pageSize, dateRange, status } = options;
    const skip = page * pageSize;

    // Base query conditions
    const whereConditions: Record<string, unknown> = { userId };

    // Add status filter if provided
    if (status) {
      whereConditions.status = status;
    }

    // Build task filtering conditions based on date range
    const taskWhereConditions: Record<string, unknown> = {
      status: 'PENDING'
    };

    if (dateRange?.startDate || dateRange?.endDate) {
      const dueDateCondition: Record<string, unknown> = {};
      if (dateRange.startDate) {
        dueDateCondition.gte = dateRange.startDate;
      }
      if (dateRange.endDate) {
        dueDateCondition.lte = dateRange.endDate;
      }
      taskWhereConditions.dueDate = dueDateCondition;
    }

    // Get all matching leads with their next pending task (filtered by date range if provided)
    const allLeads = await prisma.lead.findMany({
      where: whereConditions,
      include: {
        tasks: {
          where: taskWhereConditions,
          orderBy: {
            dueDate: 'asc'
          },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // When using date range filtering, only show leads that have tasks in the range
    // When no date range is provided, show all leads
    let filteredLeads = allLeads;

    if (dateRange?.startDate || dateRange?.endDate) {
      // Only include leads that have at least one task in the date range
      filteredLeads = allLeads.filter(lead => lead.tasks.length > 0);
    }

    // Apply pagination
    const totalCount = filteredLeads.length;
    const paginatedLeads = filteredLeads.slice(skip, skip + pageSize);
    const hasNextPage = skip + pageSize < totalCount;

    // Enrich leads with display fields
    const enrichedLeads = paginatedLeads.map((leadWithTasks) => {
      const { ...leadData } = leadWithTasks;
      return LeadUtils.enrichLeadWithDisplayFields(leadData);
    });

    return {
      leads: enrichedLeads,
      hasNextPage,
      totalCount,
    };
  }

  /**
   * Get filter counts for prospects using client-provided date ranges
   */
  static async getProspectFilterCounts(
    userId: string,
    dateRanges: {
      today: { startDate: Date; endDate: Date };
      overdue: { startDate?: Date; endDate: Date };
      upcoming: { startDate: Date; endDate?: Date };
    }
  ) {
    // Get total count of prospects
    const totalProspects = await prisma.lead.count({
      where: {
        userId,
        status: LeadStatus.PROSPECT,
      },
    });

    // Count prospects with tasks due today
    const todayCount = await prisma.lead.count({
      where: {
        userId,
        status: LeadStatus.PROSPECT,
        tasks: {
          some: {
            status: 'PENDING',
            dueDate: {
              gte: dateRanges.today.startDate,
              lte: dateRanges.today.endDate,
            },
          },
        },
      },
    });

    // Count prospects with overdue tasks
    const overdueCount = await prisma.lead.count({
      where: {
        userId,
        status: LeadStatus.PROSPECT,
        tasks: {
          some: {
            status: 'PENDING',
            dueDate: {
              lt: dateRanges.overdue.endDate,
            },
          },
        },
      },
    });

    // Count prospects with upcoming tasks
    const upcomingCount = await prisma.lead.count({
      where: {
        userId,
        status: LeadStatus.PROSPECT,
        tasks: {
          some: {
            status: 'PENDING',
            dueDate: {
              gte: dateRanges.upcoming.startDate,
            },
          },
        },
      },
    });

    return {
      all: totalProspects,
      today: todayCount,
      overdue: overdueCount,
      upcoming: upcomingCount,
    };
  }

  /**
   * Get a single lead by ID and user ID
   */
  static async getLeadById(
    leadId: string,
    userId: string
  ): Promise<Lead | null> {
    const rawLead = await prisma.lead.findFirst({
      where: { id: leadId, userId },
    });

    if (!rawLead) {
      return null;
    }

    return LeadUtils.enrichLeadWithDisplayFields(rawLead);
  }

  /**
   * Search leads by firstName, lastName, and mobile number
   */
  static async searchLeads(
    userId: string,
    searchQuery: string,
    options: {
      page: number;
      pageSize: number;
      status?: LeadStatus;
    }
  ): Promise<{
    leads: Lead[];
    hasNextPage: boolean;
    totalCount: number;
  }> {
    const { page, pageSize, status } = options;
    const skip = page * pageSize;

    // Build search conditions
    const searchConditions = {
      OR: [
        {
          firstName: {
            contains: searchQuery,
            mode: 'insensitive' as const,
          },
        },
        {
          lastName: {
            contains: searchQuery,
            mode: 'insensitive' as const,
          },
        },
        {
          phoneNumber: {
            contains: searchQuery,
            mode: 'insensitive' as const,
          },
        },
      ],
    };

    // Base query conditions
    const whereConditions: Record<string, unknown> = {
      userId,
      AND: [searchConditions],
    };

    // Add status filter if provided
    if (status) {
      whereConditions.status = status;
    }

    // Get total count
    const totalCount = await prisma.lead.count({
      where: whereConditions,
    });

    // Get paginated results
    const rawLeads = await prisma.lead.findMany({
      where: whereConditions,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    });

    const hasNextPage = skip + pageSize < totalCount;

    // Enrich leads with display fields
    const enrichedLeads = rawLeads.map((lead) =>
      LeadUtils.enrichLeadWithDisplayFields(lead)
    );

    return {
      leads: enrichedLeads,
      hasNextPage,
      totalCount,
    };
  }

  /**
   * Get lead statistics for a user
   */
  static async getLeadStats(userId: string) {
    // Get counts by status
    const statusCounts = await prisma.lead.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        id: true,
      },
    });

    // Transform to object
    const stats: Record<string, number> = {
      total: 0,
      [LeadStatus.PROSPECT]: 0,
      [LeadStatus.CONVERTED]: 0,
      [LeadStatus.NOT_INTERESTED]: 0,
    };

    statusCounts.forEach(({ status, _count }) => {
      stats[status] = _count.id;
      stats.total += _count.id;
    });

    return stats;
  }
}