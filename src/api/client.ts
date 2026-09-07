import { tokenStore } from "../auth/tokens";
import type { ApiResponse } from "./types";
const origin = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
export const mocksEnabled = process.env.EXPO_PUBLIC_ENABLE_MOCKS === "true";
if (!origin && !mocksEnabled) console.warn("EXPO_PUBLIC_API_URL is required when mocks are disabled.");
export class ApiError extends Error { constructor(public code: string, message: string, public status: number, public fieldErrors?: { field: string; message: string }[]) { super(message); this.name = "ApiError"; } }
type Options = { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown; headers?: Record<string, string>; signal?: AbortSignal; authenticated?: boolean };
export async function request<T>(path: string, options: Options = {}): Promise<T> {
  if (!origin) throw new ApiError("API_NOT_CONFIGURED", "Set EXPO_PUBLIC_API_URL or explicitly enable mocks.", 0);
  const tokens = options.authenticated ? await tokenStore.get() : null;
  const response = await fetch(`${origin}/api/v1${path}`, { method: options.method ?? "GET", body: options.body === undefined ? undefined : JSON.stringify(options.body), signal: options.signal, headers: { "Content-Type": "application/json", ...(tokens ? { Authorization: `Bearer ${tokens.accessToken}` } : {}), ...options.headers } });
  let payload: ApiResponse<T> | undefined; try { payload = await response.json() as ApiResponse<T>; } catch {}
  if (!response.ok || payload?.error) { const error = payload?.error; throw new ApiError(error?.code ?? "HTTP_ERROR", error?.message ?? `Request failed (${response.status})`, response.status, error?.fieldErrors); }
  if (!payload) throw new ApiError("INVALID_RESPONSE", "The server returned an invalid response.", response.status);
  return payload.data;
}
