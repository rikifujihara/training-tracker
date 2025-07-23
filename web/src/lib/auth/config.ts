import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/db/connection";
import { UserSchema } from "@/types/user";

export const authOptions: NextAuthOptions = {
  // Use MongoDB adapter to store users, accounts, sessions
  adapter: MongoDBAdapter(clientPromise),

  // Configure GitHub OAuth
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  // Custom pages (we'll create these next)
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  // Callbacks to customize the auth flow
  callbacks: {
    // Called whenever a user signs in
    async signIn({ user, account, profile }) {
      // Allow sign in
      return true;
    },

    // Called whenever a session is checked
    async session({ session, user }) {
      // Add user id and role to the session
      if (session.user && user) {
        session.user.id = user.id;
        // Cast user to our type to access custom fields
        const userWithRole = user as any;
        session.user.role = userWithRole.role || "CLIENT";
        session.user.isActive = userWithRole.isActive ?? true;
      }
      return session;
    },

    // Called when user is created for the first time
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role || "CLIENT";
        token.isActive = (user as any).isActive ?? true;
      }
      return token;
    },
  },

  // Events - useful for logging and side effects
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser) {
        console.log(`New user signed up: ${user.email}`);
        // Here we could send welcome emails, set up default data, etc.
      }
    },

    async signOut({ session, token }) {
      console.log(`User signed out: ${session?.user?.email}`);
    },
  },

  // Session configuration
  session: {
    strategy: "database", // Store sessions in MongoDB
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Security
  secret: process.env.NEXTAUTH_SECRET,
};
