import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TaskService } from "@/lib/services/task.service";
import { UpdateTaskInput } from "@/lib/types/task";

export async function GET(
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

    // Validate task ID
    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get('includeRelations') === 'true';

    let task;
    
    if (includeRelations) {
      task = await TaskService.getTaskByIdWithRelations(taskId, user.id);
    } else {
      task = await TaskService.getTaskById(taskId, user.id);
    }

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { task },
    });

  } catch (error) {
    console.error("Get task error:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Parse request body
    const body = await request.json();
    const updateData: UpdateTaskInput = {};

    // Build update object with only provided fields
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.dueDate !== undefined) updateData.dueDate = new Date(body.dueDate);
    if (body.taskType !== undefined) updateData.taskType = body.taskType;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.messageTemplateId !== undefined) updateData.messageTemplateId = body.messageTemplateId;
    if (body.completedAt !== undefined) updateData.completedAt = body.completedAt ? new Date(body.completedAt) : undefined;
    if (body.notes !== undefined) updateData.notes = body.notes;

    // Validate task ID
    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Update task
    const task = await TaskService.updateTask(taskId, user.id, updateData);

    return NextResponse.json({
      success: true,
      data: { task },
    });

  } catch (error) {
    console.error("Update task error:", error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Validate task ID
    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Delete task
    await TaskService.deleteTask(taskId, user.id);

    return NextResponse.json({
      success: true,
      data: { deleted: true },
    });

  } catch (error) {
    console.error("Delete task error:", error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}