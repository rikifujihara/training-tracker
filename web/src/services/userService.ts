import { userRepository } from "@/repositories/userRepository";
import { User, UserRole, Prisma } from "@prisma/client";
import { UserSchema, UserRoleSchema } from "@/types/generated";
import { z } from "zod";

// Custom schemas built on top of generated Prisma schemas
const CompleteProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  role: UserRoleSchema, // Use generated enum schema
  // Trainer-specific fields
  businessName: z.string().optional(),
  bio: z.string().optional(),
});

const AssignClientSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  trainerId: z.string().min(1, "Trainer ID is required"),
});

export type CompleteProfile = z.infer<typeof CompleteProfileSchema>;
export type AssignClient = z.infer<typeof AssignClientSchema>;

export class UserService {
  /**
   * Complete a user's profile after initial signup
   */
  async completeProfile(
    userId: string,
    profileData: CompleteProfile
  ): Promise<User> {
    // Validate input data
    const validatedData = CompleteProfileSchema.parse(profileData);

    // Check if user exists
    const existingUser = await userRepository.findById(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Business rule: Can't change role if user already has clients/trainer
    if (existingUser.role !== validatedData.role) {
      if (existingUser.role === "TRAINER") {
        const clients = await userRepository.findClientsByTrainerId(userId);
        if (clients.length > 0) {
          throw new Error("Cannot change role: Trainer has active clients");
        }
      }

      if (existingUser.role === "CLIENT" && existingUser.trainerId) {
        throw new Error("Cannot change role: Client is assigned to a trainer");
      }
    }

    // Business rule: Trainers must have business name
    if (validatedData.role === "TRAINER" && !validatedData.businessName) {
      throw new Error("Business name is required for trainers");
    }

    // Update user with validated data
    return await userRepository.updateById(userId, {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      phone: validatedData.phone,
      role: validatedData.role,
      businessName: validatedData.businessName,
      bio: validatedData.bio,
    });
  }

  /**
   * Assign a client to a trainer
   */
  async assignClientToTrainer(assignmentData: AssignClient): Promise<User> {
    const validatedData = AssignClientSchema.parse(assignmentData);

    // Validate both users exist and have correct roles
    const [client, trainer] = await Promise.all([
      userRepository.findById(validatedData.clientId),
      userRepository.findById(validatedData.trainerId),
    ]);

    if (!client) throw new Error("Client not found");
    if (!trainer) throw new Error("Trainer not found");

    if (client.role !== "CLIENT") throw new Error("User is not a client");
    if (trainer.role !== "TRAINER") throw new Error("User is not a trainer");

    // Business rule: Client can only have one trainer
    if (client.trainerId) {
      throw new Error("Client is already assigned to a trainer");
    }

    // Business rule: Check if trainer is active
    if (!trainer.isActive) {
      throw new Error("Cannot assign to inactive trainer");
    }

    // Use trainer relation instead of trainerId
    return await userRepository.updateById(validatedData.clientId, {
      trainer: {
        connect: { id: validatedData.trainerId },
      },
    });
  }

  /**
   * Remove client from trainer
   */
  async unassignClientFromTrainer(clientId: string): Promise<User> {
    const client = await userRepository.findById(clientId);
    if (!client) throw new Error("Client not found");
    if (client.role !== "CLIENT") throw new Error("User is not a client");
    if (!client.trainerId)
      throw new Error("Client is not assigned to any trainer");

    return await userRepository.updateById(clientId, {
      trainer: {
        disconnect: true,
      },
    });
  }

  /**
   * Get trainer dashboard data
   */
  async getTrainerDashboard(trainerId: string) {
    const trainer = await userRepository.findById(trainerId);
    if (!trainer) throw new Error("Trainer not found");
    if (trainer.role !== "TRAINER") throw new Error("User is not a trainer");

    const [clients, totalClients] = await Promise.all([
      userRepository.findClientsByTrainerId(trainerId),
      userRepository.countByRole("CLIENT"),
    ]);

    return {
      trainer: {
        id: trainer.id,
        name: trainer.name,
        businessName: trainer.businessName,
        bio: trainer.bio,
      },
      clients: clients.map((client) => ({
        id: client.id,
        name: client.name,
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        createdAt: client.createdAt,
      })),
      stats: {
        totalClients: clients.length,
        totalClientsInSystem: totalClients,
      },
    };
  }

  /**
   * Get all available trainers (for client to choose from)
   */
  async getAvailableTrainers(): Promise<Partial<User>[]> {
    const trainers = await userRepository.findByRole("TRAINER");

    // Return only public information
    return trainers.map((trainer) => ({
      id: trainer.id,
      name: trainer.name,
      businessName: trainer.businessName,
      bio: trainer.bio,
      createdAt: trainer.createdAt,
    }));
  }

  /**
   * Deactivate user account
   */
  async deactivateUser(
    userId: string,
    requestingUserId: string
  ): Promise<User> {
    // Business rule: Users can only deactivate their own accounts
    // (Later we could add admin permissions)
    if (userId !== requestingUserId) {
      throw new Error("You can only deactivate your own account");
    }

    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    // Business rule: Trainers with active clients cannot deactivate
    if (user.role === "TRAINER") {
      const clients = await userRepository.findClientsByTrainerId(userId);
      if (clients.length > 0) {
        throw new Error(
          "Cannot deactivate: Please reassign your clients first"
        );
      }
    }

    return await userRepository.deactivate(userId);
  }
}

// Export singleton instance
export const userService = new UserService();
