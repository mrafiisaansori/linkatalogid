import { cookies } from "next/headers";
import {
  USER_SESSION_COOKIE,
  getExpiredCookieOptions,
  verifySessionToken
} from "@/lib/auth/session";
import { backendFetch } from "@/lib/server/backend-client";
import { SellerSessionPayload } from "@/lib/types";

export async function getCurrentUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value;
  if (!token) return null;

  const claims = await verifySessionToken(token, "user");
  if (!claims) return null;

  const result = await backendFetch<SellerSessionPayload>("/me", { query: { userId: claims.sub } });
  if (!result.ok || !result.data?.authenticated || !result.data.user) {
    cookieStore.set(USER_SESSION_COOKIE, "", getExpiredCookieOptions());
    return null;
  }

  return {
    user: result.data.user,
    products: result.data.products,
    analytics: result.data.analytics,
    claims
  };
}

export async function getUserClaimsFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const token = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${USER_SESSION_COOKIE}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  if (!token) return null;
  return verifySessionToken(token, "user");
}
