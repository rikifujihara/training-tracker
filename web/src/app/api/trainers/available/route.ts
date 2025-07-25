import { NextRequest } from "next/server";
import { userService } from "@/services/userService";
import { getAuthenticatedUser } from "@/lib/api/auth";
import { handleApiError } from "@/lib/api/errors";
import { createCachedResponse } from "@/lib/api/responses";

export async function GET(request: NextRequest) {
  try {
    // Clean authentication
    const user = await getAuthenticatedUser();

    // Get available trainers
    const trainers = await userService.getAvailableTrainers();

    // Clean cached response
    return createCachedResponse(
      {
        trainers,
        count: trainers.length,
      },
      600, // 10 minutes - trainer list doesn't change frequently
      120, // 2 minutes stale-while-revalidate
      {
        meta: { cached: true },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
