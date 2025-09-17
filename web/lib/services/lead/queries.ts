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
   * Uses pure Prisma queries with post-processing for optimal maintainability
   */
  static async getLeadsByUserIdPaginated(
    userId: string,
    options: {
      page: number;
      pageSize: number;
      filter: 'today' | 'overdue' | 'upcoming' | 'all';
      status?: LeadStatus;
    }
  ): Promise<{
    leads: Lead[];
    hasNextPage: boolean;
    totalCount: number;
  }> {
    const { page, pageSize, filter, status } = options;
    const skip = page * pageSize;

    // Base query conditions
    const whereConditions: Record<string, unknown> = { userId };

    // Add status filter if provided
    if (status) {
      whereConditions.status = status;
    }

    // Get all matching leads first with their next pending task
    const allLeads = await prisma.lead.findMany({
      where: whereConditions,
      include: {
        tasks: {
          where: {
            status: 'PENDING'
          },
          orderBy: {
            dueDate: 'asc'
          },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Apply task-based filtering in memory for simplicity
    let filteredLeads = allLeads;

    if (filter !== 'all') {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

      filteredLeads = allLeads.filter(lead => {
        const nextTask = lead.tasks[0];
        if (!nextTask) return filter === 'upcoming'; // Leads without tasks only show in upcoming

        const taskDueDate = new Date(nextTask.dueDate);

        switch (filter) {
          case 'today':
            return taskDueDate >= todayStart && taskDueDate < todayEnd;
          case 'overdue':
            return taskDueDate < todayStart;
          case 'upcoming':
            return taskDueDate >= todayEnd;
          default:
            return true;
        }
      });
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
   * Get filter counts for prospects (leads with status PROSPECT)
   */
  static async getProspectFilterCounts(userId: string) {
    // Get all prospects with their next pending task
    const prospects = await prisma.lead.findMany({
      where: {
        userId,
        status: LeadStatus.PROSPECT,
      },
      include: {
        tasks: {
          where: {
            status: 'PENDING'
          },
          orderBy: {
            dueDate: 'asc'
          },
          take: 1,
        },
      },
    });

    // Calculate date boundaries
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // Count prospects by filter category
    let todayCount = 0;
    let overdueCount = 0;
    let upcomingCount = 0;

    prospects.forEach(prospect => {
      const nextTask = prospect.tasks[0];
      if (!nextTask) {
        upcomingCount++; // Prospects without tasks count as upcoming
        return;
      }

      const taskDueDate = new Date(nextTask.dueDate);

      if (taskDueDate >= todayStart && taskDueDate < todayEnd) {
        todayCount++;
      } else if (taskDueDate < todayStart) {
        overdueCount++;
      } else {
        upcomingCount++;
      }
    });

    return {
      all: prospects.length,
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