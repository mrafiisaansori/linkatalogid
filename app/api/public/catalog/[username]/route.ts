import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";

export async function GET(_request: Request, context: { params: Promise<{ username: string }> }) {
  const { username } = await context.params;
  const result = await backendFetch(`/public/catalog/${encodeURIComponent(username)}`);
  return NextResponse.json(result.data, { status: result.status || 200 });
}
