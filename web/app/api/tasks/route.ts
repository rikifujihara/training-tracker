import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TaskService } from "@/lib/services/task.service";
import { CreateTaskInput } from "@/lib/types/task";

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

    let tasks;
    
    if (leadId) {
      // Get tasks for specific lead
      tasks = await TaskService.getTasksByLeadId(leadId, user.id);
    } else if (includeRelations) {
      // Get tasks with lead and template information
      tasks = await TaskService.getTasksWithRelations(user.id);
    } else {
      // Get all tasks for user
      tasks = await TaskService.getTasksByUserId(user.id);
    }

    return NextResponse.json({
      success: true,
      data: { tasks },
    });

  } catch (error) {
    console.error("Get tasks error:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
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
    const taskData: CreateTaskInput = {
      leadId: body.leadId,
      title: body.title,
      description: body.description,
      dueDate: new Date(body.dueDate),
      taskType: body.taskType,
      messageTemplateId: body.messageTemplateId,
    };

    // Validate required fields
    if (!taskData.leadId || !taskData.title || !taskData.dueDate || !taskData.taskType) {
      return NextResponse.json(
        { error: "Missing required fields: leadId, title, dueDate, taskType" },
        { status: 400 }
      );
    }

    // Create task
    const task = await TaskService.createTask(user.id, taskData);

    return NextResponse.json({
      success: true,
      data: { task },
    }, { status: 201 });

  } catch (error) {
    console.error("Create task error:", error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}