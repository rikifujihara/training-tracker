export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    timestamp: string;
    [key: string]: any;
  };
}

export interface ApiErrorResponse {
  error: string;
  details?: any;
}

export class ApiError extends Error {
  constructor(message: string, public status: number, public details?: any) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Base API client - handles HTTP concerns only
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error: ApiErrorResponse = await response.json();
      throw new ApiError(error.error, response.status, error.details);
    }

    const result: ApiSuccessResponse<T> = await response.json();
    return result.data;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
