import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { getRequestMetadata } from "@/lib/server/request-meta";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const metadata = getRequestMetadata(request);
  const payload = { ...body, ...metadata };
  const result = await backendFetch("/analytics/track", { method: "POST", body: payload });
  return NextResponse.json(result.data ?? { success: true }, { status: result.status || 200 });
}
