import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  getAdminSessionCookieOptions
} from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { createAuditLog } from "@/lib/server/audit";
import {
  clearAdminLoginRateLimit,
  getAdminLoginRateLimitState,
  registerAdminLoginFailure
} from "@/lib/server/admin-rate-limit";
import { getRequestIp, getRequestMetadata } from "@/lib/server/request-meta";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = body?.username?.toString()?.trim().toLowerCase() ?? "";
  const password = body?.password?.toString() ?? "";
  const ip = getRequestIp(request);
  const identifier = `${ip}:${username || "unknown"}`;

  if (!username || !password.trim()) {
    return NextResponse.json(
      { success: false, message: "Username dan password wajib diisi." },
      { status: 400 }
    );
  }

  const rateLimit = await getAdminLoginRateLimitState(identifier);
  if (rateLimit.blockedUntil && rateLimit.blockedUntil > new Date()) {
    return NextResponse.json(
      { success: false, message: "Terlalu banyak percobaan login. Coba lagi beberapa menit lagi." },
      { status: 429 }
    );
  }

  const admin = await prisma.adminUser.findUnique({
    where: { username }
  });

  if (!admin || !admin.isActive) {
    await registerAdminLoginFailure(identifier);
    return NextResponse.json(
      { success: false, message: "Username atau password admin belum cocok." },
      { status: 401 }
    );
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatches) {
    await registerAdminLoginFailure(identifier);
    return NextResponse.json(
      { success: false, message: "Username atau password admin belum cocok." },
      { status: 401 }
    );
  }

  await clearAdminLoginRateLimit(identifier);

  const token = await createSessionToken({
    sub: admin.id,
    scope: "admin",
    username: admin.username,
    role: admin.role,
    expiresIn: "12h"
  });

  const metadata = getRequestMetadata(request);
  await createAuditLog({
    adminUserId: admin.id,
    action: "login_admin",
    targetType: "admin_user",
    targetId: admin.id,
    metadata: {
      username: admin.username,
      referrer: metadata.referrer,
      userAgent: metadata.userAgent,
      ipHash: metadata.ipHash
    }
  });

  const response = NextResponse.json({
    success: true
  });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, getAdminSessionCookieOptions());
  return response;
}
