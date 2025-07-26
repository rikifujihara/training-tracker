import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";

export const authOptions: NextAuthOptions = {
  // Use Prisma adapter - much cleaner!
  adapter: PrismaAdapter(prisma),

  // Configure OAuth providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Custom pages
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  // Callbacks to customize the auth flow
  callbacks: {
    // Called whenever a session is checked
    async session({ session, user }) {
      // Add user id and role to the session
      if (session.user && user) {
        session.user.id = user.id;
        // Cast user to access our custom fields
        const userWithRole = user as any;
        session.user.role = userWithRole.role || "CLIENT";
        session.user.isActive = userWithRole.isActive ?? true;
      }
      return session;
    },
  },

  // Events - useful for logging and side effects
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser) {
        console.log(`New user signed up: ${user.email}`);
        // Here we could set default role, send welcome emails, etc.
      }
    },

    async signOut({ session, token }) {
      console.log(`User signed out: ${session?.user?.email}`);
    },
  },

  // Session configuration
  session: {
    strategy: "database", // Store sessions in MongoDB via Prisma
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Security
  secret: process.env.NEXTAUTH_SECRET,
};
