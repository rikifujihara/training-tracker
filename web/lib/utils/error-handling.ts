import { NextResponse } from "next/server";

/**
 * Error handling utilities for consistent error logging and responses
 */

/**
 * Logs an error with context information
 */
export function logError(context: string, error: unknown): void {
  console.error(`${context}:`, error);
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Handles API errors with consistent logging and response format
 */
export function handleApiError(error: unknown, context: string): NextResponse {
  logError(context, error);

  // Handle specific error types
  if (error instanceof Error) {
    if (error.message.includes("not found")) {
      return createErrorResponse(error.message, 404);
    }
    if (error.message.includes("unauthorized") || error.message.includes("Unauthorized")) {
      return createErrorResponse("Unauthorized", 401);
    }
    if (error.message.includes("validation") || error.message.includes("required")) {
      return createErrorResponse(error.message, 400);
    }
  }

  // Default server error
  return createErrorResponse(`Failed to ${context.toLowerCase()}`, 500);
}

/**
 * Creates an unauthorized response
 */
export function createUnauthorizedResponse(): NextResponse {
  return createErrorResponse("Unauthorized", 401);
}

/**
 * Creates a not found response
 */
export function createNotFoundResponse(resource: string): NextResponse {
  return createErrorResponse(`${resource} not found`, 404);
}

/**
 * Creates a bad request response
 */
export function createBadRequestResponse(message: string): NextResponse {
  return createErrorResponse(message, 400);
}