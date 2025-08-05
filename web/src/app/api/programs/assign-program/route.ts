import { getAuthenticatedUser } from "@/lib/api/auth";
import { NextRequest } from "next/server";
import { z } from "zod";
import { userService } from "@/services/userService";
import { createSuccessResponse } from "@/lib/api/responses";
import { handleApiError } from "@/lib/api/errors";

const AssignTrainerRequestSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  trainerId: z.string().min(1, "Trainer ID is required"),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    const body = await request.json();
    const validatedData = AssignTrainerRequestSchema.parse(body);

    // Assign client to trainer
    const updatedClient = await userService.assignClientToTrainer(
      validatedData
    );

    // Clean success response
    return createSuccessResponse(
      {
        client: {
          id: updatedClient.id,
          name: updatedClient.name,
          email: updatedClient.email,
          firstName: updatedClient.firstName,
          lastName: updatedClient.lastName,
          trainerId: updatedClient.trainerId,
        },
      },
      "Client assigned to trainer successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
