import { AnalyticsEventType } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRequestMetadata } from "@/lib/server/request-meta";

const allowedEvents = new Set<AnalyticsEventType>([
  AnalyticsEventType.PAGE_VIEW,
  AnalyticsEventType.PRODUCT_VIEW,
  AnalyticsEventType.WHATSAPP_CLICK
]);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const eventType = body?.eventType?.toString()?.toUpperCase() as AnalyticsEventType | undefined;
  const ownerUserId = body?.ownerUserId?.toString() ?? "";
  const productId = body?.productId?.toString() ?? null;
  const path = body?.path?.toString() ?? "/";

  if (!eventType || !allowedEvents.has(eventType) || !ownerUserId) {
    return NextResponse.json({ success: false, message: "Event analytics tidak valid." }, { status: 400 });
  }

  const owner = await prisma.user.findUnique({
    where: { id: ownerUserId },
    select: { id: true, isActive: true }
  });

  if (!owner || !owner.isActive) {
    return NextResponse.json({ success: false, message: "Owner katalog tidak ditemukan." }, { status: 404 });
  }

  if (productId) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        userId: ownerUserId
      },
      select: { id: true }
    });

    if (!product) {
      return NextResponse.json({ success: false, message: "Produk tidak valid." }, { status: 404 });
    }
  }

  const metadata = getRequestMetadata(request);
  await prisma.analyticsEvent.create({
    data: {
      eventType,
      ownerUserId,
      productId,
      path: path.slice(0, 512),
      referrer: metadata.referrer,
      userAgent: metadata.userAgent,
      ipHash: metadata.ipHash
    }
  });

  return NextResponse.json({ success: true });
}
