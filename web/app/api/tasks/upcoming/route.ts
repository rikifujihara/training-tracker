import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "@/lib/services/task";
import { requireAuth } from "@/lib/utils/auth";
import { handleApiError } from "@/lib/utils/error-handling";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await requireAuth();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required date range parameters: startDate, endDate" },
        { status: 400 }
      );
    }

    const dateRange = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };

    // Get upcoming tasks
    const tasks = await TaskService.getUpcomingTasks(user.id, dateRange);

    return NextResponse.json({
      success: true,
      data: { tasks },
    });

  } catch (error) {
    return handleApiError(error, "Get upcoming tasks error");
  }
}