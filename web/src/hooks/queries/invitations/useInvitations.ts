import { useQuery } from "@tanstack/react-query";
import { invitationsApi } from "@/lib/api/invitations/client";
import { InvitationType } from "@/lib/api/invitations/types";

export const useInvitations = (type: InvitationType) => {
  return useQuery({
    queryKey: ["invitations", type],
    queryFn: () => invitationsApi.getInvitations(type),
  });
};