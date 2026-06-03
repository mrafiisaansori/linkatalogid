"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { BrandLockup } from "@/components/brand-lockup";
import { Turnstile, TurnstileHandle } from "@/components/turnstile";
import { isTurnstileRequiredForHost } from "@/lib/turnstile-env";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/components/app-provider";
import { UsernameAvailability } from "@/lib/types";
import { isReservedPublicUsername, normalizePublicUsername } from "@/lib/utils";

type AuthTab = "signin" | "signup";
type AuthStep = "form" | "verify" | "forgot" | "reset";

export default function AuthPage() {
  const router = useRouter();
  const {
    currentUser,
    isHydrated,
    isProfileComplete,
    signIn,
    signUp,
    verifyEmailCode,
    resendVerificationCode,
    requestPasswordReset,
    resetPassword,
    checkUsernameAvailability
  } = useAppState();
  const [tab, setTab] = useState<AuthTab>("signin");
  const [step, setStep] = useState<AuthStep>("form");
  const [loading, setLoading] = useState(false);
  const [resendingCode, setResendingCode] = useState(false);
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  // State untuk alur lupa password.
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState("");
  const [resetInfo, setResetInfo] = useState("");
  const [linkEdited, setLinkEdited] = useState(false);
  const [linkStatus, setLinkStatus] = useState<UsernameAvailability>({
    available: false,
    normalized: "",
    message: "Link publik kamu nanti jadi linkatalog.id/nama-link."
  });
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  });
  const [turnstileToken, setTurnstileToken] = useState("");
  // Default aktif supaya production aman sejak render pertama; di lokal dimatikan
  // setelah mount via efek di bawah.
  const [turnstileEnabled, setTurnstileEnabled] = useState(true);
  const turnstileRef = useRef<TurnstileHandle | null>(null);

  useEffect(() => {
    setTurnstileEnabled(isTurnstileRequiredForHost(window.location.hostname));
  }, []);

  function resetTurnstile() {
    turnstileRef.current?.reset();
    setTurnstileToken("");
  }

  useEffect(() => {
    if (isHydrated && currentUser) {
      // Penjual baru diarahkan ke halaman profil dulu sampai datanya lengkap,
      // baru boleh menambah produk.
      router.replace(isProfileComplete ? "/dashboard" : "/dashboard/profile");
    }
  }, [currentUser, isHydrated, isProfileComplete, router]);

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
        ? await signIn(form.email, form.password, turnstileToken)
        : await signUp({
            name: form.name,
            username: form.username,
            email: form.email,
            password: form.password,
            turnstileToken
          });

    setLoading(false);

    if (!result.success) {
      // Token Turnstile hanya sekali pakai — minta verifikasi ulang.
      resetTurnstile();
      if (result.requiresVerification && result.email) {
        setVerificationEmail(result.email);
        setStep("verify");
      }
      setError(result.message);
      return;
    }

    // Navigasi ditangani oleh useEffect berdasarkan kelengkapan profil.
  }

  async function handleVerify(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await verifyEmailCode(verificationEmail || form.email, verificationCode, form.password);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Navigasi ditangani oleh useEffect berdasarkan kelengkapan profil.
  }

  async function handleForgotSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResetInfo("");

    const result = await requestPasswordReset(resetEmail, turnstileToken);
    setLoading(false);
    // Token Turnstile sekali pakai — minta verifikasi ulang untuk step berikutnya.
    resetTurnstile();

    if (!result.success) {
      setError(result.message);
      return;
    }

    setResetInfo(result.message);
    setResetCode("");
    setResetPasswordValue("");
    setResetPasswordConfirm("");
    setStep("reset");
  }

  async function handleResetSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (resetPasswordValue.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }
    if (resetPasswordValue !== resetPasswordConfirm) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);
    const result = await resetPassword(resetEmail, resetCode, resetPasswordValue, turnstileToken);
    setLoading(false);
    // Token Turnstile sekali pakai — reset setelah submit.
    resetTurnstile();

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Sukses: kembali ke form sign in dengan email yang sama terisi.
    setForm((current) => ({ ...current, email: resetEmail, password: "" }));
    setResetCode("");
    setResetPasswordValue("");
    setResetPasswordConfirm("");
    setResetInfo("");
    setStep("form");
    setTab("signin");
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
          <Card className="hidden rounded-[2rem] border-brand/15 bg-gradient-to-br from-brand/18 via-brand/10 to-sky-500/10 p-8 text-foreground lg:block dark:border-white/10 dark:from-brand/22 dark:via-brand/16 dark:to-sky-500/14 dark:text-white">
            <h1 className="text-4xl font-semibold leading-tight">
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
              <p className="text-sm font-semibold text-foreground dark:text-white">Belum punya akun?</p>
              <p className="mt-2 text-sm text-muted dark:text-white/80">
                Daftar gratis dengan tab Sign up di samping. Pilih link katalog kamu sendiri, lalu mulai tambahkan
                produk pertama.
              </p>
            </div>
          </Card>

          <Card className="rounded-[2rem] p-6 sm:p-8">
            {step === "form" ? (
            <div className="flex rounded-full bg-surface-soft p-1">
              <button
                type="button"
                className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${tab === "signin" ? "bg-surface text-foreground shadow-card" : "text-muted"}`}
                onClick={() => {
                  setTab("signin");
                  setStep("form");
                  setError("");
                  resetTurnstile();
                }}
              >
                Sign in
              </button>
              <button
                type="button"
                className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${tab === "signup" ? "bg-surface text-foreground shadow-card" : "text-muted"}`}
                onClick={() => {
                  setTab("signup");
                  setStep("form");
                  setError("");
                  resetTurnstile();
                }}
              >
                Sign up
              </button>
            </div>
            ) : null}

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-foreground">
                {step === "verify"
                  ? "Verifikasi email kamu"
                  : step === "forgot"
                    ? "Lupa password"
                    : step === "reset"
                      ? "Atur password baru"
                      : tab === "signin"
                        ? "Masuk ke dashboard kamu"
                        : "Buat akun baru"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {step === "verify"
                  ? `Masukkan kode 6 digit yang dikirim ke ${verificationEmail || form.email}.`
                  : step === "forgot"
                    ? "Masukkan email akun kamu. Kami akan kirim kode untuk mengatur ulang password."
                    : step === "reset"
                      ? `Masukkan kode yang dikirim ke ${resetEmail} lalu buat password baru kamu.`
                      : tab === "signin"
                        ? "Lanjutkan edit katalog, cek klik WhatsApp, dan bagikan link kamu."
                        : "Pilih link katalog sendiri, atur profil sederhana, lalu tambahkan produk atau jasa pertama kamu."}
              </p>
            </div>

            {step === "verify" ? (
              <form className="mt-8 space-y-5" onSubmit={handleVerify}>
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-foreground">Kode verifikasi</span>
                  <Input
                    inputMode="numeric"
                    placeholder="Contoh: 482913"
                    value={verificationCode}
                    onChange={(event) =>
                      setVerificationCode(event.target.value.replace(/[^\d]/g, "").slice(0, 6))
                    }
                  />
                </label>

                {error ? (
                  <div className="rounded-2xl border border-warning/20 bg-warning/10 px-4 py-3 text-sm text-warning">
                    {error}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="submit" className="flex-1" size="lg" loading={loading}>
                    Verifikasi & masuk
                    {!loading ? <ArrowRightIcon className="h-4 w-4" /> : null}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    loading={resendingCode}
                    onClick={async () => {
                      setResendingCode(true);
                      setError("");
                      const result = await resendVerificationCode(verificationEmail || form.email);
                      setResendingCode(false);
                      if (!result.success) {
                        setError(result.message);
                      }
                    }}
                  >
                    Kirim ulang kode
                  </Button>
                </div>

                <button
                  type="button"
                  className="text-sm text-muted transition hover:text-foreground"
                  onClick={() => {
                    setStep("form");
                    setError("");
                    setVerificationCode("");
                  }}
                >
                  Kembali ke form
                </button>
              </form>
            ) : step === "forgot" ? (
              <form className="mt-8 space-y-5" onSubmit={handleForgotSubmit}>
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-foreground">Email akun kamu</span>
                  <Input
                    type="email"
                    placeholder="nama@bisnis.com"
                    value={resetEmail}
                    onChange={(event) => setResetEmail(event.target.value)}
                  />
                </label>

                {error ? (
                  <div className="rounded-2xl border border-warning/20 bg-warning/10 px-4 py-3 text-sm text-warning">
                    {error}
                  </div>
                ) : null}

                {turnstileEnabled ? (
                  <div className="space-y-2">
                    <Turnstile
                      ref={turnstileRef}
                      onVerify={(token) => setTurnstileToken(token)}
                      onExpire={() => setTurnstileToken("")}
                    />
                    {!turnstileToken ? (
                      <p className="text-xs leading-5 text-muted">
                        Selesaikan verifikasi keamanan dulu untuk mengaktifkan tombol.
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={loading}
                  disabled={!resetEmail.trim() || (turnstileEnabled && !turnstileToken)}
                >
                  Kirim kode reset
                  {!loading ? <ArrowRightIcon className="h-4 w-4" /> : null}
                </Button>

                <button
                  type="button"
                  className="text-sm text-muted transition hover:text-foreground"
                  onClick={() => {
                    setStep("form");
                    setTab("signin");
                    setError("");
                    resetTurnstile();
                  }}
                >
                  Kembali ke halaman masuk
                </button>
              </form>
            ) : step === "reset" ? (
              <form className="mt-8 space-y-5" onSubmit={handleResetSubmit}>
                {resetInfo ? (
                  <div className="rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
                    {resetInfo}
                  </div>
                ) : null}

                <label className="space-y-2 text-sm">
                  <span className="font-medium text-foreground">Kode reset</span>
                  <Input
                    inputMode="numeric"
                    placeholder="Contoh: 482913"
                    value={resetCode}
                    onChange={(event) => setResetCode(event.target.value.replace(/[^\d]/g, "").slice(0, 6))}
                  />
                </label>

                <label className="space-y-2 text-sm">
                  <span className="font-medium text-foreground">Password baru</span>
                  <Input
                    type="password"
                    placeholder="Minimal 8 karakter"
                    value={resetPasswordValue}
                    onChange={(event) => setResetPasswordValue(event.target.value)}
                  />
                </label>

                <label className="space-y-2 text-sm">
                  <span className="font-medium text-foreground">Ulangi password baru</span>
                  <Input
                    type="password"
                    placeholder="Ketik ulang password baru"
                    value={resetPasswordConfirm}
                    onChange={(event) => setResetPasswordConfirm(event.target.value)}
                  />
                </label>

                {error ? (
                  <div className="rounded-2xl border border-warning/20 bg-warning/10 px-4 py-3 text-sm text-warning">
                    {error}
                  </div>
                ) : null}

                {turnstileEnabled ? (
                  <div className="space-y-2">
                    <Turnstile
                      ref={turnstileRef}
                      onVerify={(token) => setTurnstileToken(token)}
                      onExpire={() => setTurnstileToken("")}
                    />
                    {!turnstileToken ? (
                      <p className="text-xs leading-5 text-muted">
                        Selesaikan verifikasi keamanan dulu untuk mengaktifkan tombol.
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={loading}
                  disabled={
                    resetCode.length < 6 ||
                    !resetPasswordValue ||
                    !resetPasswordConfirm ||
                    (turnstileEnabled && !turnstileToken)
                  }
                >
                  Simpan password baru
                  {!loading ? <ArrowRightIcon className="h-4 w-4" /> : null}
                </Button>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="text-sm text-muted transition hover:text-foreground"
                    onClick={() => {
                      setStep("forgot");
                      setError("");
                      resetTurnstile();
                    }}
                  >
                    Kirim ulang kode
                  </button>
                  <button
                    type="button"
                    className="text-sm text-muted transition hover:text-foreground"
                    onClick={() => {
                      setStep("form");
                      setTab("signin");
                      setError("");
                      resetTurnstile();
                    }}
                  >
                    Kembali ke masuk
                  </button>
                </div>
              </form>
            ) : (
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {tab === "signup" ? (
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-foreground">Nama brand atau nama kamu</span>
                  <Input
                    placeholder="Contoh: Kopi Arunika"
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
                      placeholder="kopi-arunika"
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

              {tab === "signin" ? (
                <div className="-mt-1 flex justify-end">
                  <button
                    type="button"
                    className="text-sm font-medium text-brand transition hover:underline"
                    onClick={() => {
                      setStep("forgot");
                      setError("");
                      setResetInfo("");
                      setResetEmail(form.email);
                      resetTurnstile();
                    }}
                  >
                    Lupa password?
                  </button>
                </div>
              ) : null}

              {error ? (
                <div className="rounded-2xl border border-warning/20 bg-warning/10 px-4 py-3 text-sm text-warning">
                  {error}
                </div>
              ) : null}

              {turnstileEnabled ? (
                <div className="space-y-2">
                  <Turnstile
                    ref={turnstileRef}
                    onVerify={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken("")}
                  />
                  {!turnstileToken ? (
                    <p className="text-xs leading-5 text-muted">
                      Selesaikan verifikasi keamanan dulu untuk mengaktifkan tombol.
                    </p>
                  ) : null}
                </div>
              ) : null}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
                disabled={turnstileEnabled && !turnstileToken}
              >
                {tab === "signin" ? "Masuk sekarang" : "Buat akun gratis"}
                {!loading ? <ArrowRightIcon className="h-4 w-4" /> : null}
              </Button>

              <p className="text-center text-sm text-muted">
                {tab === "signin" ? (
                  <>
                    Belum punya akun?{" "}
                    <button
                      type="button"
                      className="font-semibold text-brand transition hover:underline"
                      onClick={() => {
                        setTab("signup");
                        setStep("form");
                        setError("");
                        resetTurnstile();
                      }}
                    >
                      Daftar di sini
                    </button>
                  </>
                ) : (
                  <>
                    Sudah punya akun?{" "}
                    <button
                      type="button"
                      className="font-semibold text-brand transition hover:underline"
                      onClick={() => {
                        setTab("signin");
                        setStep("form");
                        setError("");
                        resetTurnstile();
                      }}
                    >
                      Masuk di sini
                    </button>
                  </>
                )}
              </p>
            </form>
            )}

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
