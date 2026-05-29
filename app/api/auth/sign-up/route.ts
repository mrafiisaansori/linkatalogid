import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";

interface SignUpResponse {
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
  const result = await backendFetch<SignUpResponse>("/auth/sign-up", { method: "POST", body });

  if (result.data?.requiresVerification) {
    return NextResponse.json(
      {
        success: false,
        requiresVerification: true,
        email: result.data.email ?? (body as { email?: string } | null)?.email ?? "",
        message: result.data.message ?? "Kode verifikasi sudah dikirim ke email kamu."
      },
      { status: result.status || 202 }
    );
  }

  if (!result.ok || !result.data?.success || !result.data.user?.user) {
    const payload = (result.data as unknown as Record<string, unknown>) ?? {};
    return NextResponse.json(
      { success: false, message: (payload.message as string) || "Gagal membuat akun." },
      { status: result.status || 400 }
    );
  }

  const response = NextResponse.json({
    success: true,
    message: result.data.message ?? "Akun berhasil dibuat.",
    data: { ...result.data.user, demoMode: false }
  });
  return response;
}
