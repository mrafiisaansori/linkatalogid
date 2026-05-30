"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CameraIcon, EyeIcon, LocationIcon, UserIcon, WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { accentOptions } from "@/lib/sample-data";
import { getAccentPalette, getWhatsappLink, normalizePublicUsername } from "@/lib/utils";
import { useAppState } from "@/components/app-provider";
import { ThemeAccent } from "@/lib/types";

type ProfileFormState = {
  name: string;
  username: string;
  bio: string;
  whatsapp: string;
  profileImage: string;
  location: string;
  themeAccent: ThemeAccent;
};

export default function DashboardProfilePage() {
  const { currentProducts, currentUser, updateProfile } = useAppState();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<ProfileFormState>({
    name: "",
    username: "",
    bio: "",
    whatsapp: "",
    profileImage: "",
    location: "",
    themeAccent: "emerald" as const
  });

  useEffect(() => {
    if (!currentUser) return;
    setForm({
      name: currentUser.name,
      username: currentUser.username,
      bio: currentUser.bio,
      whatsapp: currentUser.whatsapp,
      profileImage: currentUser.profileImage,
      location: currentUser.location,
      themeAccent: currentUser.themeAccent
    });
  }, [currentUser]);

  if (!currentUser) return null;

  const accent = getAccentPalette(form.themeAccent);

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });
      const data = await response.json();

      if (!response.ok || !data?.success || !data.url) {
        setError(data?.message ?? "Upload foto gagal.");
        return;
      }

      setForm((current) => ({ ...current, profileImage: data.url as string }));
    } catch {
      setError("Tidak bisa upload foto. Coba lagi.");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  }

  async function handleSave() {
    if (!form.name.trim() || !form.username.trim() || !form.bio.trim()) {
      setError("Nama, link katalog, dan bio wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");
    const result = await updateProfile(form);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
    }
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
      <Card className="rounded-[2rem] p-6">
        <div>
          <p className="text-lg font-semibold text-foreground">Edit profil</p>
          <p className="mt-1 text-sm text-muted">
            Isi informasi utama seller supaya halaman publik lebih meyakinkan dan mudah dihubungi.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          <div className="rounded-[1.75rem] border border-dashed border-line bg-background p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative h-20 w-20 shrink-0">
                {form.profileImage ? (
                  <img src={form.profileImage} alt={form.name} className="h-20 w-20 rounded-[1.5rem] object-cover" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-surface-soft text-muted">
                    <UserIcon className="h-8 w-8" />
                  </div>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-[1.5rem] bg-background/70 backdrop-blur-sm">
                    <svg className="h-7 w-7 animate-spin text-brand" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className="font-medium text-foreground">Foto profil</p>
                <p className="mt-1 text-sm text-muted">
                  Upload foto brand, logo, atau foto diri yang representatif.
                </p>
              </div>

              <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-soft ${uploadingImage ? "pointer-events-none opacity-60" : ""}`}>
                {uploadingImage ? (
                  <svg className="h-4 w-4 animate-spin text-brand" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <CameraIcon className="h-4 w-4" />
                )}
                {uploadingImage ? "Mengupload..." : "Upload foto"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
            </div>

            {!form.profileImage ? (
              <div className="mt-4">
                <EmptyState
                  icon={<CameraIcon className="h-6 w-6" />}
                  title="Belum ada foto profil"
                  description="Tambahkan foto supaya katalog publik terasa lebih personal dan terpercaya."
                />
              </div>
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-foreground">Nama</span>
              <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-foreground">Link katalog</span>
              <div className="flex min-h-12 items-stretch overflow-hidden rounded-2xl border border-line bg-background text-sm text-foreground transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10">
                <span className="flex items-center border-r border-line bg-surface-soft px-4 text-muted">/</span>
                <input
                  type="text"
                  placeholder="username-katalog"
                  value={form.username}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      username: normalizePublicUsername(event.target.value)
                    }))
                  }
                  className="min-h-12 w-full bg-transparent px-4 py-3 outline-none placeholder:text-muted"
                />
              </div>
              <p className="text-xs leading-5 text-muted">
                Link publik kamu jadi <span className="font-medium text-foreground">linkatalog.id/{form.username || "nama-link"}</span>
              </p>
            </label>
          </div>

          <label className="space-y-2 text-sm">
            <span className="font-medium text-foreground">Bio</span>
            <Textarea value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-foreground">Nomor WhatsApp</span>
              <Input
                placeholder="6281234567890"
                value={form.whatsapp}
                onChange={(event) => setForm((current) => ({ ...current, whatsapp: event.target.value }))}
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-foreground">Lokasi</span>
              <Input
                placeholder="Bandung, Jawa Barat"
                value={form.location}
                onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
              />
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground">Aksen tema</p>
              <p className="mt-1 text-sm text-muted">Pilih warna utama untuk highlight katalog publik kamu.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {accentOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={form.themeAccent === option.id}
                  className={`rounded-[1.5rem] border p-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20 ${form.themeAccent === option.id ? "border-brand shadow-card ring-2 ring-brand/30" : "border-line hover:border-brand/40"}`}
                  onClick={() => setForm((current) => ({ ...current, themeAccent: option.id }))}
                >
                  <div className="h-12 rounded-2xl" style={{ backgroundColor: option.color }} />
                  <p className="mt-3 text-sm font-medium text-foreground">{option.name}</p>
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-warning/20 bg-warning/10 px-4 py-3 text-sm font-medium text-warning"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-warning/20 text-[12px] font-bold">!</span>
              <span>{error}</span>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleSave} loading={loading}>
              Simpan perubahan
            </Button>
            <Link href={`/${currentUser.username}`} target="_blank">
              <Button variant="secondary">
                <EyeIcon className="h-4 w-4" />
                Preview halaman publik
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <Card className="rounded-[2rem] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-foreground">Preview profil publik</p>
            <p className="mt-1 text-sm text-muted">Perubahan profil akan terasa seperti ini di katalog kamu.</p>
          </div>
          <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: accent.soft, color: accent.primary }}>
            {accentOptions.find((o) => o.id === form.themeAccent)?.name ?? form.themeAccent}
          </span>
        </div>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-line bg-background shadow-card">
          <div
            className="p-6"
            style={{
              background: `linear-gradient(135deg, ${accent.soft}, rgba(255,255,255,0.5))`
            }}
          >
            <div className="flex items-start gap-4">
              {form.profileImage ? (
                <img src={form.profileImage} alt={form.name} className="h-20 w-20 rounded-[1.5rem] object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white/80 text-slate-700">
                  <UserIcon className="h-8 w-8" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-slate-900">{form.name || "Nama kamu"}</h3>
                <p className="mt-1 text-sm text-slate-600">@{form.username || "username"}</p>
                {form.location ? (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-sm text-slate-700">
                    <LocationIcon className="h-4 w-4" />
                    {form.location}
                  </div>
                ) : null}
              </div>
            </div>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-700">
              {form.bio || "Bio singkat brand akan tampil di sini."}
            </p>
          </div>

          <div className="space-y-4 p-6">
            {form.whatsapp ? (
              <a
                href={getWhatsappLink(form.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-[1.5rem] border border-line bg-surface px-4 py-3 transition hover:border-success"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success/10 text-success">
                    <WhatsAppIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">Hubungi via WhatsApp</p>
                    <p className="text-sm text-muted">{form.whatsapp}</p>
                  </div>
                </div>
                <span
                  className="rounded-full px-4 py-2 text-sm font-semibold"
                  style={{ backgroundColor: accent.primary, color: accent.textOnPrimary }}
                >
                  Chat
                </span>
              </a>
            ) : (
              <EmptyState
                icon={<WhatsAppIcon className="h-6 w-6" />}
                title="Nomor WhatsApp belum diisi"
                description="Isi nomor WhatsApp supaya semua produk bisa langsung dipesan dari halaman publik."
              />
            )}

            <div className="space-y-3">
              {currentProducts.slice(0, 3).map((product) => (
                <div key={product.id} className="flex gap-3 rounded-[1.5rem] border border-line bg-surface p-3">
                  <img src={product.imageUrl} alt={product.title} className="h-20 w-20 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{product.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{product.description}</p>
                  </div>
                </div>
              ))}
              {currentProducts.length === 0 ? (
                <EmptyState
                  icon={<UserIcon className="h-6 w-6" />}
                  title="Belum ada produk untuk preview"
                  description="Tambahkan produk atau jasa supaya halaman publik kamu langsung terlihat hidup."
                />
              ) : null}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
