import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "@/lib/services/task";
import { requireAuth } from "@/lib/utils/auth";
import { handleApiError } from "@/lib/utils/error-handling";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await requireAuth();

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    // Get upcoming tasks
    const tasks = await TaskService.getUpcomingTasks(user.id, days);

    return NextResponse.json({
      success: true,
      data: { tasks },
    });

  } catch (error) {
    return handleApiError(error, "Get upcoming tasks error");
  }
}