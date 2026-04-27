import { AnalyticsEventType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { serializeProduct, serializeUser } from "@/lib/server/serializers";
import {
  AdminAnalyticsData,
  AdminDashboardData,
  AdminProductListItem,
  AdminUserDetail,
  AdminUserListItem,
  AuditLogEntry,
  Product,
  User
} from "@/lib/types";

function groupCount<T extends string>(items: T[]) {
  return items.reduce<Record<string, number>>((accumulator, item) => {
    accumulator[item] = (accumulator[item] ?? 0) + 1;
    return accumulator;
  }, {});
}

function formatDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [users, products, events] = await Promise.all([
    prisma.user.findMany({
      include: {
        account: {
          select: {
            email: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.product.findMany({
      include: {
        owner: {
          select: {
            name: true,
            username: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.analyticsEvent.findMany({
      select: {
        ownerUserId: true,
        productId: true,
        eventType: true
      }
    })
  ]);

  const pageViewEvents = events.filter((item) => item.eventType === AnalyticsEventType.PAGE_VIEW);
  const whatsappEvents = events.filter((item) => item.eventType === AnalyticsEventType.WHATSAPP_CLICK);
  const topCatalogCounts = groupCount(pageViewEvents.map((item) => item.ownerUserId));
  const topProductCounts = groupCount(
    whatsappEvents.map((item) => item.productId).filter((item): item is string => Boolean(item))
  );

  const userMap = new Map(users.map((item) => [item.id, serializeUser(item)]));
  const productMap = new Map(products.map((item) => [item.id, serializeProduct(item)]));

  const topCatalogs = Object.entries(topCatalogCounts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([userId, views]) => {
      const user = userMap.get(userId);
      return user ? { user, views } : null;
    })
    .filter((item): item is { user: User; views: number } => Boolean(item));

  const topProducts = Object.entries(topProductCounts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([productId, clicks]) => {
      const product = productMap.get(productId);
      return product ? { product, clicks } : null;
    })
    .filter((item): item is { product: Product; clicks: number } => Boolean(item));

  return {
    totals: {
      users: users.length,
      catalogs: users.filter((item) => item.isActive).length,
      products: products.length,
      whatsappClicks: whatsappEvents.length,
      pageViews: pageViewEvents.length
    },
    recentUsers: users.slice(0, 6).map((item) => serializeUser(item)),
    recentProducts: products.slice(0, 6).map((item) => serializeProduct(item)),
    topCatalogs,
    topProducts
  };
}

export async function getAdminUsersData({
  query,
  status
}: {
  query: string;
  status: "all" | "active" | "inactive";
}): Promise<AdminUserListItem[]> {
  const users = await prisma.user.findMany({
    include: {
      account: {
        select: {
          email: true
        }
      },
      products: {
        select: {
          id: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const normalizedQuery = query.trim().toLowerCase();
  const filteredUsers = users.filter((item) => {
    if (status === "active" && !item.isActive) return false;
    if (status === "inactive" && item.isActive) return false;
    if (!normalizedQuery) return true;

    const haystack = [item.name, item.username, item.account?.email ?? "", item.whatsapp]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  const events = await prisma.analyticsEvent.findMany({
    where: {
      ownerUserId: {
        in: filteredUsers.map((item) => item.id)
      }
    },
    select: {
      ownerUserId: true,
      eventType: true
    }
  });

  const analyticsMap = new Map<string, { views: number; whatsappClicks: number }>();
  for (const event of events) {
    const current = analyticsMap.get(event.ownerUserId) ?? { views: 0, whatsappClicks: 0 };
    if (event.eventType === AnalyticsEventType.PAGE_VIEW) current.views += 1;
    if (event.eventType === AnalyticsEventType.WHATSAPP_CLICK) current.whatsappClicks += 1;
    analyticsMap.set(event.ownerUserId, current);
  }

  return filteredUsers.map((item) => ({
    ...serializeUser(item),
    productCount: item.products.length,
    views: analyticsMap.get(item.id)?.views ?? 0,
    whatsappClicks: analyticsMap.get(item.id)?.whatsappClicks ?? 0
  }));
}

export async function getAdminUserDetail(userId: string): Promise<AdminUserDetail | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      account: {
        select: {
          email: true
        }
      },
      products: {
        include: {
          owner: {
            select: {
              name: true,
              username: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) return null;

  const events = await prisma.analyticsEvent.findMany({
    where: { ownerUserId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      productId: true,
      eventType: true,
      path: true,
      referrer: true,
      createdAt: true
    }
  });

  const daily = events.reduce<Record<string, { views: number; whatsappClicks: number; productViews: number }>>(
    (accumulator, item) => {
      const key = formatDayKey(item.createdAt);
      accumulator[key] ??= { views: 0, whatsappClicks: 0, productViews: 0 };

      if (item.eventType === AnalyticsEventType.PAGE_VIEW) accumulator[key].views += 1;
      if (item.eventType === AnalyticsEventType.WHATSAPP_CLICK) accumulator[key].whatsappClicks += 1;
      if (item.eventType === AnalyticsEventType.PRODUCT_VIEW) accumulator[key].productViews += 1;

      return accumulator;
    },
    {}
  );

  return {
    user: serializeUser(user),
    products: user.products.map((item) => serializeProduct(item)),
    totals: {
      views: events.filter((item) => item.eventType === AnalyticsEventType.PAGE_VIEW).length,
      whatsappClicks: events.filter((item) => item.eventType === AnalyticsEventType.WHATSAPP_CLICK).length,
      productViews: events.filter((item) => item.eventType === AnalyticsEventType.PRODUCT_VIEW).length
    },
    daily,
    recentEvents: events.slice(0, 15).map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString()
    }))
  };
}

export async function getAdminProductsData({
  query,
  status
}: {
  query: string;
  status: "all" | "active" | "inactive";
}): Promise<AdminProductListItem[]> {
  const products = await prisma.product.findMany({
    include: {
      owner: {
        select: {
          name: true,
          username: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = products.filter((item) => {
    if (status === "active" && !item.isActive) return false;
    if (status === "inactive" && item.isActive) return false;
    if (!normalizedQuery) return true;

    const haystack = [item.title, item.category, item.owner?.name ?? "", item.owner?.username ?? ""]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  const events = await prisma.analyticsEvent.findMany({
    where: {
      productId: {
        in: filteredProducts.map((item) => item.id)
      }
    },
    select: {
      productId: true,
      eventType: true
    }
  });

  const stats = new Map<string, { views: number; clicks: number }>();
  for (const event of events) {
    if (!event.productId) continue;
    const current = stats.get(event.productId) ?? { views: 0, clicks: 0 };
    if (event.eventType === AnalyticsEventType.PRODUCT_VIEW) current.views += 1;
    if (event.eventType === AnalyticsEventType.WHATSAPP_CLICK) current.clicks += 1;
    stats.set(event.productId, current);
  }

  return filteredProducts.map((item) => ({
    ...serializeProduct(item),
    views: stats.get(item.id)?.views ?? 0,
    clicks: stats.get(item.id)?.clicks ?? 0
  }));
}

export async function getAdminAnalyticsData(days = 14): Promise<AdminAnalyticsData> {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const events = await prisma.analyticsEvent.findMany({
    where: {
      createdAt: {
        gte: since
      }
    },
    include: {
      ownerUser: {
        select: {
          name: true,
          username: true
        }
      },
      product: {
        select: {
          title: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const pageViewsPerDay: Record<string, number> = {};
  const whatsappClicksPerDay: Record<string, number> = {};
  const referrerCounts: Record<string, number> = {};
  const catalogCounts: Record<string, number> = {};
  const productCounts: Record<string, number> = {};

  for (const event of events) {
    const day = formatDayKey(event.createdAt);
    pageViewsPerDay[day] ??= 0;
    whatsappClicksPerDay[day] ??= 0;

    if (event.eventType === AnalyticsEventType.PAGE_VIEW) {
      pageViewsPerDay[day] += 1;
      catalogCounts[event.ownerUserId] = (catalogCounts[event.ownerUserId] ?? 0) + 1;
    }

    if (event.eventType === AnalyticsEventType.WHATSAPP_CLICK) {
      whatsappClicksPerDay[day] += 1;
      if (event.productId) {
        productCounts[event.productId] = (productCounts[event.productId] ?? 0) + 1;
      }
    }

    const referrerKey = event.referrer || "Direct";
    referrerCounts[referrerKey] = (referrerCounts[referrerKey] ?? 0) + 1;
  }

  const userLookup = new Map(
    events.map((item) => [item.ownerUserId, { name: item.ownerUser.name, username: item.ownerUser.username }])
  );
  const productLookup = new Map(
    events
      .filter((item) => item.productId && item.product)
      .map((item) => [item.productId as string, item.product?.title ?? "Produk"])
  );

  return {
    pageViewsPerDay,
    whatsappClicksPerDay,
    topReferrers: Object.entries(referrerCounts)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 8)
      .map(([referrer, count]) => ({ referrer, count })),
    topCatalogs: Object.entries(catalogCounts)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 6)
      .map(([userId, count]) => ({
        userId,
        name: userLookup.get(userId)?.name ?? "User",
        username: userLookup.get(userId)?.username ?? "unknown",
        count
      })),
    topProducts: Object.entries(productCounts)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 6)
      .map(([productId, count]) => ({
        productId,
        title: productLookup.get(productId) ?? "Produk",
        count
      })),
    recentEvents: events.slice(0, 25).map((item) => ({
      id: item.id,
      eventType: item.eventType,
      ownerName: item.ownerUser.name,
      ownerUsername: item.ownerUser.username,
      productTitle: item.product?.title ?? null,
      path: item.path,
      referrer: item.referrer || "Direct",
      createdAt: item.createdAt.toISOString()
    }))
  };
}

export async function getRecentAuditLogs(limit = 12): Promise<AuditLogEntry[]> {
  const logs = await prisma.auditLog.findMany({
    include: {
      adminUser: {
        select: {
          username: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: limit
  });

  return logs.map((item) => ({
    id: item.id,
    adminUsername: item.adminUser.username,
    action: item.action,
    targetType: item.targetType,
    targetId: item.targetId,
    metadata:
      item.metadata && typeof item.metadata === "object" && !Array.isArray(item.metadata)
        ? (item.metadata as Record<string, unknown>)
        : null,
    createdAt: item.createdAt.toISOString()
  }));
}
