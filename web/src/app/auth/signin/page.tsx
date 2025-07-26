"use client";

import { useSearchParams } from "next/navigation";
import { useSignIn } from "@/lib/hooks/useSignIn";
import { authProviders } from "@/lib/auth/providers";
import { ProviderButton } from "@/components/ui/ProviderButton";
import { AuthError } from "@/components/ui/AuthError";
import Image from "next/image";
import { Dumbbell } from "lucide-react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  const signInMutation = useSignIn();

  const handleProviderSignIn = (providerId: string) => {
    signInMutation.mutate({
      provider: providerId as "github" | "google",
      callbackUrl,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/login-hero.avif"
          alt="Fitness training"
          width={800}
          height={1080}
          className="object-cover w-full h-full"
          priority
        />
        {/* Transparent black overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Overlay with content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-12">
          <div className="text-center text-white">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <Dumbbell size={40} color="white" />
            </div>

            <h2 className="text-4xl font-bold mb-6">FitTrack</h2>
            <p className="text-lg text-gray-200 leading-relaxed max-w-md">
              Track your fitness journey, set goals, and achieve results with
              our comprehensive fitness tracking platform.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Sign in form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L5.57 7l8.57 8.57L12 17.71 13.43 19.14 14.86 17.71 16.29 19.14 17.71 17.71 16.29 16.29 19.14 13.43 17.71 12z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">FitTrack</h1>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">
              Sign in to continue your fitness journey
            </p>
          </div>

          <div className="space-y-6">
            {error && <AuthError error={error} />}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Sign in with
                </span>
              </div>
            </div>

            {/* OAuth buttons */}
            <div className="space-y-4">
              {authProviders.map((provider) => (
                <ProviderButton
                  key={provider.id}
                  onClick={() => handleProviderSignIn(provider.id)}
                  disabled={signInMutation.isPending}
                  icon={provider.icon}
                  variant={provider.variant}
                >
                  {signInMutation.isPending
                    ? "Signing in..."
                    : `Sign in with ${provider.name}`}
                </ProviderButton>
              ))}
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
    </div>
  );
}
