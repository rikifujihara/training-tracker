import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ContactPointService } from "@/lib/services/contactPoint";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: contactPointId } = await params;

    if (!contactPointId) {
      return NextResponse.json(
        { error: "Contact point ID is required" },
        { status: 400 }
      );
    }

    // Delete contact point
    await ContactPointService.deleteContactPoint(contactPointId, user.id);

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error("Delete contact point error:", error);

    const errorMessage = error instanceof Error ? error.message : "Failed to delete contact point";
    const statusCode = errorMessage.includes("not found") || errorMessage.includes("access denied") ? 404 : 500;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}