import Link from "next/link";
import { AdminUserStatusToggle } from "@/components/admin/admin-user-status-toggle";
import { SearchIcon, UsersIcon, WhatsAppIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { getAdminUsersData } from "@/lib/server/admin-data";
import { formatCompactNumber, formatDateTime } from "@/lib/utils";

function normalizeStatus(value?: string) {
  return value === "active" || value === "inactive" ? value : "all";
}

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const status = normalizeStatus(params.status);
  const users = await getAdminUsersData({ query, status });
  const activeUsers = users.filter((item) => item.isActive).length;

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <Badge className="w-fit" tone="brand">
              User management
            </Badge>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">Kelola seller dan katalog publik</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
              Cari user, filter status akun, buka detail seller, lalu aktifkan atau nonaktifkan akun bila diperlukan.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-line bg-background px-4 py-3">
              <p className="text-sm text-muted">Total hasil</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{formatCompactNumber(users.length)}</p>
            </div>
            <div className="rounded-[1.5rem] border border-line bg-background px-4 py-3">
              <p className="text-sm text-muted">Akun aktif</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{formatCompactNumber(activeUsers)}</p>
            </div>
            <div className="rounded-[1.5rem] border border-line bg-background px-4 py-3">
              <p className="text-sm text-muted">Akun nonaktif</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {formatCompactNumber(users.length - activeUsers)}
              </p>
            </div>
          </div>
        </div>

        <form className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Cari nama, username, email, atau WhatsApp"
              className="pl-11"
            />
          </div>
          <select
            name="status"
            defaultValue={status}
            className="h-12 w-full rounded-2xl border border-line bg-background px-4 text-sm text-foreground outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
          >
            <option value="all">Semua status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1 lg:flex-none">
              Terapkan
            </Button>
            <Link href="/be-admin/users">
              <Button type="button" variant="secondary" className="w-full lg:w-auto">
                Reset
              </Button>
            </Link>
          </div>
        </form>
      </Card>

      {users.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="h-6 w-6" />}
          title="User tidak ditemukan"
          description="Coba ubah kata kunci pencarian atau filter status akun."
        />
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="rounded-[2rem] p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-foreground">{user.name}</p>
                    <Badge tone={user.isActive ? "success" : "warning"}>
                      {user.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                    <Badge tone="neutral">ID: {user.id.slice(0, 8)}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-muted">
                    <span>@{user.username}</span>
                    {user.email ? <span>• {user.email}</span> : null}
                    {user.whatsapp ? <span>• {user.whatsapp}</span> : null}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.25rem] border border-line bg-background px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted">Produk</p>
                      <p className="mt-2 text-xl font-semibold text-foreground">{user.productCount}</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-line bg-background px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted">Views</p>
                      <p className="mt-2 text-xl font-semibold text-foreground">{user.views}</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-line bg-background px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted">WA clicks</p>
                      <p className="mt-2 flex items-center gap-2 text-xl font-semibold text-foreground">
                        <WhatsAppIcon className="h-4 w-4 text-success" />
                        {user.whatsappClicks}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted">Daftar {formatDateTime(user.createdAt)}</p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
                  <Link href={`/be-admin/users/${user.id}`}>
                    <Button variant="secondary" className="w-full sm:w-auto xl:w-full">
                      Lihat detail
                    </Button>
                  </Link>
                  <Link href={`/${user.username}`} target="_blank">
                    <Button variant="secondary" className="w-full sm:w-auto xl:w-full">
                      Buka katalog
                    </Button>
                  </Link>
                  <AdminUserStatusToggle userId={user.id} isActive={user.isActive} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
