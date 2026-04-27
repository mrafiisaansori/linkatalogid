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
import { THEME_STORAGE_KEY } from "@/lib/auth/session";
import { accentOptions } from "@/lib/sample-data";
import {
  AnalyticsSummary,
  Product,
  ProductInput,
  SellerSessionPayload,
  ThemeMode,
  ToastMessage,
  User,
  UsernameAvailability
} from "@/lib/types";
import { calculateProfileCompletion, generateId } from "@/lib/utils";

interface AppContextValue {
  theme: ThemeMode;
  currentUser: User | null;
  currentProducts: Product[];
  currentAnalytics: AnalyticsSummary;
  isHydrated: boolean;
  toasts: ToastMessage[];
  setTheme: (theme: ThemeMode) => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signUp: (input: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => Promise<{ success: boolean; message: string }>;
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
  const [isHydrated, setIsHydrated] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const applySessionPayload = useCallback((payload: SellerSessionPayload | null) => {
    if (!payload?.authenticated || !payload.user) {
      setCurrentUser(null);
      setCurrentProducts([]);
      setCurrentAnalytics(emptyAnalytics);
      return;
    }

    setCurrentUser(payload.user);
    setCurrentProducts(payload.products);
    setCurrentAnalytics(payload.analytics);
    setThemeState(payload.user.themePreference);
    localStorage.setItem(THEME_STORAGE_KEY, payload.user.themePreference);
  }, []);

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
    [currentUser]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({ email, password })
      });
      const data = await readJson<{
        success?: boolean;
        message?: string;
        data?: SellerSessionPayload;
      }>(response);

      if (!response.ok || !data?.success || !data.data) {
        return { success: false, message: data?.message ?? "Email atau password belum cocok." };
      }

      applySessionPayload(data.data);
      pushToast({ title: "Berhasil masuk", description: "Dashboard kamu sudah siap dipakai.", tone: "success" });
      return { success: true, message: data.message ?? "Berhasil masuk." };
    },
    [applySessionPayload, pushToast]
  );

  const signUp = useCallback(
    async ({ name, username, email, password }: { name: string; username: string; email: string; password: string }) => {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({ name, username, email, password })
      });
      const data = await readJson<{
        success?: boolean;
        message?: string;
        data?: SellerSessionPayload;
      }>(response);

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

      const response = await fetch("/api/me/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify(updates)
      });

      const data = await readJson<{ success?: boolean; message?: string; data?: User }>(response);
      if (!response.ok || !data?.success || !data.data) {
        return { success: false, message: data?.message ?? "Profil belum bisa diperbarui." };
      }

      setCurrentUser(data.data);
      if (updates.themePreference === "dark" || updates.themePreference === "light") {
        setThemeState(updates.themePreference);
      }
      pushToast({ title: "Profil diperbarui", description: "Perubahan profil sudah tersimpan.", tone: "success" });
      return { success: true, message: data.message ?? "Profil berhasil diperbarui." };
    },
    [currentUser, pushToast]
  );

  const saveProduct = useCallback(
    async (input: ProductInput) => {
      if (!currentUser) return { success: false, message: "Sesi belum aktif." };

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
    [currentUser, pushToast, refreshSession]
  );

  const deleteProduct = useCallback(
    (productId: string) => {
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
    [pushToast, refreshSession]
  );

  const toggleProduct = useCallback(
    (productId: string) => {
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
    [refreshSession]
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
      isHydrated,
      toasts,
      setTheme,
      signIn,
      signUp,
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
      isHydrated,
      toasts,
      setTheme,
      signIn,
      signUp,
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
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto rounded-3xl border border-line bg-surface/95 p-4 shadow-soft backdrop-blur"
          >
            <p className="text-sm font-semibold text-foreground">{toast.title}</p>
            {toast.description ? <p className="mt-1 text-sm text-muted">{toast.description}</p> : null}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within AppProvider");
  }
  return context;
}
