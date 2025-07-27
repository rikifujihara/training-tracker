"use client";

import { useSession, signOut } from "next-auth/react";
import { UserRole } from "@prisma/client";
import { Dumbbell } from "lucide-react";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="page-container page-padding">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-6 w-6" />
              <h1 className="text-xl font-bold">FitTrack</h1>
              {session?.user.role === UserRole.TRAINER && (
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                  Trainer
                </span>
              )}
              {session?.user.role === UserRole.CLIENT && (
                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200">
                  Client
                </span>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Welcome, {session?.user.name || session?.user.email}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="page-container page-padding page-content">
        {children}
      </main>
    </div>
  );
}
