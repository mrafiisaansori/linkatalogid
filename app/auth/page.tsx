"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { BrandLockup } from "@/components/brand-lockup";
import { ArrowRightIcon, CheckIcon, SparkIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/components/app-provider";
import { UsernameAvailability } from "@/lib/types";
import { isReservedPublicUsername, normalizePublicUsername } from "@/lib/utils";

type AuthTab = "signin" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const { currentUser, isHydrated, signIn, signUp, checkUsernameAvailability } = useAppState();
  const [tab, setTab] = useState<AuthTab>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [linkEdited, setLinkEdited] = useState(false);
  const [linkStatus, setLinkStatus] = useState<UsernameAvailability>({
    available: false,
    normalized: "",
    message: "Link publik kamu nanti jadi linkatalog.id/nama-link."
  });
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "demo@linkatalog.id",
    password: "demo12345"
  });

  useEffect(() => {
    if (isHydrated && currentUser) {
      router.replace("/dashboard");
    }
  }, [currentUser, isHydrated, router]);

  const normalizedLink = normalizePublicUsername(form.username);
  const linkIsReserved = isReservedPublicUsername(form.username);
  const linkIsTaken = Boolean(form.username.trim()) && !linkStatus.available && !linkIsReserved;
  const signupLinkMessage =
    !form.username.trim()
      ? "Link publik kamu nanti jadi linkatalog.id/nama-link."
      : linkIsReserved
        ? "Link ini tidak tersedia. Coba pakai nama lain."
        : linkStatus.message;
  const signupLinkTone =
    !form.username.trim()
      ? "default"
      : linkIsReserved || linkIsTaken
        ? "warning"
        : "success";

  function updateName(value: string) {
    setForm((current) => ({
      ...current,
      name: value,
      username: linkEdited ? current.username : normalizePublicUsername(value)
    }));
  }

  useEffect(() => {
    if (tab !== "signup") return;

    if (!form.username.trim()) {
      setLinkStatus({
        available: false,
        normalized: "",
        message: "Link publik kamu nanti jadi linkatalog.id/nama-link."
      });
      return;
    }

    if (linkIsReserved) {
      setLinkStatus({
        available: false,
        normalized: normalizedLink,
        message: "Link ini tidak tersedia. Coba pakai nama lain."
      });
      return;
    }

    let active = true;
    const timeoutId = window.setTimeout(() => {
      void checkUsernameAvailability(form.username).then((result) => {
        if (active) {
          setLinkStatus(result);
        }
      });
    }, 240);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [checkUsernameAvailability, form.username, linkIsReserved, normalizedLink, tab]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result =
      tab === "signin"
        ? await signIn(form.email, form.password)
        : await signUp({
            name: form.name,
            username: form.username,
            email: form.email,
            password: form.password
          });

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    router.push("/dashboard");
  }

  async function handleDemoLogin() {
    setLoading(true);
    setError("");
    const result = await signIn("demo@linkatalog.id", "demo12345");
    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
      return;
    }

    setError(result.message);
  }

  if (!isHydrated) {
    return (
      <main className="page-shell flex min-h-screen items-center justify-center px-4 py-10">
        <Card className="w-full max-w-lg p-8 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="mt-4 text-sm text-muted">Menyiapkan akses ke dashboard...</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="page-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="min-w-0">
            <BrandLockup />
          </Link>
          <ThemeToggle />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="rounded-[2rem] border-brand/15 bg-gradient-to-br from-brand/18 via-brand/10 to-sky-500/10 p-8 text-foreground dark:border-white/10 dark:from-brand/22 dark:via-brand/16 dark:to-sky-500/14 dark:text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm text-foreground shadow-soft dark:bg-white/10 dark:text-white dark:shadow-none">
              <SparkIcon className="h-4 w-4" />
              Siap dipakai untuk demo
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">
              Halaman katalog personal yang kelihatan profesional sejak hari pertama.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted dark:text-white/80">
              Daftar gratis, atur profil, tambahkan produk, lalu bagikan satu link untuk menerima order via WhatsApp.
            </p>

            <div className="mt-8 space-y-4 rounded-[1.75rem] border border-white/40 bg-white/55 p-5 backdrop-blur-sm dark:border-white/10 dark:bg-white/10">
              {[
                "Dashboard dengan statistik, profil completion, dan quick action",
                "Editor produk yang mendukung gambar, badge, kategori, dan status aktif",
                "Halaman publik mobile-friendly dengan tombol WhatsApp langsung"
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-brand dark:bg-white/15 dark:text-white">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <p className="text-sm leading-6 text-muted dark:text-white/85">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-line bg-background/80 p-5 dark:border-white/10 dark:bg-slate-950/20">
              <p className="text-sm font-semibold text-foreground dark:text-white">Akun demo</p>
              <p className="mt-2 text-sm text-muted dark:text-white/80">Email: demo@linkatalog.id</p>
              <p className="text-sm text-muted dark:text-white/80">Password: demo12345</p>
              <Button
                variant="secondary"
                className="mt-5 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90"
                onClick={handleDemoLogin}
                loading={loading}
              >
                Masuk dengan akun demo
              </Button>
            </div>
          </Card>

          <Card className="rounded-[2rem] p-6 sm:p-8">
            <div className="flex rounded-full bg-surface-soft p-1">
              <button
                type="button"
                className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${tab === "signin" ? "bg-surface text-foreground shadow-card" : "text-muted"}`}
                onClick={() => setTab("signin")}
              >
                Sign in
              </button>
              <button
                type="button"
                className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${tab === "signup" ? "bg-surface text-foreground shadow-card" : "text-muted"}`}
                onClick={() => setTab("signup")}
              >
                Sign up
              </button>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-foreground">
                {tab === "signin" ? "Masuk ke dashboard kamu" : "Buat akun baru"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {tab === "signin"
                  ? "Lanjutkan edit katalog, cek klik WhatsApp, dan bagikan link kamu."
                  : "Pilih link katalog sendiri, atur profil sederhana, lalu tambahkan produk atau jasa pertama kamu."}
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {tab === "signup" ? (
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-foreground">Nama brand atau nama kamu</span>
                  <Input
                    placeholder="Contoh: Ayam Geprek Nala"
                    value={form.name}
                    onChange={(event) => updateName(event.target.value)}
                  />
                </label>
              ) : null}

              {tab === "signup" ? (
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-foreground">Link anda</span>
                  <div className="flex min-h-12 items-stretch overflow-hidden rounded-2xl border border-line bg-background text-sm text-foreground transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10">
                    <span className="flex items-center border-r border-line bg-surface-soft px-4 text-muted">
                      /
                    </span>
                    <input
                      type="text"
                      value={form.username}
                      onChange={(event) => {
                        setLinkEdited(true);
                        setForm((current) => ({
                          ...current,
                          username: normalizePublicUsername(event.target.value)
                        }));
                      }}
                      placeholder="ayam-geprek-nala"
                      className="min-h-12 w-full bg-transparent px-4 py-3 outline-none placeholder:text-muted"
                    />
                  </div>
                  <p
                    className={`text-xs leading-5 ${
                      signupLinkTone === "warning"
                        ? "text-warning"
                        : signupLinkTone === "success"
                          ? "text-success"
                          : "text-muted"
                    }`}
                  >
                    {signupLinkMessage} Hanya huruf kecil, angka, dan tanda hubung.
                  </p>
                </label>
              ) : null}

              <label className="space-y-2 text-sm">
                <span className="font-medium text-foreground">Email</span>
                <Input
                  type="email"
                  placeholder="nama@bisnis.com"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium text-foreground">Password</span>
                <Input
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                />
              </label>

              {error ? (
                <div className="rounded-2xl border border-warning/20 bg-warning/10 px-4 py-3 text-sm text-warning">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                {tab === "signin" ? "Masuk sekarang" : "Buat akun gratis"}
                {!loading ? <ArrowRightIcon className="h-4 w-4" /> : null}
              </Button>
            </form>

            <div className="mt-6 rounded-[1.75rem] border border-line bg-surface-soft p-5 text-sm leading-6 text-muted">
              Linkatalog.id fokus untuk bikin katalog jualan personal, bukan marketplace. Kamu pegang link sendiri,
              tampilkan produk atau jasa sendiri, dan order tetap masuk ke WhatsApp kamu.
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
