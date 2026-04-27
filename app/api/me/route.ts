import { NextResponse } from "next/server";
import { buildSellerSessionPayload } from "@/lib/server/seller-data";
import { getCurrentUserSession } from "@/lib/server/user-auth";

export async function GET() {
  const session = await getCurrentUserSession();
  if (!session) {
    return NextResponse.json({
      authenticated: false,
      user: null,
      products: [],
      analytics: { views: 0, whatsappClicks: 0, productViews: 0 }
    });
  }

  const payload = await buildSellerSessionPayload(session.user.id);
  return NextResponse.json(payload);
}
