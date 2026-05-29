import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { getUserClaimsFromRequest } from "@/lib/server/user-auth";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const claims = await getUserClaimsFromRequest(request);
  if (!claims) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const result = await backendFetch(
    `/me/${encodeURIComponent(claims.sub)}/products/${encodeURIComponent(id)}`,
    { method: "PUT", body }
  );
  return NextResponse.json(result.data, { status: result.status || 200 });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const claims = await getUserClaimsFromRequest(request);
  if (!claims) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const result = await backendFetch(
    `/me/${encodeURIComponent(claims.sub)}/products/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );
  return NextResponse.json(result.data, { status: result.status || 200 });
}

export const PATCH = PUT;
