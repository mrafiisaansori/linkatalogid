"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";

const SCRIPT_ID = "cloudflare-turnstile";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onTurnstileApiLoad?: () => void;
  }
}

export interface TurnstileHandle {
  /** Reset widget supaya user harus verifikasi lagi. */
  reset: () => void;
}

interface TurnstileProps {
  /** Dipanggil dengan token saat verifikasi berhasil. */
  onVerify: (token: string) => void;
  /** Dipanggil saat token kedaluwarsa atau di-reset. */
  onExpire?: () => void;
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile?.render) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    window.onTurnstileApiLoad = () => resolve();

    if (existing) {
      if (window.turnstile?.render) resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `${SCRIPT_SRC}&onload=onTurnstileApiLoad`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Gagal memuat Turnstile."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(function Turnstile(
  { onVerify, onExpire },
  ref
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [error, setError] = useState(false);

  // Simpan callback terbaru tanpa me-render ulang widget.
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  onVerifyRef.current = onVerify;
  onExpireRef.current = onExpire;

  useImperativeHandle(ref, () => ({
    reset() {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        onExpireRef.current?.();
      }
    }
  }));

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) {
      setError(true);
      return;
    }

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || widgetIdRef.current !== null) return;
        if (!window.turnstile?.render) return;

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "auto",
          callback: (token: string) => onVerifyRef.current(token),
          "expired-callback": () => onExpireRef.current?.(),
          "error-callback": () => onExpireRef.current?.()
        });
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <p className="text-xs leading-5 text-warning">
        Verifikasi Turnstile tidak dapat dimuat. Periksa koneksi atau konfigurasi site key.
      </p>
    );
  }

  return <div ref={containerRef} className="min-h-[65px]" />;
});
