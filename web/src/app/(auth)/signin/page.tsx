"use client";

import { useSearchParams } from "next/navigation";
import { useSignIn } from "@/lib/hooks/useSignIn";
import { authProviders } from "@/lib/auth/providers";
import { ProviderButton } from "@/components/ui/provider-button";
import { AuthError } from "@/components/ui/auth-error";
import Image from "next/image";
import { Dumbbell } from "lucide-react";
import { LoginForm } from "@/components/forms/login-form";

export default function SignInPage() {
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
        <LoginForm />
      </div>
    </div>
  );
}
