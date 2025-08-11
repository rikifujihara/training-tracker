import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationsApi } from "@/lib/api/invitations/client";

export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) => invitationsApi.accept(invitationId),
    onSuccess: () => {
      // Invalidate received invitations to refresh the list
      queryClient.invalidateQueries({ queryKey: ["invitations", "received"] });
    },
  });
};