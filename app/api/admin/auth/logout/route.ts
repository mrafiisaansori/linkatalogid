import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getExpiredCookieOptions } from "@/lib/auth/session";
import { createAuditLog } from "@/lib/server/audit";
import { getAdminClaimsFromRequest } from "@/lib/server/admin-auth";

export async function POST(request: Request) {
  const claims = await getAdminClaimsFromRequest(request);
  if (claims) {
    await createAuditLog({
      adminUserId: claims.sub,
      action: "logout_admin",
      targetType: "admin_user",
      targetId: claims.sub,
      metadata: {
        username: claims.username
      }
    });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", getExpiredCookieOptions());
  return response;
}
