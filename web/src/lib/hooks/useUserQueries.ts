import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, type CompleteProfileRequest } from "@/lib/api/users";

/**
 * User-related TanStack Query hooks
 * Only responsible for state management
 */

export function useCompleteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.completeProfile,
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
