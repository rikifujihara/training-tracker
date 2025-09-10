import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MessageTemplateService, CreateTemplateInput } from "@/lib/services/messageTemplate.service";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
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
    const templateId = resolvedParams.templateId;

    // Parse request body
    const body = await request.json();
    const updateData: Partial<CreateTemplateInput> = body;

    // Validate template ID
    if (!templateId) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      );
    }

    // Update template
    const template = await MessageTemplateService.updateTemplate(
      templateId,
      user.id,
      updateData
    );

    return NextResponse.json({
      success: true,
      data: { template },
    });

  } catch (error) {
    console.error("Update template error:", error);
    
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ templateId: string }> }
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
    const templateId = resolvedParams.templateId;

    // Validate template ID
    if (!templateId) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      );
    }

    // Delete template
    await MessageTemplateService.deleteTemplate(templateId, user.id);

    return NextResponse.json({
      success: true,
      data: { deleted: true },
    });

  } catch (error) {
    console.error("Delete template error:", error);
    
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    );
  }
}