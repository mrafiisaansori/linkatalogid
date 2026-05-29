import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createSessionToken, getAdminSessionCookieOptions } from "@/lib/auth/session";
import { backendFetch } from "@/lib/server/backend-client";

interface AdminLoginResponse {
  success: boolean;
  message?: string;
  admin?: { id: string; username: string; role: string };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const result = await backendFetch<AdminLoginResponse>("/admin/auth/login", { method: "POST", body });

  if (!result.ok || !result.data?.success || !result.data.admin) {
    const payload = (result.data as unknown as Record<string, unknown>) ?? {};
    return NextResponse.json(
      { success: false, message: (payload.message as string) || "Username atau password admin belum cocok." },
      { status: result.status || 401 }
    );
  }

  const admin = result.data.admin;
  const token = await createSessionToken({
    sub: admin.id,
    scope: "admin",
    username: admin.username,
    role: admin.role,
    expiresIn: "12h"
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, getAdminSessionCookieOptions());
  return response;
}
