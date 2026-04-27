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

export function formatDateTime(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function formatDateLabel(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;

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
  return value.replace(/[^\d]/g, "");
}

export function getWhatsappLink(whatsapp: string, productTitle?: string) {
  const digits = sanitizeWhatsappNumber(whatsapp);
  const message = productTitle
    ? `Halo, saya mau order ${productTitle} dari Linkatalog.id`
    : "Halo, saya mau tanya katalog dari Linkatalog.id";

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
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
