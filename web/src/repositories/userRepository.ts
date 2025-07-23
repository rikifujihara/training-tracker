import { ObjectId, WithId, Document } from "mongodb";
import { getCollection, COLLECTIONS } from "@/lib/db/setup";
import {
  User,
  CreateUser,
  UpdateUser,
  UserRole,
  UserSchema,
} from "@/types/user";

// Helper function to convert MongoDB document to our User type
function documentToUser(doc: WithId<Document> | null): User | null {
  if (!doc) return null;

  // Convert MongoDB document to plain object and validate with Zod
  const plainDoc = {
    ...doc,
    _id: doc._id.toString(), // Convert ObjectId to string
  };

  try {
    return UserSchema.parse(plainDoc);
  } catch (error) {
    console.error("Error parsing user document:", error);
    throw new Error("Invalid user data from database");
  }
}

// Helper function for arrays
function documentsToUsers(docs: WithId<Document>[]): User[] {
  return docs
    .map((doc) => documentToUser(doc))
    .filter((user): user is User => user !== null);
}

export class UserRepository {
  /**
   * Find a user by their email address
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const collection = await getCollection("USERS");
      const user = await collection.findOne({ email });
      return documentToUser(user);
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Failed to find user by email");
    }
  }

  /**
   * Find a user by their ID
   */
  async findById(id: string): Promise<User | null> {
    try {
      const collection = await getCollection("USERS");
      const user = await collection.findOne({ _id: new ObjectId(id) });
      return documentToUser(user);
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw new Error("Failed to find user by ID");
    }
  }

  /**
   * Create a new user
   */
  async create(userData: CreateUser): Promise<User> {
    try {
      const collection = await getCollection("USERS");

      const newUser = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(newUser);

      if (!result.insertedId) {
        throw new Error("Failed to create user");
      }

      const createdUser = await collection.findOne({ _id: result.insertedId });
      const user = documentToUser(createdUser);

      if (!user) {
        throw new Error("Failed to retrieve created user");
      }

      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  /**
   * Update a user by ID
   */
  async updateById(id: string, updateData: UpdateUser): Promise<User | null> {
    try {
      const collection = await getCollection("USERS");

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...updateData,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" }
      );

      return documentToUser(result);
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }

  /**
   * Find all users by role
   */
  async findByRole(role: UserRole): Promise<User[]> {
    try {
      const collection = await getCollection("USERS");
      const users = await collection.find({ role, isActive: true }).toArray();
      return documentsToUsers(users);
    } catch (error) {
      console.error("Error finding users by role:", error);
      throw new Error("Failed to find users by role");
    }
  }

  /**
   * Find all clients for a specific trainer
   */
  async findClientsByTrainerId(trainerId: string): Promise<User[]> {
    try {
      const collection = await getCollection("USERS");
      const clients = await collection
        .find({
          trainerId,
          role: "CLIENT",
          isActive: true,
        })
        .toArray();
      return documentsToUsers(clients);
    } catch (error) {
      console.error("Error finding clients by trainer ID:", error);
      throw new Error("Failed to find clients for trainer");
    }
  }

  /**
   * Deactivate a user (soft delete)
   */
  async deactivate(id: string): Promise<boolean> {
    try {
      const collection = await getCollection("USERS");
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            isActive: false,
            updatedAt: new Date(),
          },
        }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Error deactivating user:", error);
      throw new Error("Failed to deactivate user");
    }
  }

  /**
   * Get user count by role (useful for analytics)
   */
  async countByRole(role: UserRole): Promise<number> {
    try {
      const collection = await getCollection("USERS");
      return await collection.countDocuments({ role, isActive: true });
    } catch (error) {
      console.error("Error counting users by role:", error);
      throw new Error("Failed to count users");
    }
  }
}

// Export a singleton instance
export const userRepository = new UserRepository();
