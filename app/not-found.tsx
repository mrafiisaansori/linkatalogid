import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-xl rounded-[2rem] p-8 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Link yang kamu buka belum tersedia atau sudah dipindahkan.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button>Kembali ke beranda</Button>
          </Link>
          <Link href="/auth">
            <Button variant="secondary">Masuk ke dashboard</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
