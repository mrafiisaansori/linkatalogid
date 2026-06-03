import {
  ItemCtaType,
  ItemType,
  PriceMode,
  Product,
  ProductBadge,
  ThemeAccent,
  ThemeMode,
  User,
  UserPlan
} from "@/lib/types";
import { sanitizeWhatsappNumber } from "@/lib/utils";

type AnyRecord = Record<string, unknown>;

function s(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function parseThemeMode(value: unknown): ThemeMode {
  return value === "dark" ? "dark" : "light";
}

function parseThemeAccent(value: unknown): ThemeAccent {
  return value === "sky" || value === "coral" || value === "amber" ? value : "emerald";
}

function parseProductBadge(value: unknown): ProductBadge {
  return value === "Best Seller" || value === "Promo" || value === "Baru" ? value : "";
}

function parseItemType(value: unknown): ItemType {
  return value === "service" ? "service" : "product";
}

function parsePriceMode(value: unknown): PriceMode {
  return value === "from" || value === "custom" ? value : "fixed";
}

function parseCtaType(value: unknown): ItemCtaType {
  return value === "booking" || value === "consult" || value === "quote" ? value : "buy";
}

function parseUserPlan(value: unknown): UserPlan {
  return value === "starter" || value === "pro" || value === "enterprise" ? value : "free";
}

function toIso(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return new Date().toISOString();
}

export function serializeUser(input: AnyRecord & { account?: { email?: string | null } | null }): User {
  return {
    id: s(input.id),
    name: s(input.name),
    username: s(input.username),
    email: (input.email as string | null | undefined) ?? input.account?.email ?? null,
    bio: s(input.bio),
    whatsapp: sanitizeWhatsappNumber(s(input.whatsapp)),
    profileImage: s(input.profileImage),
    location: s(input.location),
    themePreference: parseThemeMode(input.themePreference),
    themeAccent: parseThemeAccent(input.themeAccent),
    isActive: Boolean(input.isActive),
    plan: parseUserPlan(input.plan),
    createdAt: toIso(input.createdAt),
    updatedAt: toIso(input.updatedAt)
  };
}

export function serializeProduct(input: AnyRecord & { owner?: { name?: string; username?: string } | null }): Product {
  return {
    id: s(input.id),
    userId: s(input.userId),
    ownerName: input.owner?.name,
    ownerUsername: input.owner?.username,
    title: s(input.title),
    price: typeof input.price === "number" ? input.price : Number(input.price ?? 0),
    description: s(input.description),
    imageUrl: s(input.imageUrl),
    badge: parseProductBadge(input.badge),
    category: s(input.category),
    isActive: Boolean(input.isActive),
    type: parseItemType(input.type),
    priceMode: parsePriceMode(input.priceMode),
    compareAtPrice: Number(input.compareAtPrice ?? 0) || 0,
    ctaType: parseCtaType(input.ctaType),
    createdAt: toIso(input.createdAt),
    updatedAt: toIso(input.updatedAt)
  };
}
