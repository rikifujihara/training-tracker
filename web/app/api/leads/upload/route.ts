import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LeadService } from "@/lib/services/lead.service";
import { CreateLeadInput } from "@/lib/types/lead";

export async function POST(request: NextRequest) {
  try {
    // Debug: Log DATABASE_URL format (first 20 chars only for security)
    console.log("DATABASE_URL format:", process.env.DATABASE_URL?.substring(0, 20));
    
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { leads }: { leads: CreateLeadInput[] } = body;

    // Validate input
    if (!Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json(
        { error: "Invalid input: leads array is required" },
        { status: 400 }
      );
    }

    // Validate individual leads
    const validLeads = leads.filter(lead => {
      // At least one field must be present
      return lead.firstName || lead.lastName || lead.email || lead.phoneNumber;
    });

    if (validLeads.length === 0) {
      return NextResponse.json(
        { error: "No valid leads found. Each lead must have at least a name, email, or phone number." },
        { status: 400 }
      );
    }

    // Create leads in database
    const createdLeads = await LeadService.createLeads(user.id, validLeads);

    // Get updated stats
    const stats = await LeadService.getLeadStats(user.id);

    return NextResponse.json({
      success: true,
      data: {
        leads: createdLeads,
        stats,
        imported: createdLeads.length,
        skipped: leads.length - validLeads.length,
      },
    });

  } catch (error) {
    console.error("Lead upload error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "Some leads already exist in your database" },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}