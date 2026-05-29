import { backendFetch } from "@/lib/server/backend-client";
import { SellerSessionPayload } from "@/lib/types";

export async function getUserAnalyticsSummary(userId: string) {
  // Analytics di-include di /me payload. Helper ini di-pertahankan untuk
  // backwards compatibility kalau ada caller lain di repo.
  const result = await backendFetch<SellerSessionPayload>("/me", { query: { userId } });
  return result.data?.analytics ?? { views: 0, whatsappClicks: 0, productViews: 0 };
}
