import { NextResponse } from "next/server";
import { TaskService } from "@/lib/services/task";
import { requireAuth } from "@/lib/utils/auth";
import { handleApiError } from "@/lib/utils/error-handling";

export async function GET(request: Request) {
  try {
    // Check authentication
    const user = await requireAuth();

    // Parse date range parameters from client
    const { searchParams } = new URL(request.url);

    // Expect client to send today, overdue, and upcoming date ranges
    const todayStart = searchParams.get('todayStart');
    const todayEnd = searchParams.get('todayEnd');
    const overdueEnd = searchParams.get('overdueEnd');
    const upcomingStart = searchParams.get('upcomingStart');

    if (!todayStart || !todayEnd || !overdueEnd || !upcomingStart) {
      return NextResponse.json(
        { error: "Missing required date range parameters" },
        { status: 400 }
      );
    }

    const dateRanges = {
      today: {
        startDate: new Date(todayStart),
        endDate: new Date(todayEnd),
      },
      overdue: {
        endDate: new Date(overdueEnd),
      },
      upcoming: {
        startDate: new Date(upcomingStart),
      },
    };

    // Get task statistics
    const stats = await TaskService.getTaskStats(user.id, dateRanges);

    return NextResponse.json({
      success: true,
      data: { stats },
    });

  } catch (error) {
    return handleApiError(error, "Get task stats error");
  }
}