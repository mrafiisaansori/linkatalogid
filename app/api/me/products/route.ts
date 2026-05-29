import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { getUserClaimsFromRequest } from "@/lib/server/user-auth";

export async function GET(request: Request) {
  const claims = await getUserClaimsFromRequest(request);
  if (!claims) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const result = await backendFetch(`/me/${encodeURIComponent(claims.sub)}/products`);
  return NextResponse.json(result.data, { status: result.status || 200 });
}

export async function POST(request: Request) {
  const claims = await getUserClaimsFromRequest(request);
  if (!claims) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const result = await backendFetch(`/me/${encodeURIComponent(claims.sub)}/products`, { method: "POST", body });
  return NextResponse.json(result.data, { status: result.status || 200 });
}
