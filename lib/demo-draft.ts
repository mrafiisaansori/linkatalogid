import { AnalyticsSummary, Product, PublicCatalogPayload, User } from "@/lib/types";

export const DEMO_DRAFT_STORAGE_KEY = "linkatalog_demo_draft";

export interface DemoDraftState {
  user: User;
  products: Product[];
  analytics: AnalyticsSummary;
  updatedAt: string;
}

export function parseDemoDraft(value: string | null): DemoDraftState | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<DemoDraftState> | null;
    if (!parsed || typeof parsed !== "object" || !parsed.user || !Array.isArray(parsed.products) || !parsed.analytics) {
      return null;
    }

    return {
      user: parsed.user as User,
      products: parsed.products as Product[],
      analytics: parsed.analytics as AnalyticsSummary,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString()
    };
  } catch {
    return null;
  }
}

export function toPublicCatalogPayload(draft: DemoDraftState): PublicCatalogPayload {
  return {
    user: draft.user,
    products: draft.products,
    analytics: draft.analytics
  };
}
