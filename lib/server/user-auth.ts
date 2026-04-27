import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import {
  USER_SESSION_COOKIE,
  getExpiredCookieOptions,
  verifySessionToken
} from "@/lib/auth/session";

export async function getCurrentUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value;
  if (!token) return null;

  const claims = await verifySessionToken(token, "user");
  if (!claims) return null;

  const user = await prisma.user.findUnique({
    where: { id: claims.sub },
    include: {
      account: {
        select: {
          email: true
        }
      }
    }
  });

  if (!user || !user.isActive) {
    cookieStore.set(USER_SESSION_COOKIE, "", getExpiredCookieOptions());
    return null;
  }

  return {
    user,
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
