import { AnalyticsEventType } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function getUserAnalyticsSummary(userId: string) {
  const [views, whatsappClicks, productViews] = await Promise.all([
    prisma.analyticsEvent.count({
      where: {
        ownerUserId: userId,
        eventType: AnalyticsEventType.PAGE_VIEW
      }
    }),
    prisma.analyticsEvent.count({
      where: {
        ownerUserId: userId,
        eventType: AnalyticsEventType.WHATSAPP_CLICK
      }
    }),
    prisma.analyticsEvent.count({
      where: {
        ownerUserId: userId,
        eventType: AnalyticsEventType.PRODUCT_VIEW
      }
    })
  ]);

  return { views, whatsappClicks, productViews };
}
