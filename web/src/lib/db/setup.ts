import { getDatabase } from "./connection";

// Collection names - centralized so we can't make typos
export const COLLECTIONS = {
  USERS: "users",
  ACCOUNTS: "accounts", // NextAuth accounts
  SESSIONS: "sessions", // NextAuth sessions
  VERIFICATION_TOKENS: "verificationtokens", // NextAuth verification
} as const;

/**
 * Sets up all our MongoDB collections with proper indexes
 * Call this once when your app starts (or manually when needed)
 */
export async function setupDatabase() {
  try {
    const db = await getDatabase();

    console.log("Setting up database collections and indexes...");

    // Users collection
    const usersCollection = db.collection(COLLECTIONS.USERS);
    await usersCollection.createIndexes([
      { key: { email: 1 }, unique: true }, // Unique email
      { key: { role: 1 } }, // Query by role
      { key: { trainerId: 1 } }, // Find clients by trainer
      { key: { isActive: 1 } }, // Filter active users
      { key: { createdAt: 1 } }, // Sort by creation date
    ]);

    // NextAuth collections (required by the MongoDB adapter)
    const accountsCollection = db.collection(COLLECTIONS.ACCOUNTS);
    await accountsCollection.createIndexes([
      { key: { userId: 1 } },
      { key: { provider: 1, providerAccountId: 1 }, unique: true },
    ]);

    const sessionsCollection = db.collection(COLLECTIONS.SESSIONS);
    await sessionsCollection.createIndexes([
      { key: { userId: 1 } },
      { key: { sessionToken: 1 }, unique: true },
      { key: { expires: 1 }, expireAfterSeconds: 0 }, // Auto-delete expired sessions
    ]);

    const verificationCollection = db.collection(
      COLLECTIONS.VERIFICATION_TOKENS
    );
    await verificationCollection.createIndexes([
      { key: { identifier: 1, token: 1 }, unique: true },
      { key: { expires: 1 }, expireAfterSeconds: 0 }, // Auto-delete expired tokens
    ]);

    console.log("✅ Database setup completed successfully!");

    return {
      success: true,
      message: "Database collections and indexes created successfully",
    };
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    throw error;
  }
}

/**
 * Helper function to get a collection with proper typing
 */
export async function getCollection(name: keyof typeof COLLECTIONS) {
  const db = await getDatabase();
  return db.collection(COLLECTIONS[name]);
}
