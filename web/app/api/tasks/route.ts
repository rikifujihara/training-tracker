import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "@/lib/services/task.service";
import { CreateTaskInput } from "@/lib/types/task";
import { requireAuth } from "@/lib/utils/auth";
import { handleApiError, createBadRequestResponse } from "@/lib/utils/error-handling";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await requireAuth();

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
    return handleApiError(error, "Get tasks error");
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await requireAuth();

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
      return createBadRequestResponse("Missing required fields: leadId, title, dueDate, taskType");
    }

    // Create task
    const task = await TaskService.createTask(user.id, taskData);

    return NextResponse.json({
      success: true,
      data: { task },
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error, "Create task error");
  }
}