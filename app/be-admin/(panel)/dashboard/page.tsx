import Link from "next/link";
import { getAdminDashboardData, getRecentAuditLogs } from "@/lib/server/admin-data";
import { formatCompactNumber, formatCurrency, formatDateTime } from "@/lib/utils";
import {
  ActivityIcon,
  BoxIcon,
  ChartIcon,
  ClockIcon,
  EyeIcon,
  GlobeIcon,
  ShieldIcon,
  UsersIcon,
  WhatsAppIcon
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

function MetricCard({
  label,
  value,
  description,
  icon
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const Icon = icon;

  return (
    <Card className="rounded-[2rem] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{label}</p>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const [dashboard, auditLogs] = await Promise.all([getAdminDashboardData(), getRecentAuditLogs(8)]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-5">
        <MetricCard
          label="Total users"
          value={formatCompactNumber(dashboard.totals.users)}
          description="Seller yang terdaftar di platform"
          icon={UsersIcon}
        />
        <MetricCard
          label="Public pages"
          value={formatCompactNumber(dashboard.totals.catalogs)}
          description="Katalog aktif yang bisa diakses publik"
          icon={GlobeIcon}
        />
        <MetricCard
          label="Total produk"
          value={formatCompactNumber(dashboard.totals.products)}
          description="Produk dan jasa yang sudah dibuat"
          icon={BoxIcon}
        />
        <MetricCard
          label="WhatsApp clicks"
          value={formatCompactNumber(dashboard.totals.whatsappClicks)}
          description="Klik order dari semua katalog"
          icon={WhatsAppIcon}
        />
        <MetricCard
          label="Page views"
          value={formatCompactNumber(dashboard.totals.pageViews)}
          description="Total kunjungan ke katalog publik"
          icon={ChartIcon}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">User terbaru</p>
              <p className="mt-1 text-sm text-muted">Pantau seller yang baru membuat katalog.</p>
            </div>
            <Link href="/be-admin/users" className="text-sm font-medium text-brand">
              Lihat semua
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {dashboard.recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-3 rounded-[1.5rem] border border-line bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <Badge tone={user.isActive ? "success" : "warning"}>
                      {user.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    @{user.username} {user.email ? `• ${user.email}` : ""}
                  </p>
                  <p className="mt-2 text-xs text-muted">Daftar {formatDateTime(user.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/be-admin/users/${user.id}`}
                    className="inline-flex items-center rounded-full border border-line px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-soft"
                  >
                    Detail
                  </Link>
                  <Link
                    href={`/${user.username}`}
                    target="_blank"
                    className="inline-flex items-center rounded-full bg-surface-soft px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface"
                  >
                    Buka katalog
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">Produk terbaru</p>
              <p className="mt-1 text-sm text-muted">Item baru yang masuk ke katalog seller.</p>
            </div>
            <Link href="/be-admin/products" className="text-sm font-medium text-brand">
              Kelola produk
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {dashboard.recentProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-3 rounded-[1.5rem] border border-line bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{product.title}</p>
                    {product.badge ? <Badge>{product.badge}</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    @{product.ownerUsername ?? "unknown"} • {product.category || "Tanpa kategori"}
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">{formatCurrency(product.price)}</p>
                </div>
                <Badge tone={product.isActive ? "success" : "warning"}>
                  {product.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">Top katalog</p>
              <p className="mt-1 text-sm text-muted">Berdasarkan page views.</p>
            </div>
            <EyeIcon className="h-5 w-5 text-brand" />
          </div>

          <div className="mt-5 space-y-3">
            {dashboard.topCatalogs.length === 0 ? (
              <p className="text-sm text-muted">Belum ada traffic katalog.</p>
            ) : (
              dashboard.topCatalogs.map((item, index) => (
                <div
                  key={item.user.id}
                  className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-line bg-background p-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">
                      #{index + 1} {item.user.name}
                    </p>
                    <p className="mt-1 text-sm text-muted">@{item.user.username}</p>
                  </div>
                  <Badge tone="success">{formatCompactNumber(item.views)} views</Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">Top produk</p>
              <p className="mt-1 text-sm text-muted">Berdasarkan klik WhatsApp.</p>
            </div>
            <WhatsAppIcon className="h-5 w-5 text-success" />
          </div>

          <div className="mt-5 space-y-3">
            {dashboard.topProducts.length === 0 ? (
              <p className="text-sm text-muted">Belum ada klik WhatsApp dari produk.</p>
            ) : (
              dashboard.topProducts.map((item, index) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-line bg-background p-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">
                      #{index + 1} {item.product.title}
                    </p>
                    <p className="mt-1 text-sm text-muted">@{item.product.ownerUsername ?? "unknown"}</p>
                  </div>
                  <Badge tone="success">{formatCompactNumber(item.clicks)} klik</Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">Audit log terbaru</p>
              <p className="mt-1 text-sm text-muted">Aksi penting admin terakhir.</p>
            </div>
            <ShieldIcon className="h-5 w-5 text-brand" />
          </div>

          <div className="mt-5 space-y-3">
            {auditLogs.map((item) => (
              <div key={item.id} className="rounded-[1.5rem] border border-line bg-background p-4">
                <div className="flex items-center gap-2">
                  <Badge tone="neutral">{item.adminUsername ?? "admin"}</Badge>
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                </div>
                <p className="mt-2 text-sm text-muted">
                  {item.targetType}:{item.targetId}
                </p>
                <p className="mt-2 flex items-center gap-2 text-xs text-muted">
                  <ClockIcon className="h-4 w-4" />
                  {formatDateTime(item.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
