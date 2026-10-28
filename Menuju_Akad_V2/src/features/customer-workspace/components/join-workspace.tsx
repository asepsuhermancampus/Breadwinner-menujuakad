"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { BrandLogo } from "@/components/ui/brand-logo";
import { CardOrnament } from "@/components/ui/card-ornament";
import styles from "./join-workspace.module.css";
import { JoinedWorkspace } from "./joined-workspace";
type Invite = { ownerName: string; side: "groom" | "bride" | null; expiresAt: string };
export function JoinWorkspace({ token }: { token: string }) {
  const [destination, setDestination] = useState("");
  const [invite, setInvite] = useState<Invite | null>(null);
  const [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false);
  const [name, setName] = useState(""),
    [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/workspace/partner?token=${encodeURIComponent(token)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = (await response.json()) as { invite?: Invite; error?: string };
        if (!response.ok || !body.invite) throw Error(body.error ?? "Undangan tidak tersedia.");
        if (!controller.signal.aborted) setInvite(body.invite);
      })
      .catch((cause) => {
        if (!controller.signal.aborted)
          setError(cause instanceof Error ? cause.message : "Undangan belum dapat dimuat.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [token]);
  if (destination) return <JoinedWorkspace url={destination} />;
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <CardOrnament variant={2} />
        <Link href="/" className={styles.brand}>
          <BrandLogo variant="cypress" width={40} height={22} />
          Menuju Akad
        </Link>
        <div className={styles.heading}>
          <p>Undangan pasangan</p>
          <h1>Lengkapi profil pasangan</h1>
          {invite && (
            <p>{invite.ownerName} mengundang Anda untuk merencanakan hari istimewa bersama.</p>
          )}
        </div>
        {loading && <p role="status">Memuat undangan...</p>}
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        {invite && (
          <form
            className={styles.form}
            onSubmit={async (event) => {
              event.preventDefault();
              if (busy) return;
              setBusy(true);
              setError("");
              try {
                const response = await fetch("/api/workspace/partner", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    action: "accept",
                    token,
                    fullName: name.trim(),
                    nickname: nickname.trim(),
                  }),
                  signal: AbortSignal.timeout(20000),
                });
                const body = (await response.json()) as { error?: string };
                if (!response.ok)
                  throw Error(body.error ?? "Belum dapat bergabung. Silakan coba lagi.");
                setDestination(new URL("/account", window.location.origin).href);
              } catch (cause) {
                setError(cause instanceof Error ? cause.message : "Belum dapat bergabung.");
                setBusy(false);
              }
            }}
          >
            {invite.side && (
              <p className={styles.position}>
                Anda bergabung sebagai pasangan {invite.side === "bride" ? "wanita" : "pria"}.
              </p>
            )}
            <fieldset disabled={busy}>
              <Field
                label="Nama lengkap"
                required
                maxLength={160}
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <Field
                label="Nama panggilan"
                required
                maxLength={60}
                autoComplete="nickname"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
              />
              <p>
                Nama panggilan digunakan di dashboard. Anda dapat melengkapi foto setelah bergabung.
              </p>
              <Button type="submit">
                {busy ? "Menghubungkan..." : "Simpan profil & bergabung"}
              </Button>
            </fieldset>
          </form>
        )}
        <Link href="/dashboard" className={styles.back}>
          Buka dashboard
        </Link>
      </section>
    </main>
  );
}
