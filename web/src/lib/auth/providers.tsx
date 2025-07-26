import { FaGithub, FaGoogle } from "react-icons/fa";
import { SignInProvider } from "@/lib/hooks/useSignIn";

export interface ProviderConfig {
  id: SignInProvider;
  name: string;
  icon: React.ReactNode;
  variant: "google" | "github";
}

export const authProviders: ProviderConfig[] = [
  {
    id: "google",
    name: "Google",
    icon: <FaGoogle />,
    variant: "google",
  },
  {
    id: "github", 
    name: "GitHub",
    icon: <FaGithub />,
    variant: "github",
  },
];