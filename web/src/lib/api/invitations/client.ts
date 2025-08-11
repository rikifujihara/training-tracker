import { apiClient } from "../shared/client";
import { ApiSuccess } from "../shared/types";
import { 
  CreateInvitationRequest, 
  InvitationWithInviter, 
  InvitationWithInvitee,
  InvitationType 
} from "./types";
import { Invitation } from "@/types/generated";

export const invitationsApi = {
  // Create invitation (trainers only)
  create: (data: CreateInvitationRequest) =>
    apiClient.post<ApiSuccess<Invitation>>("/invitations", data),

  // Get invitations (sent or received)
  getInvitations: (type: InvitationType) =>
    apiClient.get<ApiSuccess<InvitationWithInviter[] | InvitationWithInvitee[]>>(
      `/invitations?type=${type}`
    ),

  // Accept invitation
  accept: (invitationId: string) =>
    apiClient.patch<ApiSuccess<Invitation>>(`/invitations/${invitationId}/accept`),

  // Decline invitation
  decline: (invitationId: string) =>
    apiClient.patch<ApiSuccess<Invitation>>(`/invitations/${invitationId}/decline`),
};