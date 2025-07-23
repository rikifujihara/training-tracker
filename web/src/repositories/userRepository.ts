import { prisma } from "@/lib/db/prisma";
import { User, UserRole, Prisma } from "@prisma/client";

export class UserRepository {
  /**
   * Find a user by their email address
   */
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find a user by their ID
   */
  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new user
   */
  async create(userData: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({
      data: userData,
    });
  }

  /**
   * Update a user by ID
   */
  async updateById(
    id: string,
    updateData: Prisma.UserUpdateInput
  ): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Find all users by role
   */
  async findByRole(role: UserRole): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        role,
        isActive: true,
      },
    });
  }

  /**
   * Find all clients for a specific trainer
   */
  async findClientsByTrainerId(trainerId: string): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        trainerId,
        role: "CLIENT",
        isActive: true,
      },
    });
  }

  /**
   * Find trainer with their clients
   */
  async findTrainerWithClients(trainerId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id: trainerId },
      include: {
        clients: {
          where: { isActive: true },
        },
      },
    });
  }

  /**
   * Deactivate a user (soft delete)
   */
  async deactivate(id: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Get user count by role (useful for analytics)
   */
  async countByRole(role: UserRole): Promise<number> {
    return await prisma.user.count({
      where: {
        role,
        isActive: true,
      },
    });
  }
}

// Export a singleton instance
export const userRepository = new UserRepository();
