const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * API Client helper for communicating with the Express Backend.
 * Automatically attaches Authorization header from HttpOnly token cookie on server-side requests.
 */
export async function apiClient(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  let headersInit: Record<string, string> = {};

  if (options?.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headersInit[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headersInit[key] = value;
      });
    } else {
      headersInit = { ...options.headers };
    }
  }

  // On Next.js server side, attempt to attach Bearer token from cookies if not already provided
  if (typeof window === "undefined" && !headersInit["Authorization"] && !headersInit["authorization"]) {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
      if (token) {
        headersInit["Authorization"] = `Bearer ${token}`;
      }
    } catch {
      // Ignore if called outside request context
    }
  }

  return fetch(`${API_URL}${formattedEndpoint}`, {
    ...options,
    headers: headersInit,
  });
}
