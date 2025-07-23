import { z } from "zod";

// User roles enum
export const UserRole = z.enum(["TRAINER", "CLIENT"]);

// Base user schema - this matches what NextAuth will store
export const UserSchema = z.object({
  _id: z.string().optional(), // MongoDB ObjectId as string
  id: z.string().optional(), // NextAuth compatibility
  name: z.string().nullable(),
  email: z.email(),
  image: z.url().nullable(),
  emailVerified: z.date().nullable().optional(),

  // Our custom fields
  role: UserRole.default("CLIENT"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),

  // Profile fields that will be filled after initial auth
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),

  // Trainer-specific fields (will be null for clients)
  businessName: z.string().optional(),
  bio: z.string().optional(),
  certifications: z.array(z.string()).default([]),

  // Client-specific fields (will be null for trainers)
  trainerId: z.string().optional(), // Reference to their trainer

  // Status
  isActive: z.boolean().default(true),
});

// TypeScript types derived from Zod schemas
export type User = z.infer<typeof UserSchema>;
export type UserRole = z.infer<typeof UserRole>;

// Schemas for different operations
export const CreateUserSchema = UserSchema.omit({
  _id: true,
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateUserSchema = UserSchema.partial()
  .omit({
    _id: true,
    id: true,
    createdAt: true,
  })
  .extend({
    updatedAt: z.date().default(() => new Date()),
  });

// Schema for user registration/profile completion
export const CompleteProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  role: UserRole,
  // Trainer-specific
  businessName: z.string().optional(),
  bio: z.string().optional(),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type CompleteProfile = z.infer<typeof CompleteProfileSchema>;
