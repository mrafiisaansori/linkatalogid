import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = await backendFetch("/auth/resend-verification", { method: "POST", body });
  return NextResponse.json(result.data, { status: result.status || 200 });
}
