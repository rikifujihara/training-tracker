import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LeadService } from "@/lib/services/lead";

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

    // Parse date range parameters from client
    const { searchParams } = new URL(request.url);

    // Expect client to send today, overdue, and upcoming date ranges
    const todayStart = searchParams.get('todayStart');
    const todayEnd = searchParams.get('todayEnd');
    const overdueEnd = searchParams.get('overdueEnd');
    const upcomingStart = searchParams.get('upcomingStart');

    if (!todayStart || !todayEnd || !overdueEnd || !upcomingStart) {
      return NextResponse.json(
        { error: "Missing required date range parameters" },
        { status: 400 }
      );
    }

    const dateRanges = {
      today: {
        startDate: new Date(todayStart),
        endDate: new Date(todayEnd),
      },
      overdue: {
        endDate: new Date(overdueEnd),
      },
      upcoming: {
        startDate: new Date(upcomingStart),
      },
    };

    // Get filter counts for the user
    const filterCounts = await LeadService.getProspectFilterCounts(user.id, dateRanges);

    return NextResponse.json({
      success: true,
      data: filterCounts,
    });

  } catch (error) {
    console.error("Get filter counts error:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch filter counts" },
      { status: 500 }
    );
  }
}