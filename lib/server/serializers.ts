import { Product as DbProduct, User as DbUser, UserAccount } from "@prisma/client";
import { Product, ProductBadge, ThemeAccent, ThemeMode, User } from "@/lib/types";

function parseThemeMode(value: string): ThemeMode {
  return value === "dark" ? "dark" : "light";
}

function parseThemeAccent(value: string): ThemeAccent {
  return value === "sky" || value === "coral" || value === "amber" ? value : "emerald";
}

function parseProductBadge(value: string): ProductBadge {
  return value === "Best Seller" || value === "Promo" || value === "Baru" ? value : "";
}

export function serializeUser(
  user: DbUser & {
    account?: Pick<UserAccount, "email"> | null;
  }
): User {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.account?.email ?? null,
    bio: user.bio,
    whatsapp: user.whatsapp,
    profileImage: user.profileImage,
    location: user.location,
    themePreference: parseThemeMode(user.themePreference),
    themeAccent: parseThemeAccent(user.themeAccent),
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
}

export function serializeProduct(
  product: DbProduct & {
    owner?: Pick<DbUser, "name" | "username"> | null;
  }
): Product {
  return {
    id: product.id,
    userId: product.userId,
    ownerName: product.owner?.name,
    ownerUsername: product.owner?.username,
    title: product.title,
    price: product.price,
    description: product.description,
    imageUrl: product.imageUrl,
    badge: parseProductBadge(product.badge),
    category: product.category,
    isActive: product.isActive,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  };
}
