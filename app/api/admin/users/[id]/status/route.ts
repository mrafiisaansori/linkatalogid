import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { getAdminClaimsFromRequest } from "@/lib/server/admin-auth";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const claims = await getAdminClaimsFromRequest(request);
  if (!claims) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const result = await backendFetch(`/admin/users/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: {
      ...body,
      adminUserId: claims.sub,
      adminUsername: claims.username
    }
  });
  return NextResponse.json(result.data, { status: result.status || 200 });
}

export const PUT = PATCH;
