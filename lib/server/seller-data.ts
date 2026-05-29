import { backendFetch } from "@/lib/server/backend-client";
import { PublicCatalogPayload, SellerSessionPayload } from "@/lib/types";

const EMPTY_PAYLOAD: SellerSessionPayload = {
  authenticated: false,
  user: null,
  products: [],
  analytics: { views: 0, whatsappClicks: 0, productViews: 0 }
};

export async function buildSellerSessionPayload(userId: string): Promise<SellerSessionPayload> {
  const result = await backendFetch<SellerSessionPayload>("/me", { query: { userId } });
  if (!result.ok || !result.data) {
    return EMPTY_PAYLOAD;
  }
  return {
    authenticated: Boolean(result.data.authenticated),
    user: result.data.user ?? null,
    products: result.data.products ?? [],
    analytics: result.data.analytics ?? EMPTY_PAYLOAD.analytics
  };
}

export async function getPublicCatalogPayload(username: string): Promise<PublicCatalogPayload | null> {
  const result = await backendFetch<{
    success: boolean;
    user: PublicCatalogPayload["user"];
    products: PublicCatalogPayload["products"];
    analytics: PublicCatalogPayload["analytics"];
  }>(`/public/catalog/${encodeURIComponent(username)}`, { revalidate: 30 });

  if (!result.ok || !result.data?.success || !result.data.user) {
    return null;
  }
  return {
    user: result.data.user,
    products: result.data.products ?? [],
    analytics: result.data.analytics ?? { views: 0, whatsappClicks: 0, productViews: 0 }
  };
}
