import { NextResponse } from "next/server";
import { TaskService } from "@/lib/services/task";
import { requireAuth } from "@/lib/utils/auth";
import { handleApiError } from "@/lib/utils/error-handling";

export async function GET() {
  try {
    // Check authentication
    const user = await requireAuth();

    // Get overdue tasks
    const tasks = await TaskService.getOverdueTasks(user.id);

    return NextResponse.json({
      success: true,
      data: { tasks },
    });

  } catch (error) {
    return handleApiError(error, "Get overdue tasks error");
  }
}