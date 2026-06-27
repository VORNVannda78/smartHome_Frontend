// ─── RoomRentKH — API HTTP Client ─────────────────────────────────────────────
//
// In DEVELOPMENT:  Vite proxies /api → http://localhost:5000/api (see vite.config.ts)
//                  So BASE = "/api" avoids cross-origin issues entirely.
//
// In PRODUCTION:   VITE_API_URL is set in Vercel environment variables,
//                  e.g. https://roomrentkh-api.onrender.com/api
//
// The result: zero CORS issues in local dev, direct URL in production.

const BASE: string =
  (import.meta as Record<string, Record<string, string>>).env?.VITE_API_URL ??
  "/api";

const TOKEN_KEY = "rrk_token";

// ─── Token helpers ────────────────────────────────────────────────────────────
export const getToken   = (): string => localStorage.getItem(TOKEN_KEY) ?? "";
export const setToken   = (t: string): void => { localStorage.setItem(TOKEN_KEY, t); };
export const clearToken = (): void => { localStorage.removeItem(TOKEN_KEY); };

// ─── Normaliser: MongoDB _id → id, flatten populated Mongoose refs ────────────
export function norm<T = Record<string, unknown>>(
  doc: Record<string, unknown>
): T {
  if (!doc || typeof doc !== "object") return doc as unknown as T;
  const out: Record<string, unknown> = { ...doc };

  if ("_id" in out) { out.id = String(out._id); delete out._id; }
  if ("id"  in out && out.id) out.id = String(out.id);

  // Flatten populated reference fields (Mongoose .populate() → extract _id)
  for (const key of ["tenantId", "roomId", "invoiceId", "landlordId"]) {
    if (out[key] && typeof out[key] === "object") {
      const ref = out[key] as Record<string, unknown>;
      out[key] = String(ref._id ?? ref.id ?? "");
    }
  }

  delete out["__v"];
  return out as T;
}

export const normList = <T = Record<string, unknown>>(arr: unknown[]): T[] =>
  Array.isArray(arr)
    ? arr.map((d) => norm<T>(d as Record<string, unknown>))
    : [];

// ─── Core request ─────────────────────────────────────────────────────────────
async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message ?? `HTTP ${res.status}`
    );
  }

  return data as T;
}

// ─── Exported API surface ─────────────────────────────────────────────────────
export const api = {
  get:   <T>(path: string)                 => request<T>("GET",    path),
  post:  <T>(path: string, body: unknown)  => request<T>("POST",   path, body),
  put:   <T>(path: string, body: unknown)  => request<T>("PUT",    path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH",  path, body),
  del:   <T>(path: string)                 => request<T>("DELETE", path),
};
