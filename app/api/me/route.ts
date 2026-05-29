import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { getUserClaimsFromRequest } from "@/lib/server/user-auth";

export async function GET(request: Request) {
  const claims = await getUserClaimsFromRequest(request);
  if (!claims) {
    return NextResponse.json(
      { authenticated: false, user: null, products: [], analytics: { views: 0, whatsappClicks: 0, productViews: 0 } },
      { status: 200 }
    );
  }
  const result = await backendFetch("/me", { query: { userId: claims.sub } });
  return NextResponse.json(result.data, { status: result.status || 200 });
}
