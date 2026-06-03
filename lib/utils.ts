import { ThemeAccent } from "@/lib/types";

export const reservedPublicUsernames = new Set([
  "api",
  "auth",
  "be-admin",
  "dashboard",
  "u"
]);

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

function parseDateValue(value: string | Date) {
  if (value instanceof Date) return value;

  const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(value)
    ? value.replace(" ", "T")
    : value;

  return new Date(normalized);
}

export function formatDateTime(value: string | Date) {
  const date = parseDateValue(value);

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function formatDateLabel(value: string | Date) {
  const date = parseDateValue(value);

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short"
  }).format(date);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizePublicUsername(input: string) {
  return slugify(input.replace(/^\/+/, ""));
}

export function isReservedPublicUsername(input: string) {
  return reservedPublicUsernames.has(normalizePublicUsername(input));
}

export function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function sanitizeWhatsappNumber(value: string) {
  const digits = value.replace(/[^\d]/g, "");

  if (!digits) return "";
  if (digits.startsWith("62")) return `0${digits.slice(2)}`;
  if (digits.startsWith("8")) return `0${digits}`;

  return digits;
}

export function toWhatsappDestinationNumber(value: string) {
  const localNumber = sanitizeWhatsappNumber(value);

  if (!localNumber) return "";
  if (localNumber.startsWith("0")) return `62${localNumber.slice(1)}`;
  if (localNumber.startsWith("8")) return `62${localNumber}`;

  return localNumber;
}

export function getWhatsappLink(whatsapp: string, productTitle?: string, ctaType?: string) {
  const digits = toWhatsappDestinationNumber(whatsapp);
  const message = buildWhatsappMessage(productTitle, ctaType);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * Template pesan WhatsApp yang menyesuaikan jenis aksi (produk/jasa).
 * Multi-baris, sopan, dan jelas agar penjual langsung paham maksud pembeli.
 */
export function buildWhatsappMessage(productTitle?: string, ctaType?: string): string {
  const footer = "\n\n(Dikirim lewat katalog Linkatalog.id)";

  // Tanpa item spesifik (tombol kontak umum di halaman).
  if (!productTitle) {
    return `Halo, saya melihat katalog Anda dan tertarik untuk mengetahui lebih lanjut. Boleh dibantu informasinya?${footer}`;
  }

  const item = `*${productTitle}*`;

  switch (ctaType) {
    case "booking":
      return (
        `Halo, saya ingin melakukan booking untuk:\n${item}\n\n` +
        `Boleh tahu jadwal yang masih tersedia? Saya siap menyesuaikan waktu dan melengkapi data yang diperlukan. Terima kasih!` +
        footer
      );
    case "consult":
      return (
        `Halo, saya tertarik dan ingin berkonsultasi dulu mengenai:\n${item}\n\n` +
        `Boleh dibantu penjelasan dan saran yang sesuai dengan kebutuhan saya? Terima kasih!` +
        footer
      );
    case "quote":
      return (
        `Halo, saya ingin meminta penawaran untuk:\n${item}\n\n` +
        `Mohon informasi estimasi harga, ketentuan, serta estimasi waktu pengerjaannya ya. Terima kasih!` +
        footer
      );
    default:
      // Order produk
      return (
        `Halo, saya ingin memesan:\n${item}\n\n` +
        `Apakah masih tersedia? Mohon info total harga dan cara pembayaran/pengirimannya ya. Terima kasih!` +
        footer
      );
  }
}

export function getAccentPalette(accent: ThemeAccent) {
  const palette = {
    emerald: {
      primary: "#0f766e",
      secondary: "#0d9488",
      soft: "#ccfbf1",
      border: "rgba(13, 148, 136, 0.2)",
      textOnPrimary: "#f8fafc"
    },
    sky: {
      primary: "#0369a1",
      secondary: "#0284c7",
      soft: "#dbeafe",
      border: "rgba(2, 132, 199, 0.2)",
      textOnPrimary: "#f8fafc"
    },
    coral: {
      primary: "#c2410c",
      secondary: "#ea580c",
      soft: "#ffedd5",
      border: "rgba(234, 88, 12, 0.2)",
      textOnPrimary: "#fff7ed"
    },
    amber: {
      primary: "#b45309",
      secondary: "#d97706",
      soft: "#fef3c7",
      border: "rgba(217, 119, 6, 0.2)",
      textOnPrimary: "#fffaf0"
    }
  };

  return palette[accent];
}

export function calculateProfileCompletion(input: {
  name?: string;
  username?: string;
  bio?: string;
  whatsapp?: string;
  profileImage?: string;
  location?: string;
  productCount?: number;
}) {
  const checks = [
    Boolean(input.name),
    Boolean(input.username),
    Boolean(input.bio),
    Boolean(input.whatsapp),
    Boolean(input.profileImage),
    Boolean(input.location),
    Boolean(input.productCount && input.productCount > 0)
  ];

  const completed = checks.filter(Boolean).length;

  return {
    completed,
    total: checks.length,
    percentage: Math.round((completed / checks.length) * 100)
  };
}

export function wait(ms = 450) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
