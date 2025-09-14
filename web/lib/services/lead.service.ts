import { prisma } from "@/lib/prisma";
import { CreateLeadInput, UpdateLeadInput, Lead, LeadStatus } from "@/lib/types/lead";
import { TaskType, TaskStatus } from "@/lib/types/task";
import { Lead as PrismaLead, Task as PrismaTask } from "@prisma/client";

// Type for the raw lead data that comes from Prisma queries
type RawLeadData = PrismaLead | (PrismaLead & { tasks?: PrismaTask[] });

export class LeadService {
  /**
   * Create multiple leads for a user
   */
  static async createLeads(
    userId: string,
    leads: CreateLeadInput[]
  ): Promise<Lead[]> {
    // Clean and prepare lead data
    const cleanLeads = leads.map((lead) => ({
      userId,
      firstName: lead.firstName?.trim() || null,
      lastName: lead.lastName?.trim() || null,
      age: lead.age?.trim() || null,
      birthday: lead.birthday?.trim() || null,
      joinDate: lead.joinDate || null,
      yearOfBirth: lead.yearOfBirth || null,
      dateOfBirth: lead.dateOfBirth || null,
      gender: lead.gender?.trim() || null,
      phoneNumber: lead.phoneNumber?.trim() || null,
      email: lead.email?.trim() || null,
      goals: lead.goals?.trim() || null,
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

    return createdLeads.map((lead) => this.enrichLeadWithDisplayFields(lead));
  }

  /**
   * Get all leads for a user with computed display fields
   */
  static async getLeadsByUserId(userId: string): Promise<Lead[]> {
    const rawLeads = await prisma.lead.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return rawLeads.map((lead) => this.enrichLeadWithDisplayFields(lead));
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

    // Build base where clause with userId and optional status
    const baseWhere = {
      userId,
      ...(status && { status }),
    };

    // Build date filters based on the filter type (using UTC to avoid timezone issues)
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    if (filter === 'all') {
      // Simple case: all leads ordered by creation date
      const [rawLeads, totalCount] = await Promise.all([
        prisma.lead.findMany({
          where: baseWhere,
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize + 1, // Take one extra to check for next page
        }),
        prisma.lead.count({ where: baseWhere }),
      ]);

      const hasNextPage = rawLeads.length > pageSize;
      const leadsToReturn = hasNextPage ? rawLeads.slice(0, pageSize) : rawLeads;

      return {
        leads: leadsToReturn.map((lead) => this.enrichLeadWithDisplayFields(lead)),
        hasNextPage,
        totalCount,
      };
    }

    // For filtered cases, we need leads with their tasks
    // We'll fetch more than needed and sort/paginate in memory
    // This is a trade-off: simpler code vs. potentially more data transfer

    let taskDateFilter;
    switch (filter) {
      case 'today':
        taskDateFilter = { gte: today, lt: tomorrow };
        break;
      case 'overdue':
        taskDateFilter = { lt: today };
        break;
      case 'upcoming':
        taskDateFilter = { gte: tomorrow };
        break;
    }

    // First, get leads that have matching tasks
    const leadsWithTasks = await prisma.lead.findMany({
      where: {
        ...baseWhere,
        tasks: {
          some: {
            status: TaskStatus.PENDING,
            dueDate: taskDateFilter,
          },
        },
      },
      include: {
        tasks: {
          where: {
            status: TaskStatus.PENDING,
          },
          orderBy: {
            dueDate: 'asc',
          },
        },
      },
    });

    // Process and sort by next task due date
    const leadsWithNextTask = leadsWithTasks
      .map((lead) => ({
        lead,
        nextTaskDueDate: lead.tasks[0]?.dueDate || null,
      }))
      .filter((item) => {
        // Double-check the filter (should be redundant but ensures correctness)
        if (!item.nextTaskDueDate) return false;
        
        const taskDate = new Date(item.nextTaskDueDate);
        // Convert to UTC for consistent comparison
        const taskDateUTC = new Date(Date.UTC(taskDate.getUTCFullYear(), taskDate.getUTCMonth(), taskDate.getUTCDate(), 0, 0, 0, 0));
        switch (filter) {
          case 'today':
            return taskDateUTC >= today && taskDateUTC < tomorrow;
          case 'overdue':
            return taskDateUTC < today;
          case 'upcoming':
            return taskDateUTC >= tomorrow;
          default:
            return true;
        }
      })
      .sort((a, b) => {
        if (!a.nextTaskDueDate || !b.nextTaskDueDate) return 0;
        return new Date(a.nextTaskDueDate).getTime() - new Date(b.nextTaskDueDate).getTime();
      });

    // Apply pagination
    const totalCount = leadsWithNextTask.length;
    const paginatedResults = leadsWithNextTask.slice(skip, skip + pageSize);
    const hasNextPage = skip + pageSize < totalCount;

    return {
      leads: paginatedResults.map(({ lead }) => this.enrichLeadWithDisplayFields(lead)),
      hasNextPage,
      totalCount,
    };
  }

  /**
   * Get filter counts for all prospect filters
   */
  static async getProspectFilterCounts(
    userId: string,
    status?: LeadStatus
  ): Promise<{
    today: number;
    overdue: number;
    upcoming: number;
    all: number;
  }> {
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    // Build base where clause with userId and optional status
    const baseWhere = {
      userId,
      ...(status && { status }),
    };

    const [todayCount, overdueCount, upcomingCount, allCount] = await Promise.all([
      // Today count
      prisma.lead.count({
        where: {
          ...baseWhere,
          tasks: {
            some: {
              status: TaskStatus.PENDING,
              dueDate: {
                gte: today,
                lt: tomorrow,
              },
            },
          },
        },
      }),
      // Overdue count
      prisma.lead.count({
        where: {
          ...baseWhere,
          tasks: {
            some: {
              status: TaskStatus.PENDING,
              dueDate: {
                lt: today,
              },
            },
          },
        },
      }),
      // Upcoming count
      prisma.lead.count({
        where: {
          ...baseWhere,
          tasks: {
            some: {
              status: TaskStatus.PENDING,
              dueDate: {
                gte: tomorrow,
              },
            },
          },
        },
      }),
      // All count
      prisma.lead.count({
        where: baseWhere,
      }),
    ]);

    return {
      today: todayCount,
      overdue: overdueCount,
      upcoming: upcomingCount,
      all: allCount,
    };
  }

  /**
   * Get lead by ID (with user ownership check)
   */
  static async getLeadById(
    leadId: string,
    userId: string
  ): Promise<Lead | null> {
    const rawLead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        userId,
      },
    });

    return rawLead ? this.enrichLeadWithDisplayFields(rawLead) : null;
  }

