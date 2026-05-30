"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { CameraIcon, CheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { demoImageOptions, productBadgeOptions, productCategorySuggestions } from "@/lib/sample-data";
import { Product, ProductInput } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: ProductInput) => Promise<{ success: boolean; message?: string }>;
  product?: Product | null;
}

const initialForm: ProductInput = {
  title: "",
  price: 0,
  description: "",
  imageUrl: "",
  badge: "",
  category: "",
  isActive: true
};

export function ProductModal({ open, onClose, onSubmit, product }: ProductModalProps) {
  const [form, setForm] = useState<ProductInput>(initialForm);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");

  const mode = product ? "edit" : "create";

  useEffect(() => {
    if (!open) return;
    setError("");
    setForm(
      product
        ? {
            id: product.id,
            title: product.title,
            price: product.price,
            description: product.description,
            imageUrl: product.imageUrl,
            badge: product.badge,
            category: product.category,
            isActive: product.isActive
          }
        : initialForm
    );
  }, [open, product]);

  function updateField<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

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
        setError(data?.message ?? "Upload gambar gagal.");
        return;
      }

      updateField("imageUrl", data.url as string);
    } catch {
      setError("Tidak bisa upload gambar. Coba lagi.");
    } finally {
      setUploadingImage(false);
      // Reset input agar file yang sama bisa di-upload ulang jika perlu
      event.target.value = "";
    }
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.description.trim() || !form.category.trim()) {
      setError("Judul, deskripsi, dan kategori wajib diisi.");
      return;
    }

    if (!form.imageUrl.trim()) {
      setError("Tambahkan gambar atau pilih cover demo untuk produk ini.");
      return;
    }

    setLoading(true);
    setError("");
    const result = await onSubmit(form);
    setLoading(false);

    if (result.success) {
      onClose();
      setForm(initialForm);
    } else {
      setError(result.message ?? "Produk belum bisa disimpan.");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "edit" ? "Edit produk atau jasa" : "Tambah produk atau jasa"}
      description="Lengkapi detail produk supaya katalog kamu makin meyakinkan."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-foreground">Judul</span>
              <Input
                placeholder="Contoh: Paket dessert box"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-foreground">Harga</span>
              <Input
                type="number"
                placeholder="35000"
                value={form.price || ""}
                onChange={(event) => updateField("price", Number(event.target.value))}
              />
            </label>
          </div>

          <label className="space-y-2 text-sm">
            <span className="font-medium text-foreground">Deskripsi</span>
            <Textarea
              placeholder="Jelaskan manfaat, detail paket, atau cara order singkat."
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-foreground">Kategori</span>
              <Input
                list="category-suggestion"
                placeholder="Makanan, jasa desain, dll"
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-foreground">Badge</span>
              <select
                className="h-12 w-full rounded-2xl border border-line bg-background px-4 text-sm text-foreground outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                value={form.badge}
                onChange={(event) => updateField("badge", event.target.value as ProductInput["badge"])}
              >
                {productBadgeOptions.map((option) => (
                  <option key={option || "none"} value={option}>
                    {option || "Tanpa badge"}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Gambar produk</p>
                <p className="text-sm text-muted">Upload gambar sendiri atau pilih cover demo.</p>
              </div>
              <label className={`relative inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-soft ${uploadingImage ? "pointer-events-none opacity-70" : ""}`}>
                {uploadingImage ? (
                  <svg className="h-4 w-4 animate-spin text-brand" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <CameraIcon className="h-4 w-4" />
                )}
                {uploadingImage ? "Mengupload..." : "Upload"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {demoImageOptions.map((image) => {
                const active = form.imageUrl === image;
                return (
                  <button
                    key={image}
                    type="button"
                    className={cn(
                      "group relative overflow-hidden rounded-3xl border p-2 transition",
                      active ? "border-brand shadow-card" : "border-line hover:border-brand/40"
                    )}
                    onClick={() => updateField("imageUrl", image)}
                  >
                    <img src={image} alt="" className="h-28 w-full rounded-2xl object-cover" />
                    {active ? (
                      <span className="absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">
                        <CheckIcon className="h-4 w-4" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-foreground">Atau pakai URL gambar</span>
              <Input
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(event) => updateField("imageUrl", event.target.value)}
              />
            </label>
          </div>

          <div className="flex items-center justify-between rounded-3xl border border-line bg-background px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Tampilkan di halaman publik</p>
              <p className="text-sm text-muted">Kalau nonaktif, produk tetap tersimpan tapi tidak tampil di katalog.</p>
            </div>
            <Switch checked={form.isActive} onChange={(checked) => updateField("isActive", checked)} />
          </div>

          <datalist id="category-suggestion">
            {productCategorySuggestions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>

        <div className="space-y-4 rounded-[1.75rem] border border-line bg-background p-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Preview kartu</p>
            <p className="mt-1 text-sm text-muted">Lihat hasilnya sebelum dipublikasikan.</p>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-card">
            <div className="relative aspect-[4/3] bg-surface-soft">
              {form.imageUrl ? (
                <img src={form.imageUrl} alt={form.title || "Preview produk"} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted">
                  <CameraIcon className="h-8 w-8" />
                </div>
              )}
              {uploadingImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 backdrop-blur-sm">
                  <svg className="h-8 w-8 animate-spin text-brand" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <p className="text-xs font-medium text-brand">Mengupload gambar...</p>
                </div>
              )}
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-foreground">
                    {form.title || "Judul produk kamu"}
                  </p>
                  <p className="text-sm text-muted">{form.category || "Kategori"}</p>
                </div>
                {form.badge ? <Badge>{form.badge}</Badge> : null}
              </div>
              <p className="text-sm leading-6 text-muted">
                {form.description || "Deskripsi singkat akan muncul di sini supaya calon pembeli lebih yakin."}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-foreground">
                  {formatCurrency(Number(form.price) || 0)}
                </p>
                <Badge tone={form.isActive ? "success" : "warning"}>
                  {form.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-warning/20 bg-warning/10 px-4 py-3 text-sm text-warning">
              {error}
            </div>
          ) : null}

          <Button className="w-full" loading={loading} onClick={handleSubmit}>
            {mode === "edit" ? "Simpan perubahan" : "Tambahkan ke katalog"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
