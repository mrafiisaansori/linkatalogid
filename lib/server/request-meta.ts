import { createHash } from "node:crypto";

export function hashSensitiveValue(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

export function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function getRequestMetadata(request: Request) {
  const ip = getRequestIp(request);
  const referrer = request.headers.get("referer");
  const userAgent = request.headers.get("user-agent");

  return {
    ipHash: ip === "unknown" ? null : hashSensitiveValue(ip),
    referrer: referrer ? referrer.slice(0, 512) : null,
    userAgent: userAgent ? userAgent.slice(0, 512) : null
  };
}
