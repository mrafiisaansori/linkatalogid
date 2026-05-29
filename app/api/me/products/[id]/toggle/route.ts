import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { getUserClaimsFromRequest } from "@/lib/server/user-auth";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const claims = await getUserClaimsFromRequest(request);
  if (!claims) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const result = await backendFetch(
    `/me/${encodeURIComponent(claims.sub)}/products/${encodeURIComponent(id)}/toggle`,
    { method: "POST" }
  );
  return NextResponse.json(result.data, { status: result.status || 200 });
}

export const PATCH = POST;
