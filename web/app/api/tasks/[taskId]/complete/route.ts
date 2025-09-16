import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TaskService } from "@/lib/services/task";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
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
    const taskId = resolvedParams.taskId;

    // Parse request body for optional notes
    const body = await request.json();
    const notes = body.notes;

    // Validate task ID
    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Mark task as completed
    const task = await TaskService.markTaskCompleted(taskId, user.id, notes);

    return NextResponse.json({
      success: true,
      data: { task },
    });

  } catch (error) {
    console.error("Complete task error:", error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to complete task" },
      { status: 500 }
    );
  }
}