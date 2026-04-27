import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { BrandLockup } from "@/components/brand-lockup";
import { ActivityIcon, LockIcon, ShieldIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const securityItems = [
  {
    icon: ShieldIcon,
    title: "Route privat resmi",
    description: "Admin panel hanya bisa diakses lewat URL langsung `/be-admin`."
  },
  {
    icon: LockIcon,
    title: "Session aman",
    description: "Autentikasi admin memakai httpOnly cookie dan proteksi middleware."
  },
  {
    icon: ActivityIcon,
    title: "Audit & rate limit",
    description: "Login admin dicatat ke audit log dan dijaga rate limit sederhana."
  }
];

export default function AdminLoginPage() {
  return (
    <main className="page-shell min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <BrandLockup tagline={false} />
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <Link href="/">
              <Button variant="secondary" size="sm">
                Kembali ke app
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-1 items-center py-8 lg:py-12">
          <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="overflow-hidden rounded-[2rem] border-brand/15 bg-hero-mesh p-0">
              <div className="h-full p-6 sm:p-8">
                <Badge className="w-fit" tone="success">
                  Private Admin Panel
                </Badge>
                <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                  Monitoring internal untuk platform LINK KATALOG.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
                  Panel ini dipakai untuk melihat performa platform, mengelola seller, membaca traffic katalog, dan
                  memantau aktivitas admin secara aman.
                </p>

                <div className="mt-8 grid gap-4">
                  {securityItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="rounded-[1.5rem] border border-line/70 bg-surface/90 p-5 shadow-soft"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{item.title}</p>
                            <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            <Card className="rounded-[2rem] p-6 sm:p-8">
              <Badge className="w-fit" tone="brand">
                Login admin
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold text-foreground">Masuk ke area internal</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                Gunakan akun admin yang aktif untuk membuka dashboard monitoring platform.
              </p>

              <div className="mt-8">
                <AdminLoginForm />
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-line bg-surface-soft p-4">
                <p className="text-sm font-semibold text-foreground">Catatan akses</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Kredensial admin tersimpan dalam database dengan password yang sudah di-hash, bukan di file publik.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
