import { NextRequest } from "next/server";
import { UserRoleSchema } from "@/types/generated";
import { userService } from "@/services/userService";
import { getAuthenticatedUser } from "@/lib/api/auth";
import { handleApiError } from "@/lib/api/errors";
import { createSuccessResponse } from "@/lib/api/responses";
import { z } from "zod";

// API request schema using generated types
const CompleteProfileRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  role: UserRoleSchema, // Use generated enum schema
  businessName: z.string().optional(),
  bio: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Clean authentication
    const user = await getAuthenticatedUser();

    // Parse and validate request body
    const body = await request.json();
    const validatedData = CompleteProfileRequestSchema.parse(body);

    // Call service layer
    const updatedUser = await userService.completeProfile(
      user.id,
      validatedData
    );

    // Clean success response
    return createSuccessResponse(
      {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
          businessName: updatedUser.businessName,
          bio: updatedUser.bio,
          phone: updatedUser.phone,
        },
      },
      "Profile completed successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
