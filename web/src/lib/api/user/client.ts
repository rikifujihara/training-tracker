import { apiClient } from "../shared/client";
import { UpdateUserRoleRequest, UserApiResponse } from "./types";

export const userApi = {
  updateRole: async (data: UpdateUserRoleRequest): Promise<UserApiResponse> => {
    return apiClient.patch<UserApiResponse>("/user/role", data);
  },
};