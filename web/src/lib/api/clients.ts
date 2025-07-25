import { apiClient } from "./client";
import { z } from "zod";

// API endpoints
const ENDPOINTS = {
  ASSIGN_TRAINER: "/clients/assign-trainer",
} as const;

// Request schemas
export const AssignTrainerRequestSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  trainerId: z.string().min(1, "Trainer ID is required"),
});

export type AssignTrainerRequest = z.infer<typeof AssignTrainerRequestSchema>;

// Response types
export interface AssignTrainerResponse {
  client: {
    id: string;
    name: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    trainerId: string | null;
  };
}

/**
 * Client API service - handles client-related API calls
 */
export const clientApi = {
  async assignTrainer(
    data: AssignTrainerRequest
  ): Promise<AssignTrainerResponse> {
    const validatedData = AssignTrainerRequestSchema.parse(data);
    return apiClient.post<AssignTrainerResponse>(
      ENDPOINTS.ASSIGN_TRAINER,
      validatedData
    );
  },

  async unassignTrainer(clientId: string): Promise<AssignTrainerResponse> {
    return apiClient.delete<AssignTrainerResponse>(
      `${ENDPOINTS.ASSIGN_TRAINER}?clientId=${clientId}`
    );
  },
} as const;
