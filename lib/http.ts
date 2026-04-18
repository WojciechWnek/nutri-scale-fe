const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

let isRefreshing = false;
let refreshSubscribers: ((error: Error | null) => void)[] = [];

function onRefreshed(error: Error | null) {
  refreshSubscribers.forEach((callback) => callback(error));
  refreshSubscribers = [];
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  let response = await fetch(url, {
    ...fetchOptions,
    credentials: "include",
    headers,
  });

  // Handle 401 Unauthorized by attempting to refresh the token
  if (
    response.status === 401 &&
    endpoint !== "/auth/signin" &&
    endpoint !== "/auth/refresh"
  ) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include", // This will send the HttpOnly refresh_token cookie
        });

        if (!refreshResponse.ok) {
          throw new Error("Refresh failed");
        }

        onRefreshed(null);
      } catch (err) {
        onRefreshed(err as Error);
        // Force redirect to login if refresh fails
        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }
        throw new HttpError(401, "Unauthorized", "Session expired");
      } finally {
        isRefreshing = false;
      }
    } else {
      // Wait for the ongoing refresh to finish
      const refreshError = await new Promise<Error | null>((resolve) => {
        refreshSubscribers.push(resolve);
      });

      if (refreshError) {
        throw new HttpError(401, "Unauthorized", "Session expired");
      }
    }

    // Retry the original request after successful token refresh
    response = await fetch(url, {
      ...fetchOptions,
      credentials: "include",
      headers,
    });
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new HttpError(
      response.status,
      response.statusText,
      data?.message || "An error occurred",
      data,
    );
  }

  return data;
}

export async function get<T>(
  endpoint: string,
  options?: RequestOptions,
): Promise<T> {
  return request<T>(endpoint, { ...options, method: "GET" });
}

export async function post<T>(
  endpoint: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  return request<T>(endpoint, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function put<T>(
  endpoint: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  return request<T>(endpoint, {
    ...options,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function patch<T>(
  endpoint: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  return request<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function del<T>(
  endpoint: string,
  options?: RequestOptions,
): Promise<T> {
  return request<T>(endpoint, { ...options, method: "DELETE" });
}

export { HttpError };
