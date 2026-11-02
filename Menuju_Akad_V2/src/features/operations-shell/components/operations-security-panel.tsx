"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function OperationsSecurityPanel({
  email,
  superadmin = false,
}: {
  email: string;
  superadmin?: boolean;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 12) {
      setMessage({ type: "error", text: "Kata sandi baru minimal 12 karakter." });
      return;
    }
    if (newPassword !== confirmation) {
      setMessage({ type: "error", text: "Konfirmasi kata sandi tidak cocok." });
      return;
    }

    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/account/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          password: newPassword,
          confirmation,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Gagal mengubah kata sandi.");
      setMessage({ type: "success", text: "Kata sandi berhasil diperbarui." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    await signOut({ callbackUrl: superadmin ? "/superadmin/login" : "/login" });
  }

  return (
    <div className="space-y-6 max-w-4xl">
          <header className="rounded-card border border-ux-border bg-surface p-5 shadow-xs">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Keamanan Akun
            </h1>
            <p className="mt-1 text-xs text-secondary sm:text-sm">
              Autentikasi, kata sandi, dan sesi aktif.
            </p>
          </header>

          <section className="rounded-card border border-ux-border bg-surface p-5 shadow-xs space-y-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Icon name="shield" size={18} /> Informasi Akun & Akses
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
              <div className="rounded-control bg-canvas/40 p-3 border border-ux-border">
                <span className="text-secondary block">Email Terdaftar</span>
                <strong className="text-sm font-medium text-foreground">{email}</strong>
              </div>
              <div className="rounded-control bg-canvas/40 p-3 border border-ux-border">
                <span className="text-secondary block">Peran Operasional</span>
                <span className="inline-flex items-center gap-1.5 mt-0.5">
                  <span className="size-2 rounded-full bg-success" />
                  <strong className="text-sm font-medium text-brand-secondary">
                    {superadmin ? "Superadministrator" : "Administrator"}
                  </strong>
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-card border border-ux-border bg-surface p-5 shadow-xs space-y-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Icon name="settings" size={18} /> Ganti Kata Sandi
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-3 max-w-lg">
              <label className="grid gap-1 text-xs text-secondary">
                Kata Sandi Saat Ini
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="rounded-control border border-ux-border p-2 text-sm bg-surface"
                  required
                />
              </label>
              <label className="grid gap-1 text-xs text-secondary">
                Kata Sandi Baru (Minimal 12 karakter)
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-control border border-ux-border p-2 text-sm bg-surface"
                  minLength={12}
                  required
                />
              </label>
              <label className="grid gap-1 text-xs text-secondary">
                Konfirmasi Kata Sandi Baru
                <input
                  type="password"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  className="rounded-control border border-ux-border p-2 text-sm bg-surface"
                  minLength={12}
                  required
                />
              </label>

              {message && (
                <p
                  role="status"
                  className={`text-xs rounded-control p-2.5 ${message.type === "success"
                      ? "bg-success-bg text-success border border-success-border/40"
                      : "bg-danger-bg text-danger border border-danger-border/40"
                    }`}
                >
                  {message.text}
                </p>
              )}

              <Button type="submit" disabled={busy || !newPassword || !confirmation}>
                {busy ? "Menyimpan…" : "Perbarui Kata Sandi"}
              </Button>
            </form>
          </section>

          <section className="rounded-card border border-ux-border bg-surface p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Keluar dari Ruang Operasi</h2>
              <p className="mt-1 text-xs text-secondary">
                Akhiri sesi login akun pada perangkat ini.
              </p>
            </div>
            <Button variant="danger" onClick={() => void handleSignOut()}>
              Keluar (Sign Out)
            </Button>
          </section>
        </div>
        );
}

