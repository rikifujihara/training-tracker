import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LeadService } from "@/lib/services/lead.service";
import { UpdateLeadInput } from "@/lib/types/lead";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
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

    const resolvedParams = await params;
    const leadId = resolvedParams.leadId;
    
    // Parse request body
    const body = await request.json();
    const updateData: UpdateLeadInput = {
      firstName: body.firstName,
      lastName: body.lastName,
      age: body.age,
      birthday: body.birthday,
      gender: body.gender,
      phoneNumber: body.phoneNumber,
      email: body.email,
      goals: body.goals,
      generalNotes: body.generalNotes,
    };

    // Remove undefined values
    const cleanedData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined)
    ) as UpdateLeadInput;

    // Update lead
    const lead = await LeadService.updateLead(leadId, user.id, cleanedData);

    return NextResponse.json({
      success: true,
      data: lead,
    });

  } catch (error) {
    console.error("Update lead error:", error);
    
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}