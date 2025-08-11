import { z } from "zod";
import { UserRoleSchema } from "@/types/generated";

// Request schemas
export const UpdateUserRoleRequestSchema = z.object({
  role: UserRoleSchema,
});

export type UpdateUserRoleRequest = z.infer<typeof UpdateUserRoleRequestSchema>;

// Response schemas - use a subset of User fields for API responses
export const UserApiResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  role: UserRoleSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserApiResponse = z.infer<typeof UserApiResponseSchema>;