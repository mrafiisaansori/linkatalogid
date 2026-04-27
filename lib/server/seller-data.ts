import { prisma } from "@/lib/db";
import { getUserAnalyticsSummary } from "@/lib/server/analytics";
import { serializeProduct, serializeUser } from "@/lib/server/serializers";
import { PublicCatalogPayload, SellerSessionPayload } from "@/lib/types";

export async function buildSellerSessionPayload(userId: string): Promise<SellerSessionPayload> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      account: {
        select: {
          email: true
        }
      }
    }
  });

  if (!user || !user.isActive) {
    return {
      authenticated: false,
      user: null,
      products: [],
      analytics: { views: 0, whatsappClicks: 0, productViews: 0 }
    };
  }

  const [products, analytics] = await Promise.all([
    prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    }),
    getUserAnalyticsSummary(userId)
  ]);

  return {
    authenticated: true,
    user: serializeUser(user),
    products: products.map((item) => serializeProduct(item)),
    analytics
  };
}

export async function getPublicCatalogPayload(username: string): Promise<PublicCatalogPayload | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      account: {
        select: {
          email: true
        }
      }
    }
  });

  if (!user || !user.isActive) {
    return null;
  }

  const [products, analytics] = await Promise.all([
    prisma.product.findMany({
      where: {
        userId: user.id,
        isActive: true
      },
      orderBy: { createdAt: "desc" }
    }),
    getUserAnalyticsSummary(user.id)
  ]);

  return {
    user: serializeUser(user),
    products: products.map((item) => serializeProduct(item)),
    analytics
  };
}
