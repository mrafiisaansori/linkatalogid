import { NextResponse } from "next/server";
import { USER_SESSION_COOKIE, createSessionToken, getUserSessionCookieOptions } from "@/lib/auth/session";
import { backendFetch } from "@/lib/server/backend-client";

interface SignInResponse {
  success: boolean;
  message?: string;
  requiresVerification?: boolean;
  email?: string;
  user?: {
    user: { id: string; username: string };
    products: unknown[];
    analytics: unknown;
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = await backendFetch<SignInResponse>("/auth/sign-in", { method: "POST", body });

  if (result.data?.requiresVerification) {
    return NextResponse.json(
      {
        success: false,
        requiresVerification: true,
        email: result.data.email ?? (body as { email?: string } | null)?.email ?? "",
        message: result.data.message ?? "Email belum diverifikasi."
      },
      { status: result.status || 403 }
    );
  }

  if (!result.ok || !result.data?.success || !result.data.user?.user) {
    const payload = (result.data as unknown as Record<string, unknown>) ?? {};
    return NextResponse.json(
      { success: false, message: (payload.message as string) || "Email atau password belum cocok." },
      { status: result.status || 401 }
    );
  }

  const payload = result.data.user;
  const token = await createSessionToken({
    sub: payload.user.id,
    scope: "user",
    username: payload.user.username,
    expiresIn: "30d"
  });

  const response = NextResponse.json({
    success: true,
    message: result.data.message ?? "Berhasil masuk.",
    data: { ...payload, demoMode: false }
  });
  response.cookies.set(USER_SESSION_COOKIE, token, getUserSessionCookieOptions());
  return response;
}
