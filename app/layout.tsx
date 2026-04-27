import type { Metadata } from "next";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { AppProvider } from "@/components/app-provider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "LINK KATALOG",
  description: "Katalog jualan dalam 1 link. Tampilkan produk atau jasa, lalu terima order langsung via WhatsApp.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png"
  }
};

function ThemeBootstrapScript() {
  const script = `
    try {
      const theme = localStorage.getItem('${THEME_STORAGE_KEY}') === 'dark' ? 'dark' : 'light';
      if (theme === 'dark') document.documentElement.classList.add('dark');
    } catch (error) {}
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeBootstrapScript />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
