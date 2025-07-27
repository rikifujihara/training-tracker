import { getAuthErrorMessage } from "@/lib/auth/errors";

interface AuthErrorProps {
  error: string;
}

export function AuthError({ error }: AuthErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      <p className="text-sm">{getAuthErrorMessage(error)}</p>
    </div>
  );
}