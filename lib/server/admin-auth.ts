import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  LinkatalogSessionClaims,
  getExpiredCookieOptions,
  verifySessionToken
} from "@/lib/auth/session";
import { backendFetch } from "@/lib/server/backend-client";
import { AdminUser } from "@/lib/types";

export async function getCurrentAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  const claims = await verifySessionToken(token, "admin");
  if (!claims) return null;

  const result = await backendFetch<{ success: boolean; admin: AdminUser }>(`/admin/${encodeURIComponent(claims.sub)}`);
  if (!result.ok || !result.data?.success || !result.data.admin?.isActive) {
    cookieStore.set(ADMIN_SESSION_COOKIE, "", getExpiredCookieOptions());
    return null;
  }

  return {
    admin: result.data.admin,
    claims
  };
}

export async function requireAdminSession() {
  const session = await getCurrentAdminSession();
  if (!session) {
    redirect("/be-admin");
  }
  return session;
}

export async function getAdminClaimsFromRequest(request: Request): Promise<LinkatalogSessionClaims | null> {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const token = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_SESSION_COOKIE}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  if (!token) return null;
  return verifySessionToken(token, "admin");
}
