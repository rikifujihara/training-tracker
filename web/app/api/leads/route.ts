import { NextResponse } from "next/server";
import { LeadService } from "@/lib/services/lead.service";
import { LeadStatus } from "@/lib/types/lead";
import { requireAuth } from "@/lib/utils/auth";
import { handleApiError } from "@/lib/utils/error-handling";

export async function GET(request: Request) {
  try {
    // Check authentication
    const user = await requireAuth();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const filter = searchParams.get('filter') as 'today' | 'overdue' | 'upcoming' | 'all' | null;
    const status = searchParams.get('status') as LeadStatus | null;

    // Get leads for the user with pagination and filtering
    const result = await LeadService.getLeadsByUserIdPaginated(user.id, {
      page,
      pageSize,
      filter: filter || 'all',
      ...(status && { status }),
    });

    // Get stats only on first page load
    const stats = page === 0 ? await LeadService.getLeadStats(user.id) : undefined;

    return NextResponse.json({
      success: true,
      data: {
        leads: result.leads,
        hasNextPage: result.hasNextPage,
        totalCount: result.totalCount,
        stats,
      },
    });

  } catch (error) {
    return handleApiError(error, "Get leads error");
  }
}