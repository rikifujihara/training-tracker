"use client";

import { useSearchParams } from "next/navigation";
import { useSignIn } from "@/lib/hooks/useSignIn";
import { authProviders } from "@/lib/auth/providers";
import { ProviderButton } from "@/components/ui/ProviderButton";
import { AuthError } from "@/components/ui/AuthError";

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
          {error && <AuthError error={error} />}

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
  );
}
