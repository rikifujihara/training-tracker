import { NextResponse } from "next/server";

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    timestamp: string;
    [key: string]: any;
  };
}

/**
 * Create consistent success responses for TanStack Query
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  options?: {
    meta?: Record<string, any>;
    headers?: Record<string, string>;
  }
): NextResponse<ApiSuccessResponse<T>> {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
    meta: {
      timestamp: new Date().toISOString(),
      ...options?.meta,
    },
  };

  return NextResponse.json(response, {
    headers: options?.headers,
  });
}

/**
 * Create responses with cache headers for TanStack Query
 */
export function createCachedResponse<T>(
  data: T,
  cacheSeconds: number = 300, // 5 minutes default
  staleWhileRevalidateSeconds: number = 60,
  options?: {
    message?: string;
    meta?: Record<string, any>;
  }
): NextResponse<ApiSuccessResponse<T>> {
  return createSuccessResponse(data, options?.message, {
    meta: { cached: true, ...options?.meta },
    headers: {
      "Cache-Control": `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${staleWhileRevalidateSeconds}`,
    },
  });
}
