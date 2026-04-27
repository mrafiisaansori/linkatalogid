import type { JWTPayload } from "jose";
import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

export const ADMIN_SESSION_COOKIE = "linkatalog_admin_session";
export const USER_SESSION_COOKIE = "linkatalog_user_session";
export const THEME_STORAGE_KEY = "linkatalog_theme";

type SessionScope = "admin" | "user";

export interface LinkatalogSessionClaims extends JWTPayload {
  sub: string;
  scope: SessionScope;
  username: string;
  role?: string;
}

function resolveSessionSecret() {
  const secret = process.env.LINKATALOG_SESSION_SECRET?.trim();
  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV !== "production") {
    return "linkatalog-local-session-secret-2026-04-27-change-before-production";
  }

  throw new Error("LINKATALOG_SESSION_SECRET is required in production.");
}

const sessionSecret = new TextEncoder().encode(resolveSessionSecret());

export async function createSessionToken({
  sub,
  scope,
  username,
  role,
  expiresIn
}: {
  sub: string;
  scope: SessionScope;
  username: string;
  role?: string;
  expiresIn: string;
}) {
  return new SignJWT({ scope, username, role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(sessionSecret);
}

export async function verifySessionToken(token: string, scope: SessionScope) {
  try {
    const verified = await jwtVerify(token, sessionSecret, {
      algorithms: ["HS256"]
    });

    const payload = verified.payload as LinkatalogSessionClaims;
    if (payload.scope !== scope || typeof payload.sub !== "string" || typeof payload.username !== "string") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function cookieBase(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge
  };
}

export function getUserSessionCookieOptions() {
  return cookieBase(60 * 60 * 24 * 30);
}

export function getAdminSessionCookieOptions() {
  return cookieBase(60 * 60 * 12);
}

export function getExpiredCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0
  };
}
