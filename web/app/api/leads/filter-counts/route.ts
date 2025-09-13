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
    const status = searchParams.get('status') as LeadStatus | null;

    // Get filter counts for the user
    const filterCounts = await LeadService.getProspectFilterCounts(user.id, status || undefined);

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