import { NextRequest } from "next/server";
import { userService } from "@/services/userService";
import { getAuthenticatedUser } from "@/lib/api/auth";
import { handleApiError } from "@/lib/api/errors";
import { createSuccessResponse } from "@/lib/api/responses";
import { z } from "zod";

const AssignTrainerRequestSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  trainerId: z.string().min(1, "Trainer ID is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Clean authentication
    const user = await getAuthenticatedUser();

    // Parse request body
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

// Unassign client from trainer
export async function DELETE(request: NextRequest) {
  try {
    // Clean authentication
    const user = await getAuthenticatedUser();

    // Get clientId from URL search params
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      throw new Error("Client ID is required");
    }

    // Unassign client
    const updatedClient = await userService.unassignClientFromTrainer(clientId);

    return createSuccessResponse(
      {
        client: {
          id: updatedClient.id,
          name: updatedClient.name,
          trainerId: updatedClient.trainerId, // Should be null
        },
      },
      "Client unassigned from trainer successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
