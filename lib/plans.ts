import { UserPlan } from "@/lib/types";

export interface PlanDefinition {
  id: UserPlan;
  name: string;
  productLimit: number | null;
  analyticsRetentionDays: number;
  teamSeats: number;
  supportLevel: string;
}

export const PLAN_DEFINITIONS: Record<UserPlan, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free Selamanya",
    productLimit: null,
    analyticsRetentionDays: 365,
    teamSeats: 1,
    supportLevel: "Basic"
  },
  starter: {
    id: "starter",
    name: "Free Selamanya",
    productLimit: null,
    analyticsRetentionDays: 365,
    teamSeats: 1,
    supportLevel: "Basic"
  },
  pro: {
    id: "pro",
    name: "Free Selamanya",
    productLimit: null,
    analyticsRetentionDays: 365,
    teamSeats: 1,
    supportLevel: "Basic"
  },
  enterprise: {
    id: "enterprise",
    name: "Free Selamanya",
    productLimit: null,
    analyticsRetentionDays: 365,
    teamSeats: 1,
    supportLevel: "Basic"
  }
};

export function getPlanDefinition(plan?: UserPlan | null) {
  return PLAN_DEFINITIONS[plan ?? "free"] ?? PLAN_DEFINITIONS.free;
}

export function getProductQuotaStatus(plan: UserPlan | undefined | null, productCount: number) {
  const definition = getPlanDefinition(plan);
  const limit = definition.productLimit;

  return {
    definition,
    limit,
    used: productCount,
    remaining: limit === null ? null : Math.max(0, limit - productCount),
    isAtLimit: limit !== null && productCount >= limit,
    percentage: limit === null ? 0 : Math.min(100, Math.round((productCount / limit) * 100))
  };
}
