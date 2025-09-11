import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ConsultationService } from "@/lib/services/consultation.service";
import { CreateConsultationInput } from "@/lib/types/consultation";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    const includeRelations = searchParams.get('includeRelations') === 'true';

    let consultations;
    
    if (leadId) {
      // Get consultations for specific lead
      consultations = await ConsultationService.getConsultationsByLeadId(leadId, user.id);
    } else if (includeRelations) {
      // Get consultations with lead and template information
      consultations = await ConsultationService.getConsultationsWithRelations(user.id);
    } else {
      // Get all consultations for user
      consultations = await ConsultationService.getConsultationsByUserId(user.id);
    }

    return NextResponse.json({
      success: true,
      data: { consultations },
    });

  } catch (error) {
    console.error("Get consultations error:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch consultations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const consultationData: CreateConsultationInput = {
      leadId: body.leadId,
      scheduledTime: new Date(body.scheduledTime),
      notes: body.notes,
      messageTemplateId: body.messageTemplateId,
      reminderTime: body.reminderTime ? new Date(body.reminderTime) : undefined,
    };

    // Validate required fields
    if (!consultationData.leadId || !consultationData.scheduledTime) {
      return NextResponse.json(
        { error: "Missing required fields: leadId, scheduledTime" },
        { status: 400 }
      );
    }

    // Create consultation
    const consultation = await ConsultationService.createConsultation(user.id, consultationData);

    return NextResponse.json({
      success: true,
      data: { consultation },
    }, { status: 201 });

  } catch (error) {
    console.error("Create consultation error:", error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create consultation" },
      { status: 500 }
    );
  }
}