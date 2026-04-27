import { ReactNode } from "react";
import { AdminPanelShell } from "@/components/admin/admin-panel-shell";
import { requireAdminSession } from "@/lib/server/admin-auth";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const { admin } = await requireAdminSession();

  return <AdminPanelShell admin={admin}>{children}</AdminPanelShell>;
}
