import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg p-8 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <p className="mt-4 text-sm text-muted">Menyiapkan pengalaman Linkatalog.id...</p>
      </Card>
    </main>
  );
}
