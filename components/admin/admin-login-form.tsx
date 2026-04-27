"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockIcon, ShieldIcon, UserIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({
          username,
          password
        })
      });

      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) {
        setError(payload?.message ?? "Login admin belum berhasil.");
        return;
      }

      router.push("/be-admin/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="admin-username" className="text-sm font-medium text-foreground">
          Username
        </label>
        <div className="relative">
          <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            id="admin-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Masukkan username admin"
            autoComplete="username"
            className="pl-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="admin-password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <div className="relative">
          <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Masukkan password admin"
            autoComplete="current-password"
            className="pl-11"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-[1.25rem] border border-warning/20 bg-warning/10 px-4 py-3 text-sm text-warning">
          {error}
        </div>
      ) : null}

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        <ShieldIcon className="h-4 w-4" />
        Masuk ke admin panel
      </Button>
    </form>
  );
}
