import Link from "next/link";
import { ActivityIcon, ChartIcon, EyeIcon, GlobeIcon, SearchIcon, WhatsAppIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminAnalyticsData } from "@/lib/server/admin-data";
import { formatCompactNumber, formatDateLabel, formatDateTime } from "@/lib/utils";

function normalizeDays(value?: string) {
  const parsed = Number(value);
  return parsed === 7 || parsed === 30 ? parsed : 14;
}

function buildDayKeys(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - index - 1));
    date.setHours(0, 0, 0, 0);
    return date.toISOString().slice(0, 10);
  });
}

export default async function AdminAnalyticsPage({
  searchParams
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const params = await searchParams;
  const days = normalizeDays(params.days);
  const analytics = await getAdminAnalyticsData(days);
  const dayKeys = buildDayKeys(days);

  const pageSeries = dayKeys.map((day) => ({
    day,
    label: formatDateLabel(day),
    value: analytics.pageViewsPerDay[day] ?? 0
  }));
  const whatsappSeries = dayKeys.map((day) => ({
    day,
    label: formatDateLabel(day),
    value: analytics.whatsappClicksPerDay[day] ?? 0
  }));

  const totalPageViews = pageSeries.reduce((sum, item) => sum + item.value, 0);
  const totalWhatsappClicks = whatsappSeries.reduce((sum, item) => sum + item.value, 0);
  const maxPageViews = Math.max(...pageSeries.map((item) => item.value), 1);
  const maxWhatsappClicks = Math.max(...whatsappSeries.map((item) => item.value), 1);

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <Badge className="w-fit" tone="brand">
              Traffic analytics
            </Badge>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">Pantau traffic dan konversi katalog</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
              Ringkasan page views, klik WhatsApp, referrer, katalog teratas, dan event terbaru dari area publik.
            </p>
          </div>

          <form className="flex flex-wrap gap-2">
            <select
              name="days"
              defaultValue={String(days)}
              className="h-11 rounded-2xl border border-line bg-background px-4 text-sm text-foreground outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
            >
              <option value="7">7 hari</option>
              <option value="14">14 hari</option>
              <option value="30">30 hari</option>
            </select>
            <Button type="submit">Terapkan</Button>
          </form>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-line bg-background p-4">
            <p className="text-sm text-muted">Page views periode ini</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{formatCompactNumber(totalPageViews)}</p>
          </div>
          <div className="rounded-[1.5rem] border border-line bg-background p-4">
            <p className="text-sm text-muted">WhatsApp clicks periode ini</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {formatCompactNumber(totalWhatsappClicks)}
            </p>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">Page views per hari</p>
              <p className="mt-1 text-sm text-muted">Distribusi kunjungan katalog dalam {days} hari terakhir.</p>
            </div>
            <EyeIcon className="h-5 w-5 text-brand" />
          </div>

          <div className="mt-5 space-y-3">
            {pageSeries.map((item) => (
              <div key={item.day} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-foreground">{item.label}</span>
                  <span className="text-muted">{item.value}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-surface-soft">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${(item.value / maxPageViews) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">WhatsApp clicks per hari</p>
              <p className="mt-1 text-sm text-muted">Indikator niat order dari semua katalog.</p>
            </div>
            <WhatsAppIcon className="h-5 w-5 text-success" />
          </div>

          <div className="mt-5 space-y-3">
            {whatsappSeries.map((item) => (
              <div key={item.day} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-foreground">{item.label}</span>
                  <span className="text-muted">{item.value}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-surface-soft">
                  <div
                    className="h-full rounded-full bg-success"
                    style={{ width: `${(item.value / maxWhatsappClicks) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">Top referrer</p>
              <p className="mt-1 text-sm text-muted">Sumber traffic yang paling sering mengirim pengunjung.</p>
            </div>
            <SearchIcon className="h-5 w-5 text-brand" />
          </div>

          <div className="mt-5 space-y-3">
            {analytics.topReferrers.length === 0 ? (
              <p className="text-sm text-muted">Belum ada data referrer.</p>
            ) : (
              analytics.topReferrers.map((item) => (
                <div
                  key={item.referrer}
                  className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-line bg-background p-4"
                >
                  <p className="min-w-0 truncate text-sm font-medium text-foreground">{item.referrer}</p>
                  <Badge tone="neutral">{item.count}</Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="rounded-[2rem] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-foreground">Top katalog</p>
                <p className="mt-1 text-sm text-muted">Katalog dengan views tertinggi.</p>
              </div>
              <GlobeIcon className="h-5 w-5 text-brand" />
            </div>
            <div className="mt-5 space-y-3">
              {analytics.topCatalogs.map((item) => (
                <div key={item.userId} className="rounded-[1.5rem] border border-line bg-background p-4">
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="mt-1 text-sm text-muted">@{item.username}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Badge tone="success">{item.count} views</Badge>
                    <Link href={`/${item.username}`} target="_blank" className="text-sm font-medium text-brand">
                      Buka
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[2rem] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-foreground">Top produk</p>
                <p className="mt-1 text-sm text-muted">Produk dengan klik WhatsApp tertinggi.</p>
              </div>
              <ChartIcon className="h-5 w-5 text-brand" />
            </div>
            <div className="mt-5 space-y-3">
              {analytics.topProducts.map((item) => (
                <div key={item.productId} className="rounded-[1.5rem] border border-line bg-background p-4">
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Badge tone="success">{item.count} klik</Badge>
                    <p className="text-xs text-muted">{item.productId.slice(0, 8)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <Card className="rounded-[2rem] p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-foreground">Recent events table</p>
            <p className="mt-1 text-sm text-muted">Event analytics terbaru dari area publik Linkatalog.</p>
          </div>
          <ActivityIcon className="h-5 w-5 text-brand" />
        </div>

        <div className="mt-5 space-y-3">
          {analytics.recentEvents.length === 0 ? (
            <p className="text-sm text-muted">Belum ada event analytics terbaru.</p>
          ) : (
            analytics.recentEvents.map((event) => (
              <div
                key={event.id}
                className="grid gap-3 rounded-[1.5rem] border border-line bg-background p-4 lg:grid-cols-[150px_180px_minmax(0,1fr)_160px]"
              >
                <div>
                  <Badge tone="neutral">{event.eventType}</Badge>
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{event.ownerName}</p>
                  <p className="text-sm text-muted">@{event.ownerUsername}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">{event.productTitle ?? event.path}</p>
                  <p className="truncate text-sm text-muted">{event.referrer}</p>
                </div>
                <p className="text-sm text-muted">{formatDateTime(event.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
