const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const DEFAULT_TIMEOUT_MS = 5000;
import { useAuthStore } from "@/store/auth";

type ApiOptions = RequestInit & { token?: string; timeoutMs?: number };

async function refreshAccessToken() {
  if (typeof window === "undefined") return null;

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  let json: { success?: boolean; data?: { accessToken: string; refreshToken: string }; error?: string } | null = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok || !json?.success || !json.data) return null;

  useAuthStore.getState().setTokens(json.data.accessToken, json.data.refreshToken);
  return json.data.accessToken;
}

export async function api<T>(
  path: string,
  options?: ApiOptions
): Promise<T> {
  return apiRequest<T>(path, options, false);
}

async function apiRequest<T>(path: string, options: ApiOptions | undefined, retried: boolean): Promise<T> {
  const { token, timeoutMs = DEFAULT_TIMEOUT_MS, ...init } = options || {};
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
      signal: controller.signal,
    });

    let json: { success?: boolean; data?: T; error?: string };
    try {
      json = await res.json();
    } catch {
      json = {};
    }

    if (res.status === 401 && !retried && path !== "/auth/refresh") {
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken) {
        return apiRequest<T>(path, { ...options, token: refreshedToken }, true);
      }
    }

    if (res.status === 429) {
      throw new Error(json.error || "Too many requests. Please wait a moment and try again.");
    }

    if (!res.ok || !json.success) {
      throw new Error(json.error || "Request failed");
    }
    return json.data as T;
  } finally {
    clearTimeout(timer);
  }
}

export function getApiUrl() {
  return API_URL;
}
