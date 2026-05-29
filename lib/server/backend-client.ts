/**
 * HTTP client untuk PHP REST backend.
 *
 * Backend di-host terpisah di https://linkatalog.raftechsolution.web.id.
 * Semua endpoint butuh Basic Auth (admin:<password>) yang di-set lewat env var.
 *
 * Env vars (set di Vercel → Settings → Environment Variables):
 *   BACKEND_URL          = "https://linkatalog.raftechsolution.web.id"
 *   BACKEND_AUTH_USER    = "admin"
 *   BACKEND_AUTH_PASS    = "Indones!4"
 */

const FALLBACK_BACKEND_URL = "https://linkatalog.raftechsolution.web.id";
const FALLBACK_AUTH_USER = "admin";
const FALLBACK_AUTH_PASS = "Indones!4";

function backendUrl(): string {
  return (process.env.BACKEND_URL || FALLBACK_BACKEND_URL).replace(/\/+$/, "");
}

function basicAuthHeader(): string {
  const user = process.env.BACKEND_AUTH_USER || FALLBACK_AUTH_USER;
  const pass = process.env.BACKEND_AUTH_PASS || FALLBACK_AUTH_PASS;
  const encoded = Buffer.from(`${user}:${pass}`).toString("base64");
  return `Basic ${encoded}`;
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface BackendOptions {
  method?: Method;
  query?: Record<string, string | number | undefined | null>;
  body?: unknown;
  /** Tambahan cache hint untuk Next.js fetch. */
  cache?: RequestCache;
  revalidate?: number;
}

export interface BackendResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T;
}

function buildUrl(path: string, query?: BackendOptions["query"]): string {
  const base = backendUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${cleanPath}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function backendFetch<T = unknown>(
  path: string,
  options: BackendOptions = {}
): Promise<BackendResult<T>> {
  const url = buildUrl(path, options.query);
  const method = options.method ?? "GET";

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: basicAuthHeader()
  };

  let body: BodyInit | undefined;
  if (options.body !== undefined && options.body !== null) {
    body = JSON.stringify(options.body);
    headers["Content-Type"] = "application/json";
  }

  const init: RequestInit & { next?: { revalidate?: number } } = {
    method,
    headers,
    body,
    cache: options.cache ?? "no-store"
  };
  if (typeof options.revalidate === "number") {
    init.next = { revalidate: options.revalidate };
    delete init.cache;
  }

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: {
        success: false,
        message: "Tidak bisa connect ke backend.",
        detail: error instanceof Error ? error.message : String(error)
      } as T
    };
  }

  const text = await response.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = { success: false, message: "Backend mengembalikan response yang bukan JSON.", raw: text.slice(0, 500) };
  }

  return {
    ok: response.ok,
    status: response.status,
    data: parsed as T
  };
}

export function isBackendOk(result: BackendResult<unknown>): boolean {
  if (!result.ok) return false;
  const payload = result.data as Record<string, unknown> | null;
  if (payload && typeof payload === "object" && "success" in payload) {
    return Boolean((payload as { success?: boolean }).success);
  }
  return true;
}
