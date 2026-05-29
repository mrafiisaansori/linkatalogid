/**
 * Rate limit stub. Bisa di-implement di backend PHP atau pakai Vercel
 * middleware kalau dibutuhkan.
 */
export async function getAdminLoginRateLimitState(_identifier: string) {
  return { key: "", blockedUntil: null as Date | null, attempts: 0, windowStart: new Date() };
}

export async function registerAdminLoginFailure(_identifier: string) {
  return { nextAttempts: 0, blockedUntil: null as Date | null };
}

export async function clearAdminLoginRateLimit(_identifier: string): Promise<void> {
  // no-op
}
