import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi, type AssignTrainerRequest } from "@/lib/api/clients";

/**
 * Client-related TanStack Query hooks
 * Only responsible for state management
 */

export function useAssignClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientApi.assignTrainer,
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUnassignClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientApi.unassignTrainer,
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
