/**
 * Verifikasi token Cloudflare Turnstile di sisi server.
 *
 * Env var (set di Vercel → Settings → Environment Variables):
 *   TURNSTILE_SECRET_KEY = secret key dari Cloudflare Turnstile dashboard
 *
 * Jika secret key tidak di-set, verifikasi dilewati (return ok) supaya
 * pengembangan lokal tanpa konfigurasi tetap bisa jalan.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface VerifyResult {
  ok: boolean;
  message?: string;
}

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
}

export async function verifyTurnstile(token: unknown): Promise<VerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Tanpa secret key, lewati verifikasi (mis. environment lokal).
  if (!secret) {
    return { ok: true };
  }

  if (typeof token !== "string" || token.trim().length === 0) {
    return { ok: false, message: "Silakan selesaikan verifikasi keamanan dulu." };
  }

  try {
    const params = new URLSearchParams({ secret, response: token });
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      cache: "no-store"
    });

    const data = (await response.json()) as TurnstileVerifyResponse;
    if (!data.success) {
      return { ok: false, message: "Verifikasi keamanan gagal. Coba lagi." };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: "Tidak dapat memverifikasi keamanan. Coba lagi." };
  }
}
