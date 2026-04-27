export type ThemeMode = "light" | "dark";
export type ThemeAccent = "emerald" | "sky" | "coral" | "amber";
export type ProductBadge = "Best Seller" | "Promo" | "Baru" | "";
export type AnalyticsEventType = "PAGE_VIEW" | "PRODUCT_VIEW" | "WHATSAPP_CLICK";

export interface User {
  id: string;
  name: string;
  username: string;
  email?: string | null;
  bio: string;
  whatsapp: string;
  profileImage: string;
  location: string;
  themePreference: ThemeMode;
  themeAccent: ThemeAccent;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  userId: string;
  ownerName?: string;
  ownerUsername?: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  badge: ProductBadge;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  id?: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  badge: ProductBadge;
  category: string;
  isActive: boolean;
}

export interface AnalyticsSummary {
  views: number;
  whatsappClicks: number;
  productViews?: number;
}

export interface SellerSessionPayload {
  authenticated: boolean;
  user: User | null;
  products: Product[];
  analytics: AnalyticsSummary;
}

export interface PublicCatalogPayload {
  user: User;
  products: Product[];
  analytics: AnalyticsSummary;
}

export interface UsernameAvailability {
  available: boolean;
  normalized: string;
  message: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserListItem extends User {
  productCount: number;
  views: number;
  whatsappClicks: number;
}

export interface AdminProductListItem extends Product {
  views: number;
  clicks: number;
}

export interface AdminRecentEvent {
  id: string;
  eventType: AnalyticsEventType;
  ownerName: string;
  ownerUsername: string;
  productTitle: string | null;
  path: string;
  referrer: string;
  createdAt: string;
}

export interface AdminUserDetail {
  user: User;
  products: Product[];
  totals: {
    views: number;
    whatsappClicks: number;
    productViews: number;
  };
  daily: Record<
    string,
    {
      views: number;
      whatsappClicks: number;
      productViews: number;
    }
  >;
  recentEvents: Array<{
    id: string;
    productId: string | null;
    eventType: AnalyticsEventType;
    path: string;
    referrer: string | null;
    createdAt: string;
  }>;
}

export interface AdminDashboardData {
  totals: {
    users: number;
    catalogs: number;
    products: number;
    whatsappClicks: number;
    pageViews: number;
  };
  recentUsers: User[];
  recentProducts: Product[];
  topCatalogs: Array<{
    user: User;
    views: number;
  }>;
  topProducts: Array<{
    product: Product;
    clicks: number;
  }>;
}

export interface AdminAnalyticsData {
  pageViewsPerDay: Record<string, number>;
  whatsappClicksPerDay: Record<string, number>;
  topReferrers: Array<{
    referrer: string;
    count: number;
  }>;
  topCatalogs: Array<{
    userId: string;
    name: string;
    username: string;
    count: number;
  }>;
  topProducts: Array<{
    productId: string;
    title: string;
    count: number;
  }>;
  recentEvents: AdminRecentEvent[];
}

export interface AuditLogEntry {
  id: string;
  adminUsername?: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  tone?: "default" | "success" | "warning";
}
