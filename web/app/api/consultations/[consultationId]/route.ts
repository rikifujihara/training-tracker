import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ConsultationService } from "@/lib/services/consultation.service";
import { UpdateConsultationInput } from "@/lib/types/consultation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ consultationId: string }> }
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
    const consultationId = resolvedParams.consultationId;

    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get('includeRelations') === 'true';

    let consultation;
    
    if (includeRelations) {
      consultation = await ConsultationService.getConsultationByIdWithRelations(consultationId, user.id);
    } else {
      consultation = await ConsultationService.getConsultationById(consultationId, user.id);
    }

    if (!consultation) {
      return NextResponse.json(
        { error: "Consultation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { consultation },
    });

  } catch (error) {
    console.error("Get consultation error:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch consultation" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ consultationId: string }> }
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
    const consultationId = resolvedParams.consultationId;

    // Parse request body
    const body = await request.json();
    const updateData: UpdateConsultationInput = {};

    // Only update fields that are provided
    if (body.scheduledTime !== undefined) {
      updateData.scheduledTime = new Date(body.scheduledTime);
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }
    if (body.status !== undefined) {
      updateData.status = body.status;
    }
    if (body.outcome !== undefined) {
      updateData.outcome = body.outcome;
    }
    if (body.messageTemplateId !== undefined) {
      updateData.messageTemplateId = body.messageTemplateId;
    }
    if (body.reminderTime !== undefined) {
      updateData.reminderTime = body.reminderTime ? new Date(body.reminderTime) : null;
    }

    // Update consultation
    const consultation = await ConsultationService.updateConsultation(
      consultationId,
      user.id,
      updateData
    );

    return NextResponse.json({
      success: true,
      data: { consultation },
    });

  } catch (error) {
    console.error("Update consultation error:", error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update consultation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ consultationId: string }> }
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
    const consultationId = resolvedParams.consultationId;

    // Delete consultation
    await ConsultationService.deleteConsultation(consultationId, user.id);

    return NextResponse.json({
      success: true,
      message: "Consultation deleted successfully",
    });

  } catch (error) {
    console.error("Delete consultation error:", error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to delete consultation" },
      { status: 500 }
    );
  }
}