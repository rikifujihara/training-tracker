import { useQuery } from "@tanstack/react-query";
import { trainerApi } from "@/lib/api/trainers";

/**
 * Trainer-related TanStack Query hooks
 * Only responsible for state management
 */

export function useTrainerDashboard() {
  return useQuery({
    queryKey: ["dashboard", "trainer"],
    queryFn: trainerApi.getDashboard,
  });
}

export function useAvailableTrainers() {
  return useQuery({
    queryKey: ["trainers", "available"],
    queryFn: trainerApi.getAvailable,
  });
}
