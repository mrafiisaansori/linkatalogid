/**
 * Penentuan apakah Cloudflare Turnstile perlu diaktifkan berdasarkan host.
 *
 * Aturan: di lingkungan lokal (localhost / IP LAN privat) Turnstile DILEWATI
 * supaya pengembangan tidak terganggu. Di domain production (mis. linkatalog.id)
 * Turnstile WAJIB.
 *
 * Helper ini tidak boleh mengimpor modul server-only agar bisa dipakai
 * di komponen klien maupun di route handler.
 */

/** True jika host menunjuk ke mesin/lokal jaringan privat. */
export function isLocalHost(host: string | null | undefined): boolean {
  if (!host) return false;

  // Buang port (mis. "localhost:3000") lalu normalisasi.
  const hostname = host.split(":")[0].trim().toLowerCase();
  if (!hostname) return false;

  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname === "::1"
  ) {
    return true;
  }

  if (hostname.endsWith(".local") || hostname.endsWith(".localhost")) {
    return true;
  }

  // Rentang IP privat (RFC 1918): 10.x, 192.168.x, 172.16–31.x
  if (/^10\./.test(hostname)) return true;
  if (/^192\.168\./.test(hostname)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) return true;

  return false;
}

/** True jika Turnstile wajib diverifikasi untuk host ini (yaitu non-lokal). */
export function isTurnstileRequiredForHost(host: string | null | undefined): boolean {
  return !isLocalHost(host);
}
