"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { DEMO_DRAFT_STORAGE_KEY, DemoDraftState, parseDemoDraft } from "@/lib/demo-draft";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { accentOptions } from "@/lib/sample-data";
import {
  AnalyticsSummary,
  AuthActionResult,
  Product,
  ProductInput,
  SellerSessionPayload,
  ThemeMode,
  ToastMessage,
  User,
  UsernameAvailability
} from "@/lib/types";
import {
  calculateProfileCompletion,
  cn,
  generateId,
  isReservedPublicUsername,
  normalizePublicUsername,
  sanitizeWhatsappNumber
} from "@/lib/utils";

interface AppContextValue {
  theme: ThemeMode;
  currentUser: User | null;
  currentProducts: Product[];
  currentAnalytics: AnalyticsSummary;
  isDemoMode: boolean;
  isHydrated: boolean;
  toasts: ToastMessage[];
  setTheme: (theme: ThemeMode) => void;
  signIn: (email: string, password: string, turnstileToken?: string) => Promise<AuthActionResult>;
  signUp: (input: {
    name: string;
    username: string;
    email: string;
    password: string;
    turnstileToken?: string;
  }) => Promise<AuthActionResult>;
  verifyEmailCode: (email: string, code: string, password?: string) => Promise<AuthActionResult>;
  resendVerificationCode: (email: string) => Promise<AuthActionResult>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message: string }>;
  saveProduct: (input: ProductInput) => Promise<{ success: boolean; message: string }>;
  deleteProduct: (productId: string) => void;
  toggleProduct: (productId: string) => void;
  copyPublicLink: (username?: string) => Promise<string | null>;
  checkUsernameAvailability: (username: string) => Promise<UsernameAvailability>;
  pushToast: (toast: Omit<ToastMessage, "id">) => void;
  profileCompletion: { completed: number; total: number; percentage: number };
  accentOptions: typeof accentOptions;
}

const AppContext = createContext<AppContextValue | null>(null);

const emptyAnalytics: AnalyticsSummary = { views: 0, whatsappClicks: 0, productViews: 0 };

