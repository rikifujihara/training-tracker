import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LeadService } from "@/lib/services/lead.service";
import { LeadStatus } from "@/lib/types/lead";

export async function GET(request: Request) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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
    console.error("Get leads error:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}