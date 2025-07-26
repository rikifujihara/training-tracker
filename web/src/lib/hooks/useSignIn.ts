import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

export type SignInProvider = "github" | "google";

interface SignInRequest {
  provider: SignInProvider;
  callbackUrl: string;
}

const signInWithProvider = async ({ provider, callbackUrl }: SignInRequest) => {
  const result = await signIn(provider, { callbackUrl, redirect: false });
  if (result?.error) {
    throw new Error(result.error);
  }
  return result;
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: signInWithProvider,
    onError: (error) => {
      console.error("Sign in error:", error);
    },
  });
};