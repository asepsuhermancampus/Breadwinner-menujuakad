"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import styles from "./auth-form.module.css";
import { browserAuthDestination } from "../lib/return-to";

export function GoogleAuthButton({ disabled }: { disabled: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleLogin() {
    if (disabled || pending) return;
    try {
      setPending(true);
      setError(null);

      const statusRes = await fetch("/api/auth/status", {
        headers: { Accept: "application/json" },
      });
      if (!statusRes.ok) {
        throw new Error("status_unavailable");
      }
      const data = (await statusRes.json()) as { enabled?: boolean };
      if (!data.enabled) {
        setError("Layanan masuk dengan Google belum dikonfigurasi.");
        setPending(false);
        return;
      }

      await signIn("google", {
        redirectTo: browserAuthDestination(),
      });
    } catch {
      setError("Gagal menghubungi layanan autentikasi Google. Silakan coba kembali.");
      setPending(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="secondary"
        className={styles.google}
        disabled={disabled || pending}
        aria-busy={pending}
        onClick={() => void handleGoogleLogin()}
      >
        <span className={styles.googleMark} aria-hidden="true">
          G
        </span>
        {pending ? "Menghubungkan ke Google…" : "Lanjutkan dengan Google"}
      </Button>
      {error && <Status tone="danger">{error}</Status>}
    </div>
  );
}
