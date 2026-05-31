"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";

const SCRIPT_ID = "google-recaptcha-v2";
const SCRIPT_SRC = "https://www.google.com/recaptcha/api.js?render=explicit";

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string;
          theme?: "light" | "dark";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
      reset: (widgetId?: number) => void;
    };
    onRecaptchaApiLoad?: () => void;
  }
}

export interface RecaptchaHandle {
  /** Reset the widget so the user must solve it again. */
  reset: () => void;
}

interface RecaptchaProps {
  /** Called with the token when the user solves the challenge. */
  onVerify: (token: string) => void;
  /** Called when the token expires or is reset. */
  onExpire?: () => void;
}

let scriptPromise: Promise<void> | null = null;

function loadRecaptchaScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.grecaptcha?.render) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    window.onRecaptchaApiLoad = () => resolve();

    if (existing) {
      if (window.grecaptcha?.render) resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `${SCRIPT_SRC}&onload=onRecaptchaApiLoad`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Gagal memuat reCAPTCHA."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export const Recaptcha = forwardRef<RecaptchaHandle, RecaptchaProps>(function Recaptcha(
  { onVerify, onExpire },
  ref
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [error, setError] = useState(false);

  // Keep latest callbacks without re-rendering the widget.
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  onVerifyRef.current = onVerify;
  onExpireRef.current = onExpire;

  useImperativeHandle(ref, () => ({
    reset() {
      if (widgetIdRef.current !== null && window.grecaptcha) {
        window.grecaptcha.reset(widgetIdRef.current);
        onExpireRef.current?.();
      }
    }
  }));

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      setError(true);
      return;
    }

    let cancelled = false;

    loadRecaptchaScript()
      .then(() => {
        if (cancelled || !containerRef.current || widgetIdRef.current !== null) return;
        if (!window.grecaptcha?.render) return;

        const isDark =
          typeof document !== "undefined" &&
          document.documentElement.classList.contains("dark");

        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          theme: isDark ? "dark" : "light",
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
    };
  }, []);

  if (error) {
    return (
      <p className="text-xs leading-5 text-warning">
        reCAPTCHA tidak dapat dimuat. Periksa koneksi atau konfigurasi site key.
      </p>
    );
  }

  return <div ref={containerRef} className="min-h-[78px]" />;
});
