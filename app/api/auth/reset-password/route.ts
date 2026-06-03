import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { isTurnstileRequiredForHost } from "@/lib/turnstile-env";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; code?: string; password?: string; turnstileToken?: unknown }
    | null;

  // Turnstile hanya diverifikasi di host production; di lokal dilewati.
  if (isTurnstileRequiredForHost(request.headers.get("host"))) {
    const turnstile = await verifyTurnstile(body?.turnstileToken);
    if (!turnstile.ok) {
      return NextResponse.json({ success: false, message: turnstile.message }, { status: 400 });
    }
  }

  const email = body?.email?.trim();
  const code = body?.code?.trim();
  const password = body?.password;

  if (!email || !code || !password) {
    return NextResponse.json(
      { success: false, message: "Email, kode, dan password baru wajib diisi." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { success: false, message: "Password baru minimal 8 karakter." },
      { status: 400 }
    );
  }

  const result = await backendFetch<{ success?: boolean; message?: string }>("/auth/reset-password", {
    method: "POST",
    body: { email, code, password }
  });

  if (!result.ok || !result.data?.success) {
    const payload = (result.data as unknown as Record<string, unknown>) ?? {};
    return NextResponse.json(
      { success: false, message: (payload.message as string) || "Kode reset belum cocok atau sudah kedaluwarsa." },
      { status: result.status || 400 }
    );
  }

  return NextResponse.json(
    { success: true, message: result.data.message ?? "Password berhasil diubah." },
    { status: 200 }
  );
}
