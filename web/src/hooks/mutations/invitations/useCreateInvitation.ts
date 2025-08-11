import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationsApi } from "@/lib/api/invitations/client";
import { CreateInvitationRequest } from "@/lib/api/invitations/types";

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvitationRequest) => invitationsApi.create(data),
    onSuccess: () => {
      // Invalidate sent invitations to refresh the list
      queryClient.invalidateQueries({ queryKey: ["invitations", "sent"] });
    },
  });
};