  /**
   * Update a lead
   */
  static async updateLead(
    leadId: string,
    userId: string,
    data: UpdateLeadInput
  ): Promise<Lead> {
    // First check if lead belongs to user
    const existingLead = await this.getLeadById(leadId, userId);
    if (!existingLead) {
      throw new Error("Lead not found or access denied");
    }

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        age: data.age?.trim(),
        birthday: data.birthday?.trim(),
        joinDate: data.joinDate,
        yearOfBirth: data.yearOfBirth,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender?.trim(),
        phoneNumber: data.phoneNumber?.trim(),
        email: data.email?.trim(),
        goals: data.goals?.trim(),
        generalNotes: data.generalNotes?.trim(),
        status: data.status,
      },
    });

    return this.enrichLeadWithDisplayFields(updatedLead);
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
          AND: [{ email: { not: null } }, { email: { not: "" } }],
        },
      }),
      prisma.lead.count({
        where: {
          userId,
          AND: [{ phoneNumber: { not: null } }, { phoneNumber: { not: "" } }],
        },
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

  /**
   * Enrich a raw lead with computed display fields
   */
  private static enrichLeadWithDisplayFields(rawLead: RawLeadData): Lead {
    return {
      ...rawLead,
      displayName: this.parseDisplayName(rawLead.firstName, rawLead.lastName),
      status: rawLead.status || LeadStatus.PROSPECT, // Default to PROSPECT if status is missing
      statusAgeDays: this.calculateStatusAgeDays(rawLead.createdAt),
    };
  }

  /**
   * Parse display name from first and last name
   */
  private static parseDisplayName(
    firstName: string | null,
    lastName: string | null
  ): string {
    return `${firstName ?? ""}${firstName && lastName ? " " : ""}${
      lastName ?? ""
    }`.trim();
  }


  /**
   * Calculate status age in days
   */
  private static calculateStatusAgeDays(createdAt: Date): number {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(createdAt).getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }
}
