import { NextResponse } from "next/server";
import { USER_SESSION_COOKIE, createSessionToken, getUserSessionCookieOptions } from "@/lib/auth/session";
import { backendFetch } from "@/lib/server/backend-client";

interface SellerPayload {
  user: { id: string; username: string };
  products: unknown[];
  analytics: unknown;
}

interface SignInResponse {
  success: boolean;
  message?: string;
  user?: SellerPayload;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; code?: string; password?: string }
    | null;

  const email = body?.email;
  const code = body?.code;
  const password = body?.password;

  // 1) Verifikasi kode OTP ke backend.
  const result = await backendFetch<{ success?: boolean; message?: string }>("/auth/verify-email", {
    method: "POST",
    body: { email, code }
  });

  if (!result.ok || !result.data?.success) {
    const payload = (result.data as unknown as Record<string, unknown>) ?? {};
    return NextResponse.json(
      { success: false, message: (payload.message as string) || "Kode verifikasi belum cocok." },
      { status: result.status || 400 }
    );
  }

  // 2) OTP valid. Bila password tersedia, langsung buatkan sesi tanpa Turnstile —
  //    kepemilikan email sudah terbukti lewat OTP, jadi tidak perlu verifikasi bot lagi.
  if (email && password) {
    const signIn = await backendFetch<SignInResponse>("/auth/sign-in", {
      method: "POST",
      body: { email, password }
    });

    if (signIn.ok && signIn.data?.success && signIn.data.user?.user) {
      const payload = signIn.data.user;
      const token = await createSessionToken({
        sub: payload.user.id,
        scope: "user",
        username: payload.user.username,
        expiresIn: "30d"
      });

      const response = NextResponse.json({
        success: true,
        message: result.data.message ?? "Verifikasi email berhasil.",
        data: { ...payload, demoMode: false }
      });
      response.cookies.set(USER_SESSION_COOKIE, token, getUserSessionCookieOptions());
      return response;
    }
  }

  // 3) Tidak ada password atau auto sign-in gagal → kembalikan sukses verifikasi saja.
  return NextResponse.json(
    { success: true, message: result.data.message ?? "Verifikasi email berhasil." },
    { status: 200 }
  );
}
