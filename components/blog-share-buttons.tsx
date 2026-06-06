"use client";

import { useState } from "react";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/icons";

interface BlogShareButtonsProps {
  title: string;
  url: string;
}

function encoded(value: string) {
  return encodeURIComponent(value);
}

export function BlogShareButtons({ title, url }: BlogShareButtonsProps) {
  const [status, setStatus] = useState("");
  const shareText = `${title} - Linkatalog`;

  async function copyLink(label = "Link") {
    try {
      await navigator.clipboard.writeText(url);
      setStatus(`${label} disalin.`);
    } catch {
      setStatus("Salin link manual dari address bar browser.");
    }
  }

  async function nativeShare() {
    if (!navigator.share) {
      await copyLink("Link artikel");
      return;
    }

    try {
      await navigator.share({ title, text: shareText, url });
      setStatus("Artikel siap dibagikan.");
    } catch {
      setStatus("");
    }
  }

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encoded(`${shareText} ${url}`)}`,
      icon: <WhatsAppIcon className="h-4 w-4 text-success" />
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encoded(url)}&text=${encoded(shareText)}`,
      icon: <span className="text-xs font-bold text-brand">TG</span>
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded(url)}`,
      icon: <span className="text-xs font-bold text-brand">FB</span>
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encoded(shareText)}&url=${encoded(url)}`,
      icon: <span className="text-xs font-bold text-brand">X</span>
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded(url)}`,
      icon: <span className="text-xs font-bold text-brand">IN</span>
    }
  ];

  return (
    <section className="mt-12 rounded-[1.5rem] border border-line/80 bg-surface/95 p-5 shadow-soft backdrop-blur-xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Bagikan artikel</h2>
          <p className="mt-1 text-sm leading-6 text-muted">Kirim ke pelanggan, tim, atau simpan untuk konten sosial.</p>
        </div>
        <button
          type="button"
          onClick={nativeShare}
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-strong"
        >
          Share
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {links.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-soft"
          >
            {item.icon}
            {item.label}
          </a>
        ))}

        <button
          type="button"
          onClick={() => copyLink("Link untuk Instagram")}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-soft"
        >
          <InstagramIcon className="h-4 w-4 text-brand" />
          Instagram
        </button>

        <button
          type="button"
          onClick={() => copyLink("Link untuk TikTok")}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-soft"
        >
          <TikTokIcon className="h-4 w-4 text-foreground" />
          TikTok
        </button>

        <button
          type="button"
          onClick={() => copyLink("Link artikel")}
          className="inline-flex min-h-10 items-center rounded-full border border-line bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-soft"
        >
          Salin link
        </button>
      </div>

      {status ? <p className="mt-3 text-xs font-medium text-brand">{status}</p> : null}
    </section>
  );
}
