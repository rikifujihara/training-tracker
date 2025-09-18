import { NextResponse } from "next/server";
import { TaskService } from "@/lib/services/task";
import { requireAuth } from "@/lib/utils/auth";
import { handleApiError } from "@/lib/utils/error-handling";

export async function GET(request: Request) {
  try {
    // Check authentication
    const user = await requireAuth();

    const { searchParams } = new URL(request.url);
    const beforeDate = searchParams.get('beforeDate');

    if (!beforeDate) {
      return NextResponse.json(
        { error: "Missing required parameter: beforeDate" },
        { status: 400 }
      );
    }

    // Get overdue tasks
    const tasks = await TaskService.getOverdueTasks(user.id, new Date(beforeDate));

    return NextResponse.json({
      success: true,
      data: { tasks },
    });

  } catch (error) {
    return handleApiError(error, "Get overdue tasks error");
  }
}