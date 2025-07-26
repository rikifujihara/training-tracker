export type AuthError = 
  | "OAuthSignin"
  | "OAuthCallback" 
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignin"
  | "SessionRequired";

export const getAuthErrorMessage = (error: string): string => {
  const errorMessages: Record<AuthError, string> = {
    OAuthSignin: "Error occurred during sign in",
    OAuthCallback: "Error occurred during authentication",
    OAuthCreateAccount: "Could not create account",
    EmailCreateAccount: "Could not create account",
    Callback: "Authentication error",
    OAuthAccountNotLinked: "Account already exists with different provider",
    EmailSignin: "Check your email for sign in link",
    CredentialsSignin: "Invalid credentials",
    SessionRequired: "Please sign in to continue",
  };

  return errorMessages[error as AuthError] || "An error occurred during authentication";
};