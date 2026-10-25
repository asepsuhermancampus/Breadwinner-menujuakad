"use client";
import { useEffect, useState, type FormEvent } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SecretField } from "./secret-field";
export function AccountSecurity() {
  const router = useRouter();
  const [info, setInfo] = useState<{ hasPassword: boolean; googleLinked: boolean } | null>(null);
  const [current, setCurrent] = useState(""),
    [password, setPassword] = useState(""),
    [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    let live = true;
    void fetch("/api/account/security", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error);
        if (live) setInfo(body);
      })
      .catch(() => {
        if (live) setMessage("Pengaturan belum dapat dimuat. Muat ulang halaman.");
      });
    return () => {
      live = false;
    };
  }, []);
  async function save(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    window.dispatchEvent(new Event("dashboard:signout-start"));
    try {
      await fetch("/api/reviews/identity", { cache: "no-store" });
      const response = await fetch("/api/account/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, password, confirmation }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error);
      await signOut({ redirect: false });
      router.replace("/login");
      router.refresh();
    } catch (error) {
      window.dispatchEvent(new Event("dashboard:signout-cancel"));
      setMessage(error instanceof Error ? error.message : "Belum dapat menyimpan.");
      setBusy(false);
    }
  }
  async function link() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      await fetch("/api/reviews/identity", { cache: "no-store" });
      const response = await fetch("/api/account/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "link" }),
      });
      if (!response.ok) throw new Error("Belum dapat menghubungkan Google.");
      await signIn("google", { redirectTo: "/account/security" });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Coba kembali.");
      setBusy(false);
    }
  }
  return (
    <section className="max-w-lg space-y-5 rounded-card border border-ux-border bg-surface p-6">
      <h2 className="text-xl font-semibold">Keamanan akun</h2>
      <p className="text-sm text-secondary">
        Setelah password disimpan, semua sesi akan berakhir. Masuk kembali dengan password baru.
      </p>
      {info && (
        <form onSubmit={(event) => void save(event)} className="grid gap-4">
          {info.hasPassword && (
            <SecretField
              kind="password"
              name="currentPassword"
              label="Password saat ini"
              value={current}
              onChange={setCurrent}
            />
          )}
          <SecretField
            kind="password"
            name="password"
            label="Password baru"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
          <SecretField
            kind="password"
            name="confirmation"
            label="Konfirmasi password"
            value={confirmation}
            onChange={setConfirmation}
            autoComplete="new-password"
          />
          <p className="text-xs text-secondary">Gunakan 12–128 karakter.</p>
          <Button type="submit" disabled={busy}>
            Simpan password
          </Button>
        </form>
      )}
      {info && (
        <p className="text-sm">
          {info.googleLinked
            ? "Akun Google sudah terhubung."
            : "Hubungkan akun Google dengan alamat email yang sama."}
        </p>
      )}
      {info && !info.googleLinked && (
        <Button variant="secondary" disabled={busy} onClick={() => void link()}>
          Hubungkan Google
        </Button>
      )}
      {message && (
        <p role="alert" className="text-sm text-danger">
          {message}
        </p>
      )}
    </section>
  );
}
