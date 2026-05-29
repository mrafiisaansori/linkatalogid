import { backendFetch } from "@/lib/server/backend-client";
import { AuditLogEntry } from "@/lib/types";

export async function createAuditLog(input: {
  adminUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown> | null;
}): Promise<void> {
  await backendFetch("/admin/audit-logs", {
    method: "POST",
    body: input
  });
}

export async function getRecentAuditLogs(limit = 8): Promise<AuditLogEntry[]> {
  const result = await backendFetch<{ success: boolean; data: AuditLogEntry[] }>("/admin/audit-logs", {
    query: { limit }
  });

  if (!result.ok || !result.data?.success) {
    return [];
  }

  return result.data.data ?? [];
}
