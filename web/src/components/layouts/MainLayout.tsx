"use client";

import { ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";
import { UserRole } from "@prisma/client";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Trainer Admin
          </h2>
          <p className="text-gray-600 mb-6">Please sign in to continue</p>
          <a
            href="/auth/signin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Trainer Admin</h1>
              {session?.user.role === UserRole.TRAINER && (
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Trainer
                </span>
              )}
              {session?.user.role === UserRole.CLIENT && (
                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Client
                </span>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welcome, {session?.user.name || session?.user.email}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
