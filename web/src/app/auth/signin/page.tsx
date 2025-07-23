"use client";

import { signIn, getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("github", { callbackUrl });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Trainer Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Manage your training business with ease
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="text-sm">
                {error === "OAuthSignin" && "Error occurred during sign in"}
                {error === "OAuthCallback" &&
                  "Error occurred during authentication"}
                {error === "OAuthCreateAccount" && "Could not create account"}
                {error === "EmailCreateAccount" && "Could not create account"}
                {error === "Callback" && "Authentication error"}
                {error === "OAuthAccountNotLinked" &&
                  "Account already exists with different provider"}
                {error === "EmailSignin" && "Check your email for sign in link"}
                {error === "CredentialsSignin" && "Invalid credentials"}
                {error === "SessionRequired" && "Please sign in to continue"}
                {![
                  "OAuthSignin",
                  "OAuthCallback",
                  "OAuthCreateAccount",
                  "EmailCreateAccount",
                  "Callback",
                  "OAuthAccountNotLinked",
                  "EmailSignin",
                  "CredentialsSignin",
                  "SessionRequired",
                ].includes(error) && "An error occurred during authentication"}
              </p>
            </div>
          )}

          <div>
            <button
              onClick={handleGitHubSignIn}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FaGithub className="h-5 w-5 text-gray-300 group-hover:text-gray-200" />
              </span>
              {isLoading ? "Signing in..." : "Sign in with GitHub"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our terms of service and privacy
              policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
