"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdminUserStatusToggle({
  userId,
  isActive
}: {
  userId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({
          isActive: !isActive
        })
      });

      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) {
        window.alert(payload?.message ?? "Status user belum berhasil diubah.");
        return;
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={isActive ? "outline" : "primary"}
      onClick={handleToggle}
      loading={loading}
    >
      {isActive ? "Nonaktifkan" : "Aktifkan"}
    </Button>
  );
}
