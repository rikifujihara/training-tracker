import { apiClient } from "./client";
import { UserRoleSchema } from "@/types/generated";
import { z } from "zod";

// API endpoints - single source of truth
const ENDPOINTS = {
  COMPLETE_PROFILE: "/users/complete-profile",
} as const;

// Request/Response schemas
export const CompleteProfileRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  role: UserRoleSchema,
  businessName: z.string().optional(),
  bio: z.string().optional(),
});

export type CompleteProfileRequest = z.infer<
  typeof CompleteProfileRequestSchema
>;

export interface CompleteProfileResponse {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    role: string;
    businessName: string | null;
    bio: string | null;
    phone: string | null;
  };
}

/**
 * User API service - handles user-related API calls
 * Pure functions, no state management
 */
export const userApi = {
  async completeProfile(
    data: CompleteProfileRequest
  ): Promise<CompleteProfileResponse> {
    // Validate input
    const validatedData = CompleteProfileRequestSchema.parse(data);

    // Make API call
    return apiClient.post<CompleteProfileResponse>(
      ENDPOINTS.COMPLETE_PROFILE,
      validatedData
    );
  },
} as const;
