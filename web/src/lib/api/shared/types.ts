// Common API response types
export interface ApiError {
  error: string;
  details?: unknown;
}

export interface ApiSuccess<T = unknown> {
  data: T;
  message?: string;
}

// Type guards
export const isApiError = (response: unknown): response is ApiError => {
  return typeof response === "object" && response !== null && "error" in response;
};

// Common HTTP status codes
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;