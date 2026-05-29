import { backendFetch } from "@/lib/server/backend-client";
import {
  AdminAnalyticsData,
  AdminDashboardData,
  AdminProductListItem,
  AdminUserDetail,
  AdminUserListItem
} from "@/lib/types";

interface UserListFilters {
  query?: string;
  status?: "all" | "active" | "inactive";
}

interface ProductListFilters {
  query?: string;
  status?: "all" | "active" | "inactive";
}

const EMPTY_DASHBOARD: AdminDashboardData = {
  totals: {
    users: 0,
    catalogs: 0,
    products: 0,
    whatsappClicks: 0,
    pageViews: 0
  },
  recentUsers: [],
  recentProducts: [],
  topCatalogs: [],
  topProducts: []
};

const EMPTY_ANALYTICS: AdminAnalyticsData = {
  pageViewsPerDay: {},
  whatsappClicksPerDay: {},
  topReferrers: [],
  topCatalogs: [],
  topProducts: [],
  recentEvents: []
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const result = await backendFetch<{ success: boolean; data: AdminDashboardData }>("/admin/dashboard");
  if (!result.ok || !result.data?.success || !result.data.data) {
    return EMPTY_DASHBOARD;
  }
  return result.data.data;
}

export async function getAdminAnalyticsData(days = 14): Promise<AdminAnalyticsData> {
  const result = await backendFetch<{ success: boolean; data: AdminAnalyticsData }>("/admin/analytics", {
    query: { days }
  });
  if (!result.ok || !result.data?.success || !result.data.data) {
    return EMPTY_ANALYTICS;
  }
  return result.data.data;
}

export async function getAdminUserList(): Promise<AdminUserListItem[]> {
  return getAdminUsersData();
}

export async function getAdminUsersData(filters?: UserListFilters): Promise<AdminUserListItem[]> {
  const result = await backendFetch<{ success: boolean; data: AdminUserListItem[] }>("/admin/users", {
    query: {
      query: filters?.query ?? "",
      status: filters?.status ?? "all"
    }
  });

  if (!result.ok || !result.data?.success) {
    return [];
  }

  return result.data.data ?? [];
}

export async function getAdminProductList(): Promise<AdminProductListItem[]> {
  return getAdminProductsData();
}

export async function getAdminProductsData(filters?: ProductListFilters): Promise<AdminProductListItem[]> {
  const result = await backendFetch<{ success: boolean; data: AdminProductListItem[] }>("/admin/products", {
    query: {
      query: filters?.query ?? "",
      status: filters?.status ?? "all"
    }
  });

  if (!result.ok || !result.data?.success) {
    return [];
  }

  return result.data.data ?? [];
}

export async function getAdminUserDetail(userId: string): Promise<AdminUserDetail | null> {
  const result = await backendFetch<{ success: boolean; data: AdminUserDetail }>(
    `/admin/users/${encodeURIComponent(userId)}/detail`
  );
  if (!result.ok || !result.data?.success || !result.data.data) {
    return null;
  }
  return result.data.data;
}
