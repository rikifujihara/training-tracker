"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useSignIn } from "@/lib/hooks/useSignIn";
import { useSearchParams } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const signInMutation = useSignIn();

  const handleProviderSignIn = (providerId: string) => {
    signInMutation.mutate({
      provider: providerId as "github" | "google",
      callbackUrl,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Sign in to your account to continue
        </p>
      </div>
      <div className="grid gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleProviderSignIn("google")}
        >
          <FaGoogle className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleProviderSignIn("github")}
        >
          <FaGithub className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>
      </div>
    </div>
  );
}
