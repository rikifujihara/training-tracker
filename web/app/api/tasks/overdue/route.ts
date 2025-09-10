import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TaskService } from "@/lib/services/task.service";

export async function GET() {
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

    // Get overdue tasks
    const tasks = await TaskService.getOverdueTasks(user.id);

    return NextResponse.json({
      success: true,
      data: { tasks },
    });

  } catch (error) {
    console.error("Get overdue tasks error:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch overdue tasks" },
      { status: 500 }
    );
  }
}