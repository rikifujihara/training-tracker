import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TaskService } from "@/lib/services/task.service";

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
    const days = parseInt(searchParams.get('days') || '7');

    // Get upcoming tasks
    const tasks = await TaskService.getUpcomingTasks(user.id, days);

    return NextResponse.json({
      success: true,
      data: { tasks },
    });

  } catch (error) {
    console.error("Get upcoming tasks error:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch upcoming tasks" },
      { status: 500 }
    );
  }
}