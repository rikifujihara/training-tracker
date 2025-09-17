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
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '0');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const status = searchParams.get('status') as LeadStatus | null;

    // Validate search query
    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: "Search query is required",
      }, { status: 400 });
    }

    // Search leads for the user with pagination
    const result = await LeadService.searchLeads(user.id, query.trim(), {
      page,
      pageSize,
      ...(status && { status }),
    });

    return NextResponse.json({
      success: true,
      data: {
        leads: result.leads,
        hasNextPage: result.hasNextPage,
        totalCount: result.totalCount,
        searchQuery: query.trim(),
      },
    });

  } catch (error) {
    return handleApiError(error, "Search leads error");
  }
}