import { NextRequest } from "next/server";
import { UserRole } from "@prisma/client";
import { userService } from "@/services/userService";
import { requireRole } from "@/lib/api/auth";
import { handleApiError } from "@/lib/api/errors";
import { createCachedResponse } from "@/lib/api/responses";

export async function GET(request: NextRequest) {
  try {
    // Clean authentication with role checking
    const user = await requireRole(UserRole.TRAINER);

    // Get trainer dashboard data
    const dashboardData = await userService.getTrainerDashboard(user.id);

    // Clean cached response
    return createCachedResponse(
      dashboardData,
      300, // 5 minutes
      60, // 1 minute stale-while-revalidate
      {
        meta: { userId: user.id },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
