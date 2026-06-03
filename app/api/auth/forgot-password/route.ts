import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { isTurnstileRequiredForHost } from "@/lib/turnstile-env";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; turnstileToken?: unknown }
    | null;
  const email = body?.email?.trim();

  // Turnstile hanya diverifikasi di host production; di lokal dilewati.
  if (isTurnstileRequiredForHost(request.headers.get("host"))) {
    const turnstile = await verifyTurnstile(body?.turnstileToken);
    if (!turnstile.ok) {
      return NextResponse.json({ success: false, message: turnstile.message }, { status: 400 });
    }
  }

  if (!email) {
    return NextResponse.json({ success: false, message: "Email wajib diisi." }, { status: 400 });
  }

  const result = await backendFetch<{ success?: boolean; message?: string }>("/auth/forgot-password", {
    method: "POST",
    body: { email }
  });

  // Untuk mencegah kebocoran info akun, jangan bedakan email terdaftar / tidak.
  // Selama backend tidak error keras, balas sukses generik.
  if (result.status === 0) {
    return NextResponse.json(
      { success: false, message: "Tidak bisa connect ke server. Coba lagi sebentar." },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message:
        result.data?.message ??
        "Kalau email terdaftar, kode reset password sudah kami kirim. Cek inbox kamu."
    },
    { status: 200 }
  );
}
