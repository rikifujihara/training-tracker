import { NextResponse } from "next/server";
import { LeadService } from "@/lib/services/lead";
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
    const status = searchParams.get('status') as LeadStatus | null;

    // Parse date range parameters (ISO strings from client)
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    let dateRange: { startDate?: Date; endDate?: Date } | undefined;
    if (startDateParam || endDateParam) {
      dateRange = {};
      if (startDateParam) {
        dateRange.startDate = new Date(startDateParam);
      }
      if (endDateParam) {
        dateRange.endDate = new Date(endDateParam);
      }
    }

    // Get leads for the user with pagination and date range filtering
    const result = await LeadService.getLeadsByUserIdPaginated(user.id, {
      page,
      pageSize,
      dateRange,
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