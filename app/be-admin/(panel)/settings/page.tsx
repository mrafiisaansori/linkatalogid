import { requireAdminSession } from "@/lib/server/admin-auth";
import { getRecentAuditLogs } from "@/lib/server/audit";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ActivityIcon, LockIcon, SettingsIcon, ShieldIcon } from "@/components/icons";

const securityRules = [
  "Password admin di-hash dengan bcrypt (PASSWORD_BCRYPT) sebelum disimpan di database backend.",
  "Session admin memakai JWT di httpOnly cookie dengan masa hidup terbatas.",
  "Semua route `/be-admin/*` diproteksi middleware dan redirect ke login jika sesi hilang.",
  "Login admin dijaga rate limit dan aksi penting dicatat ke audit log."
];

export default async function AdminSettingsPage() {
  const [{ admin }, auditLogs] = await Promise.all([requireAdminSession(), getRecentAuditLogs(18)]);

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] p-6">
        <Badge className="w-fit" tone="brand">
          Settings & security
        </Badge>
        <h2 className="mt-3 text-3xl font-semibold text-foreground">Ringkasan keamanan admin panel</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
          Halaman ini merangkum proteksi inti dan aktivitas admin terbaru tanpa mengekspos data sensitif.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-line bg-background p-4">
            <p className="text-sm text-muted">Admin aktif</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{admin.username}</p>
          </div>
          <div className="rounded-[1.5rem] border border-line bg-background p-4">
            <p className="text-sm text-muted">Role</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{admin.role}</p>
          </div>
          <div className="rounded-[1.5rem] border border-line bg-background p-4">
            <p className="text-sm text-muted">Created</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{formatDateTime(admin.createdAt)}</p>
          </div>
          <div className="rounded-[1.5rem] border border-line bg-background p-4">
            <p className="text-sm text-muted">Updated</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{formatDateTime(admin.updatedAt)}</p>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">Security controls</p>
              <p className="mt-1 text-sm text-muted">Proteksi utama yang aktif pada admin panel.</p>
            </div>
            <ShieldIcon className="h-5 w-5 text-brand" />
          </div>

          <div className="mt-5 space-y-3">
            {securityRules.map((item, index) => (
              <div key={item} className="rounded-[1.5rem] border border-line bg-background p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    {index % 2 === 0 ? <LockIcon className="h-5 w-5" /> : <SettingsIcon className="h-5 w-5" />}
                  </div>
                  <p className="text-sm leading-7 text-foreground">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">Recent audit logs</p>
              <p className="mt-1 text-sm text-muted">Riwayat aksi admin terbaru untuk monitoring internal.</p>
            </div>
            <ActivityIcon className="h-5 w-5 text-brand" />
          </div>

          <div className="mt-5 space-y-3">
            {auditLogs.map((item) => (
              <div key={item.id} className="rounded-[1.5rem] border border-line bg-background p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="neutral">{item.adminUsername ?? "admin"}</Badge>
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                </div>
                <p className="mt-2 text-sm text-muted">
                  {item.targetType}:{item.targetId}
                </p>
                <p className="mt-2 text-xs text-muted">{formatDateTime(item.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
