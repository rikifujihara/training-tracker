import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { userApi } from "@/lib/api/user/client";
import { UpdateUserRoleRequest } from "@/lib/api/user/types";
import { ApiClientError } from "@/lib/api/shared/client";

interface UseUpdateUserRoleOptions {
  onSuccess?: () => void;
  onError?: (error: ApiClientError) => void;
  redirectTo?: string;
}

export function useUpdateUserRole(options: UseUpdateUserRoleOptions = {}) {
  const router = useRouter();
  const { onSuccess, onError, redirectTo = "/" } = options;

  return useMutation({
    mutationFn: (data: UpdateUserRoleRequest) => userApi.updateRole(data),
    onSuccess: (data) => {
      onSuccess?.();
      if (redirectTo) {
        router.push(redirectTo);
      }
    },
    onError: (error: ApiClientError) => {
      console.error("Failed to update user role:", error);
      onError?.(error);
    },
  });
}