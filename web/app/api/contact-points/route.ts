import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ContactPointService } from "@/lib/services/contactPoint.service";
import { CreateContactPointInput } from "@/lib/types/contactPoint";

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

    // Get URL search params
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (leadId) {
      // Get contact points for a specific lead
      const contactPoints = await ContactPointService.getContactPointsByLeadId(leadId, user.id);
      return NextResponse.json({
        success: true,
        data: {
          contactPoints,
        },
      });
    } else {
      // Get all contact points for the user
      const contactPoints = await ContactPointService.getContactPointsByUserId(user.id);
      return NextResponse.json({
        success: true,
        data: {
          contactPoints,
        },
      });
    }

  } catch (error) {
    console.error("Get contact points error:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch contact points" },
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
    const contactPointData: CreateContactPointInput = {
      leadId: body.leadId,
      contactType: body.contactType,
      contactDate: new Date(body.contactDate),
      outcome: body.outcome,
      notes: body.notes,
    };

    // Validate required fields
    if (!contactPointData.leadId || !contactPointData.contactType || !contactPointData.contactDate) {
      return NextResponse.json(
        { error: "Missing required fields: leadId, contactType, and contactDate are required" },
        { status: 400 }
      );
    }

    // Create contact point
    const contactPoint = await ContactPointService.createContactPoint(user.id, contactPointData);

    return NextResponse.json({
      success: true,
      data: contactPoint,
    }, { status: 201 });

  } catch (error) {
    console.error("Create contact point error:", error);
    
    return NextResponse.json(
      { error: "Failed to create contact point" },
      { status: 500 }
    );
  }
}