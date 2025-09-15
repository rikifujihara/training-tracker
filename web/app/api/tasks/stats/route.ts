import { NextResponse } from "next/server";
import { TaskService } from "@/lib/services/task.service";
import { requireAuth } from "@/lib/utils/auth";
import { handleApiError } from "@/lib/utils/error-handling";

export async function GET() {
  try {
    // Check authentication
    const user = await requireAuth();

    // Get task statistics
    const stats = await TaskService.getTaskStats(user.id);

    return NextResponse.json({
      success: true,
      data: { stats },
    });

  } catch (error) {
    return handleApiError(error, "Get task stats error");
  }
}