async function readJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [currentAnalytics, setCurrentAnalytics] = useState<AnalyticsSummary>(emptyAnalytics);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const readDemoDraft = useCallback((): DemoDraftState | null => {
    if (typeof window === "undefined") return null;
    return parseDemoDraft(localStorage.getItem(DEMO_DRAFT_STORAGE_KEY));
  }, []);

  const persistDemoDraft = useCallback((draft: DemoDraftState | null) => {
    if (typeof window === "undefined") return;

    try {
      if (!draft) {
        localStorage.removeItem(DEMO_DRAFT_STORAGE_KEY);
        return;
      }

      localStorage.setItem(DEMO_DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Demo draft persistence should not block the UI.
    }
  }, []);

  const commitDemoState = useCallback(
    ({
      user,
      products,
      analytics
    }: {
      user: User;
      products: Product[];
      analytics: AnalyticsSummary;
    }) => {
      setCurrentUser(user);
      setCurrentProducts(products);
      setCurrentAnalytics(analytics);
      setThemeState(user.themePreference);
      localStorage.setItem(THEME_STORAGE_KEY, user.themePreference);
      persistDemoDraft({
        user,
        products,
        analytics,
        updatedAt: new Date().toISOString()
      });
    },
    [persistDemoDraft]
  );

  const applySessionPayload = useCallback((payload: SellerSessionPayload | null) => {
    setIsDemoMode(Boolean(payload?.demoMode));

    if (!payload?.authenticated || !payload.user) {
      setCurrentUser(null);
      setCurrentProducts([]);
      setCurrentAnalytics(emptyAnalytics);
      return;
    }

    let nextUser = payload.user;
    let nextProducts = payload.products;
    let nextAnalytics = payload.analytics;

    if (payload.demoMode) {
      const draft = readDemoDraft();
      if (draft && draft.user.id === payload.user.id) {
        nextUser = draft.user;
        nextProducts = draft.products;
        nextAnalytics = draft.analytics;
      } else {
        persistDemoDraft({
          user: payload.user,
          products: payload.products,
          analytics: payload.analytics,
          updatedAt: new Date().toISOString()
        });
      }
    }

    setCurrentUser(nextUser);
    setCurrentProducts(nextProducts);
    setCurrentAnalytics(nextAnalytics);
    setThemeState(nextUser.themePreference);
    localStorage.setItem(THEME_STORAGE_KEY, nextUser.themePreference);
  }, [persistDemoDraft, readDemoDraft]);

  const refreshSession = useCallback(async () => {
    const response = await fetch("/api/me", {
      credentials: "same-origin",
      cache: "no-store"
    });
    const payload = await readJson<SellerSessionPayload>(response);
    applySessionPayload(payload);
    return payload;
  }, [applySessionPayload]);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "dark" || savedTheme === "light") {
      setThemeState(savedTheme);
    } else if (document.documentElement.classList.contains("dark")) {
      setThemeState("dark");
    }

    void refreshSession().finally(() => {
      setIsHydrated(true);
    });
  }, [refreshSession]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const pushToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const nextToast = { id: generateId("toast"), ...toast };
    setToasts((current) => [...current, nextToast]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== nextToast.id));
    }, 3200);
  }, []);

  const setTheme = useCallback(
    (nextTheme: ThemeMode) => {
      setThemeState(nextTheme);

      if (isDemoMode && currentUser) {
        commitDemoState({
          user: {
            ...currentUser,
            themePreference: nextTheme,
            updatedAt: new Date().toISOString()
          },
          products: currentProducts,
          analytics: currentAnalytics
        });
        return;
      }

      if (currentUser) {
        void fetch("/api/me/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "same-origin",
          body: JSON.stringify({ themePreference: nextTheme })
        }).then(async (response) => {
          if (!response.ok) return;
          const data = await readJson<{ data?: User }>(response);
          if (data?.data) {
            setCurrentUser(data.data);
          }
        });
      }
    },
    [commitDemoState, currentAnalytics, currentProducts, currentUser, isDemoMode]
  );

  const signIn = useCallback(
    async (email: string, password: string, turnstileToken?: string) => {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({ email, password, turnstileToken })
      });
      const data = await readJson<{
        success?: boolean;
        message?: string;
        data?: SellerSessionPayload;
        requiresVerification?: boolean;
        email?: string;
      }>(response);

      if (!response.ok || !data?.success || !data.data) {
        return {
          success: false,
          message: data?.message ?? "Email atau password belum cocok.",
          requiresVerification: data?.requiresVerification,
          email: data?.email
        };
      }

      applySessionPayload(data.data);
      pushToast({ title: "Berhasil masuk", description: "Dashboard kamu sudah siap dipakai.", tone: "success" });
      return { success: true, message: data.message ?? "Berhasil masuk." };
    },
    [applySessionPayload, pushToast]
  );

  const signUp = useCallback(
    async ({ name, username, email, password, turnstileToken }: { name: string; username: string; email: string; password: string; turnstileToken?: string }) => {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({ name, username, email, password, turnstileToken })
      });
      const data = await readJson<{
        success?: boolean;
        message?: string;
        data?: SellerSessionPayload;
        requiresVerification?: boolean;
        email?: string;
      }>(response);

      if (data?.requiresVerification) {
        return {
          success: false,
          message: data.message ?? "Kode verifikasi sudah dikirim ke email kamu.",
          requiresVerification: true,
          email: data.email ?? email
        };
      }

      if (!response.ok || !data?.success || !data.data) {
        return { success: false, message: data?.message ?? "Akun belum bisa dibuat." };
      }

      applySessionPayload(data.data);
      pushToast({
        title: "Akun berhasil dibuat",
        description: "Lengkapi profil lalu tambahkan produk pertama kamu.",
        tone: "success"
      });
      return { success: true, message: data.message ?? "Akun berhasil dibuat." };
    },
    [applySessionPayload, pushToast]
  );

  const verifyEmailCode = useCallback(
    async (email: string, code: string, password?: string) => {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({ email, code })
      });

      const data = await readJson<{ success?: boolean; message?: string }>(response);
      if (!response.ok || !data?.success) {
        return { success: false, message: data?.message ?? "Kode verifikasi belum cocok." };
      }

      pushToast({
        title: "Email terverifikasi",
        description: "Akun kamu sudah aktif dan siap dipakai.",
        tone: "success"
      });

      if (password) {
        return signIn(email, password);
      }

      return { success: true, message: data.message ?? "Verifikasi email berhasil." };
    },
    [pushToast, signIn]
  );

  const resendVerificationCode = useCallback(async (email: string) => {
    const response = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin",
      body: JSON.stringify({ email })
    });
    const data = await readJson<{ success?: boolean; message?: string }>(response);

    if (!response.ok || !data?.success) {
      return { success: false, message: data?.message ?? "Kode verifikasi belum bisa dikirim ulang." };
    }

    pushToast({
      title: "Kode dikirim ulang",
      description: "Cek inbox email kamu untuk kode terbaru.",
      tone: "success"
    });
    return { success: true, message: data.message ?? "Kode verifikasi berhasil dikirim ulang." };
  }, [pushToast]);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "same-origin"
    });
    setCurrentUser(null);
    setCurrentProducts([]);
    setCurrentAnalytics(emptyAnalytics);
    pushToast({ title: "Kamu sudah keluar", description: "Masuk lagi kapan saja.", tone: "default" });
  }, [pushToast]);

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      if (!currentUser) return { success: false, message: "Sesi belum aktif." };

      const normalizedUpdates: Partial<User> = {
        ...updates,
        ...(typeof updates.username === "string"
          ? { username: normalizePublicUsername(updates.username) }
          : {}),
        ...(typeof updates.whatsapp === "string"
          ? { whatsapp: sanitizeWhatsappNumber(updates.whatsapp) }
          : {})
      };

      if (isDemoMode) {
        const nextUsername =
          typeof normalizedUpdates.username === "string" ? normalizedUpdates.username : currentUser.username;

        if (!nextUsername) {
          return { success: false, message: "Link anda wajib diisi." };
        }

        if (isReservedPublicUsername(nextUsername)) {
          return { success: false, message: "Link ini tidak tersedia. Coba pakai nama lain." };
        }

        const nextThemePreference =
          updates.themePreference === "dark" || updates.themePreference === "light"
            ? updates.themePreference
            : currentUser.themePreference;

        const nextUser: User = {
          ...currentUser,
          ...normalizedUpdates,
          username: nextUsername,
          whatsapp:
            typeof normalizedUpdates.whatsapp === "string" ? normalizedUpdates.whatsapp : currentUser.whatsapp,
          themePreference: nextThemePreference,
          updatedAt: new Date().toISOString()
        };

        commitDemoState({
          user: nextUser,
          products: currentProducts,
          analytics: currentAnalytics
        });
        pushToast({
          title: "Draft profil tersimpan",
          description: "Mode demo Vercel: perubahan hanya tersimpan di browser ini.",
          tone: "success"
        });
        return { success: true, message: "Draft profil berhasil diperbarui." };
      }

      const response = await fetch("/api/me/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify(normalizedUpdates)
      });

      const data = await readJson<{ success?: boolean; message?: string; data?: User }>(response);
      if (!response.ok || !data?.success || !data.data) {
        return { success: false, message: data?.message ?? "Profil belum bisa diperbarui." };
      }

      setCurrentUser(data.data);
      if (normalizedUpdates.themePreference === "dark" || normalizedUpdates.themePreference === "light") {
        setThemeState(normalizedUpdates.themePreference);
      }
      pushToast({ title: "Profil diperbarui", description: "Perubahan profil sudah tersimpan.", tone: "success" });
      return { success: true, message: data.message ?? "Profil berhasil diperbarui." };
    },
    [commitDemoState, currentAnalytics, currentProducts, currentUser, isDemoMode, pushToast]
  );

  const saveProduct = useCallback(
    async (input: ProductInput) => {
      if (!currentUser) return { success: false, message: "Sesi belum aktif." };

      if (isDemoMode) {
        const title = input.title.trim();
        const description = input.description.trim();
        const category = input.category.trim();
        const imageUrl = input.imageUrl.trim();

        if (!title || !description || !category || !imageUrl) {
          return { success: false, message: "Judul, deskripsi, kategori, dan gambar wajib diisi." };
        }

        const existing = input.id ? currentProducts.find((item) => item.id === input.id) : null;
        const now = new Date().toISOString();
        const nextProduct: Product = {
          id: existing?.id ?? generateId("demo-product"),
          userId: currentUser.id,
          ownerName: currentUser.name,
          ownerUsername: currentUser.username,
          title,
          price: Number(input.price) || 0,
          description,
          imageUrl,
          badge: input.badge,
          category,
          isActive: input.isActive,
          createdAt: existing?.createdAt ?? now,
          updatedAt: now
        };

        const nextProducts = existing
          ? currentProducts.map((item) => (item.id === existing.id ? nextProduct : item))
          : [nextProduct, ...currentProducts];

        commitDemoState({
          user: currentUser,
          products: nextProducts,
          analytics: currentAnalytics
        });
        pushToast({
          title: input.id ? "Draft produk diperbarui" : "Draft produk ditambahkan",
          description: "Mode demo Vercel: perubahan hanya tersimpan di browser ini.",
          tone: "success"
        });
        return { success: true, message: "Draft produk berhasil disimpan." };
      }

      const response = await fetch(input.id ? `/api/me/products/${input.id}` : "/api/me/products", {
        method: input.id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify(input)
      });
      const data = await readJson<{ success?: boolean; message?: string }>(response);

      if (!response.ok || !data?.success) {
        return { success: false, message: data?.message ?? "Produk belum bisa disimpan." };
      }

      await refreshSession();
      pushToast({
        title: input.id ? "Produk diperbarui" : "Produk ditambahkan",
        description: input.id
          ? "Katalog publik kamu langsung ikut ter-update."
          : "Produk baru sudah tampil di dashboard.",
        tone: "success"
      });
      return { success: true, message: data.message ?? "Produk berhasil disimpan." };
    },
    [commitDemoState, currentAnalytics, currentProducts, currentUser, isDemoMode, pushToast, refreshSession]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      if (isDemoMode && currentUser) {
        const nextProducts = currentProducts.filter((item) => item.id !== productId);
        commitDemoState({
          user: currentUser,
          products: nextProducts,
          analytics: currentAnalytics
        });
        pushToast({
          title: "Draft produk dihapus",
          description: "Mode demo Vercel: perubahan hanya tersimpan di browser ini.",
          tone: "warning"
        });
        return;
      }

      void (async () => {
        const response = await fetch(`/api/me/products/${productId}`, {
          method: "DELETE",
          credentials: "same-origin"
        });
        const data = await readJson<{ success?: boolean; message?: string }>(response);
        if (!response.ok || !data?.success) return;

        await refreshSession();
        pushToast({ title: "Produk dihapus", description: "Item sudah keluar dari katalog.", tone: "warning" });
      })();
    },
    [commitDemoState, currentAnalytics, currentProducts, currentUser, isDemoMode, pushToast, refreshSession]
  );

  const toggleProduct = useCallback(
    (productId: string) => {
      if (isDemoMode && currentUser) {
        const nextProducts = currentProducts.map((item) =>
          item.id === productId ? { ...item, isActive: !item.isActive, updatedAt: new Date().toISOString() } : item
        );
        commitDemoState({
          user: currentUser,
          products: nextProducts,
          analytics: currentAnalytics
        });
        return;
      }

      void (async () => {
        const response = await fetch(`/api/me/products/${productId}/toggle`, {
          method: "POST",
          credentials: "same-origin"
        });
        const data = await readJson<{ success?: boolean }>(response);
        if (!response.ok || !data?.success) return;
        await refreshSession();
      })();
    },
    [commitDemoState, currentAnalytics, currentProducts, currentUser, isDemoMode, refreshSession]
  );

  const copyPublicLink = useCallback(
    async (username?: string) => {
      const fallbackUsername = username ?? currentUser?.username;
      if (!fallbackUsername || typeof window === "undefined") return null;

      const url = `${window.location.origin}/${fallbackUsername}`;
      try {
        await navigator.clipboard.writeText(url);
        pushToast({ title: "Link berhasil disalin", description: url, tone: "success" });
      } catch {
        pushToast({
          title: "Salin link manual",
          description: url,
          tone: "warning"
        });
      }
      return url;
    },
    [currentUser?.username, pushToast]
  );

  const checkUsernameAvailability = useCallback(async (username: string) => {
    const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`, {
      cache: "no-store"
    });
    const data = await readJson<UsernameAvailability>(response);

    return (
      data ?? {
        available: false,
        normalized: username,
        message: "Belum bisa cek link sekarang."
      }
    );
  }, []);

  const profileCompletion = calculateProfileCompletion({
    name: currentUser?.name,
    username: currentUser?.username,
    bio: currentUser?.bio,
    whatsapp: currentUser?.whatsapp,
    profileImage: currentUser?.profileImage,
    location: currentUser?.location,
    productCount: currentProducts.length
  });

  const value = useMemo<AppContextValue>(
    () => ({
      theme,
      currentUser,
      currentProducts,
      currentAnalytics,
      isDemoMode,
      isHydrated,
      toasts,
      setTheme,
      signIn,
      signUp,
      verifyEmailCode,
      resendVerificationCode,
      signOut,
      updateProfile,
      saveProduct,
      deleteProduct,
      toggleProduct,
      copyPublicLink,
      checkUsernameAvailability,
      pushToast,
      profileCompletion,
      accentOptions
    }),
    [
      theme,
      currentUser,
      currentProducts,
      currentAnalytics,
      isDemoMode,
      isHydrated,
      toasts,
      setTheme,
      signIn,
      signUp,
      verifyEmailCode,
      resendVerificationCode,
      signOut,
      updateProfile,
      saveProduct,
      deleteProduct,
      toggleProduct,
      copyPublicLink,
      checkUsernameAvailability,
      pushToast,
      profileCompletion
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-3 top-3 z-[60] flex flex-col gap-2 pt-[env(safe-area-inset-top)] sm:left-auto sm:right-4 sm:top-4 sm:w-full sm:max-w-sm sm:pt-0"
        role="region"
        aria-label="Notifikasi"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "toast-item pointer-events-auto flex items-start gap-3 rounded-[1.5rem] border p-3.5 shadow-lg backdrop-blur-md sm:p-4",
              toast.tone === "success"
                ? "border-success/30 bg-success/10 text-success"
                : toast.tone === "warning"
                ? "border-warning/30 bg-warning/10 text-warning"
                : "border-line bg-surface/95"
            )}
          >
            <span className={cn(
              "mt-0.5 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-bold",
              toast.tone === "success" ? "bg-success text-white" :
              toast.tone === "warning" ? "bg-warning text-white" :
              "bg-brand text-white"
            )}>
              {toast.tone === "success" ? "✓" : toast.tone === "warning" ? "!" : "i"}
            </span>
            <div className="min-w-0 flex-1">
              <p className={cn("text-sm font-semibold", toast.tone ? "" : "text-foreground")}>{toast.title}</p>
              {toast.description ? <p className={cn("mt-0.5 break-words text-xs leading-5", toast.tone ? "opacity-80" : "text-muted")}>{toast.description}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Tutup notifikasi"
              className={cn(
                "-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base leading-none transition hover:bg-foreground/10",
                toast.tone ? "opacity-70 hover:opacity-100" : "text-muted hover:text-foreground"
              )}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

// Hook akses state aplikasi.
export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within AppProvider");
  }
  return context;
}
