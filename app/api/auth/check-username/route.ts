import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username") ?? "";
  const result = await backendFetch("/auth/check-username", { query: { username } });
  return NextResponse.json(result.data, { status: result.status || 200 });
}
