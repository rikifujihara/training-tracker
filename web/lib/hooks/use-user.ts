"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<User | null> => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        throw error;
      }
      
      return user;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}

// Helper function to get user initials from user data
export function getUserInitials(user: User | null): string {
  if (!user) return "";
  
  // Try to get from user metadata first
  const firstName = user.user_metadata?.first_name;
  const lastName = user.user_metadata?.last_name;
  
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  
  // Fallback to email
  if (user.email) {
    const emailParts = user.email.split("@")[0];
    if (emailParts.includes(".")) {
      const parts = emailParts.split(".");
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return emailParts.slice(0, 2).toUpperCase();
  }
  
  return "U";
}

// Helper function to get user display name
export function getUserDisplayName(user: User | null): string {
  if (!user) return "Loading...";
  
  // Try to get from user metadata first
  const firstName = user.user_metadata?.first_name;
  const lastName = user.user_metadata?.last_name;
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  
  if (firstName) {
    return firstName;
  }
  
  // Fallback to email
  if (user.email) {
    return user.email.split("@")[0];
  }
  
  return "User";
}