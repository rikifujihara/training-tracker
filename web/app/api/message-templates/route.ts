import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MessageTemplateService, CreateTemplateInput } from "@/lib/services/messageTemplate.service";

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

    // Get templates for the user
    const templates = await MessageTemplateService.getTemplatesForUser(user.id);

    return NextResponse.json({
      success: true,
      data: { templates },
    });

  } catch (error) {
    console.error("Get templates error:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
    const { name, content }: CreateTemplateInput = body;

    // Validate input
    if (!name || !content) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 }
      );
    }

    // Create template
    const template = await MessageTemplateService.createTemplate(user.id, {
      name,
      content,
    });

    return NextResponse.json({
      success: true,
      data: { template },
    });

  } catch (error) {
    console.error("Create template error:", error);
    
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}