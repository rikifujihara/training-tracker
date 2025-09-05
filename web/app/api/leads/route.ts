import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LeadService } from "@/lib/services/lead.service";

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

export async function GET() {
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

    // Get leads for the user
    const leads = await LeadService.getLeadsByUserId(user.id);
    const stats = await LeadService.getLeadStats(user.id);

    return NextResponse.json({
      success: true,
      data: {
        leads,
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