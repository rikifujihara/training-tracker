import { createClient } from "@/lib/supabase/server";
import { createUnauthorizedResponse } from "./error-handling";
import type { User } from "@supabase/supabase-js";

/**
 * Authentication utilities for API routes
 */

export interface AuthResult {
  user: User | null;
  error: boolean;
}

/**
 * Checks authentication and returns user or null
 * Used in API routes to verify the user is authenticated
 */
export async function checkAuthentication(): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return { user: null, error: true };
    }

    return { user, error: false };
  } catch {
    return { user: null, error: true };
  }
}

/**
 * Middleware function for API routes that require authentication
 * Returns user if authenticated, or throws with appropriate response
 */
export async function requireAuth(): Promise<User> {
  const { user, error } = await checkAuthentication();

  if (error || !user) {
    throw createUnauthorizedResponse();
  }

  return user;
}

/**
 * Type guard to check if a user is authenticated
 */
export function isAuthenticated(user: User | null): user is User {
  return user !== null;
}