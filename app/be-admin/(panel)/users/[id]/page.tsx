import Link from "next/link";
import { notFound } from "next/navigation";
import { createAuditLog } from "@/lib/server/audit";
import { requireAdminSession } from "@/lib/server/admin-auth";
import { getAdminUserDetail } from "@/lib/server/admin-data";
import { formatCurrency, formatDateLabel, formatDateTime } from "@/lib/utils";
import {
  ActivityIcon,
  BoxIcon,
  ChartIcon,
  ClockIcon,
  LocationIcon,
  UserIcon,
  WhatsAppIcon
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function AdminUserDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireAdminSession();
  const detail = await getAdminUserDetail(id);

  if (!detail) {
    notFound();
  }

  await createAuditLog({
    adminUserId: session.admin.id,
    action: "view_user_detail",
    targetType: "user",
    targetId: detail.user.id,
    metadata: {
      username: detail.user.username
    }
  });

  const dailyRows = Object.entries(detail.daily)
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-7);

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-start gap-4">
            {detail.user.profileImage ? (
              <img
                src={detail.user.profileImage}
                alt={detail.user.name}
                className="h-20 w-20 rounded-[1.5rem] object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-brand/10 text-brand">
                <UserIcon className="h-8 w-8" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-3xl font-semibold text-foreground">{detail.user.name}</h2>
                <Badge tone={detail.user.isActive ? "success" : "warning"}>
                  {detail.user.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted">
                @{detail.user.username}
                {detail.user.email ? ` • ${detail.user.email}` : ""}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{detail.user.bio || "Belum ada bio."}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {detail.user.whatsapp ? <Badge tone="success">{detail.user.whatsapp}</Badge> : null}
                {detail.user.location ? (
                  <Badge tone="neutral">
                    <LocationIcon className="mr-1 h-3.5 w-3.5" />
                    {detail.user.location}
                  </Badge>
                ) : null}
                <Badge tone="neutral">Update {formatDateTime(detail.user.updatedAt)}</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/be-admin/users">
              <Button variant="secondary">Kembali</Button>
            </Link>
            <Link href={`/${detail.user.username}`} target="_blank">
              <Button>Buka katalog publik</Button>
            </Link>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-[2rem] p-5">
          <p className="text-sm text-muted">Page views</p>
          <p className="mt-4 text-3xl font-semibold text-foreground">{detail.totals.views}</p>
        </Card>
        <Card className="rounded-[2rem] p-5">
          <p className="text-sm text-muted">WhatsApp clicks</p>
          <p className="mt-4 text-3xl font-semibold text-foreground">{detail.totals.whatsappClicks}</p>
        </Card>
        <Card className="rounded-[2rem] p-5">
          <p className="text-sm text-muted">Product views</p>
          <p className="mt-4 text-3xl font-semibold text-foreground">{detail.totals.productViews}</p>
        </Card>
        <Card className="rounded-[2rem] p-5">
          <p className="text-sm text-muted">Total produk</p>
          <p className="mt-4 text-3xl font-semibold text-foreground">{detail.products.length}</p>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">Daftar produk dan jasa</p>
              <p className="mt-1 text-sm text-muted">Item yang dimiliki seller ini.</p>
            </div>
            <BoxIcon className="h-5 w-5 text-brand" />
          </div>

          <div className="mt-5 space-y-3">
            {detail.products.length === 0 ? (
              <p className="text-sm text-muted">Belum ada produk.</p>
            ) : (
              detail.products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 rounded-[1.5rem] border border-line bg-background p-4 sm:flex-row"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="h-24 w-full rounded-2xl object-cover sm:w-28"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{product.title}</p>
                      {product.badge ? <Badge>{product.badge}</Badge> : null}
                      <Badge tone={product.isActive ? "success" : "warning"}>
                        {product.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">{product.category || "Tanpa kategori"}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{product.description}</p>
                    <p className="mt-3 text-lg font-semibold text-foreground">{formatCurrency(product.price)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-[2rem] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-foreground">Traffic 7 hari terakhir</p>
                <p className="mt-1 text-sm text-muted">Ringkasan views, product views, dan klik WhatsApp.</p>
              </div>
              <ChartIcon className="h-5 w-5 text-brand" />
            </div>

            <div className="mt-5 space-y-3">
              {dailyRows.length === 0 ? (
                <p className="text-sm text-muted">Belum ada data traffic.</p>
              ) : (
                dailyRows.map(([day, stats]) => (
                  <div key={day} className="rounded-[1.5rem] border border-line bg-background p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-foreground">{formatDateLabel(day)}</p>
                      <p className="text-xs text-muted">{day}</p>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-surface-soft p-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted">Views</p>
                        <p className="mt-2 text-xl font-semibold text-foreground">{stats.views}</p>
                      </div>
                      <div className="rounded-2xl bg-surface-soft p-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted">Product</p>
                        <p className="mt-2 text-xl font-semibold text-foreground">{stats.productViews}</p>
                      </div>
                      <div className="rounded-2xl bg-surface-soft p-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted">WA</p>
                        <p className="mt-2 text-xl font-semibold text-foreground">{stats.whatsappClicks}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="rounded-[2rem] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-foreground">Recent events</p>
                <p className="mt-1 text-sm text-muted">Aktivitas terbaru dari katalog publik seller.</p>
              </div>
              <ActivityIcon className="h-5 w-5 text-brand" />
            </div>

            <div className="mt-5 space-y-3">
              {detail.recentEvents.length === 0 ? (
                <p className="text-sm text-muted">Belum ada event analytics.</p>
              ) : (
                detail.recentEvents.map((event) => (
                  <div key={event.id} className="rounded-[1.5rem] border border-line bg-background p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="neutral">{event.eventType}</Badge>
                      {event.productId ? <Badge tone="brand">produk</Badge> : null}
                    </div>
                    <p className="mt-3 text-sm text-foreground">{event.path}</p>
                    <p className="mt-2 text-sm text-muted">{event.referrer || "Direct"}</p>
                    <p className="mt-2 flex items-center gap-2 text-xs text-muted">
                      <ClockIcon className="h-4 w-4" />
                      {formatDateTime(event.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
