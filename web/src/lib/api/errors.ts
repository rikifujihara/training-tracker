import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthenticationError } from "./auth";

export interface ApiError {
  error: string;
  details?: any;
}

/**
 * Handle API errors consistently across all routes
 */
export function handleApiError(error: unknown): NextResponse<ApiError> {
  console.error("API Error:", error);

  // Authentication errors
  if (error instanceof AuthenticationError) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  // Validation errors (Zod)
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.issues,
      },
      { status: 400 }
    );
  }

  // Business logic errors
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Unexpected errors
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
