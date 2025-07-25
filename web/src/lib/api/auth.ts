import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { UserRole } from "@prisma/client";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  isActive: boolean;
}

export class AuthenticationError extends Error {
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "AuthenticationError";
  }
}

/**
 * Get authenticated user from request
 * Throws AuthenticationError if not authenticated
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new AuthenticationError("Authentication required");
  }

  return {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.name,
    role: session.user.role,
    isActive: session.user.isActive,
  };
}

/**
 * Require specific user role
 * Throws AuthenticationError if user doesn't have required role
 */
export async function requireRole(role: UserRole): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser();

  if (user.role !== role) {
    throw new AuthenticationError(`${role} role required`);
  }

  return user;
}

/**
 * Require user to be active
 * Throws AuthenticationError if user is inactive
 */
export async function requireActiveUser(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser();

  if (!user.isActive) {
    throw new AuthenticationError("Account is inactive");
  }

  return user;
}
