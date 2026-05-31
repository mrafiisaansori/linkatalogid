/**
 * Verifikasi token Google reCAPTCHA v2 di sisi server.
 *
 * Env var (set di Vercel → Settings → Environment Variables):
 *   RECAPTCHA_SECRET_KEY = secret key dari Google reCAPTCHA admin console
 *
 * Jika secret key tidak di-set, verifikasi dilewati (return ok) supaya
 * pengembangan lokal tanpa konfigurasi tetap bisa jalan.
 */

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

interface VerifyResult {
  ok: boolean;
  message?: string;
}

interface GoogleVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
}

export async function verifyRecaptcha(token: unknown): Promise<VerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  // Tanpa secret key, lewati verifikasi (mis. environment lokal).
  if (!secret) {
    return { ok: true };
  }

  if (typeof token !== "string" || token.trim().length === 0) {
    return { ok: false, message: "Silakan selesaikan verifikasi reCAPTCHA dulu." };
  }

  try {
    const params = new URLSearchParams({ secret, response: token });
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      cache: "no-store"
    });

    const data = (await response.json()) as GoogleVerifyResponse;
    if (!data.success) {
      return { ok: false, message: "Verifikasi reCAPTCHA gagal. Coba lagi." };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: "Tidak dapat memverifikasi reCAPTCHA. Coba lagi." };
  }
}
