"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { CustomerWorkspace } from "../types";
import styles from "./partner-access.module.css";
import { sharePartnerLink } from "../domain/share-partner-link";
export function PartnerAccess({ workspace }: { workspace: CustomerWorkspace }) {
  const router = useRouter();
  const [invite, setInvite] = useState(""),
    [message, setMessage] = useState("");
  const [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const status = workspace.partnerAccess?.state ?? "locked";
  const partner = workspace.role === "partner",
    connected = status === "connected";
  async function act(action: "invite" | "revoke") {
    if (pending) return;
    setPending(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/workspace/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
        signal: AbortSignal.timeout(15000),
      });
      const body = (await response.json()) as { token?: string; error?: string };
      if (!response.ok) throw new Error(body.error ?? "Perubahan akses belum tersimpan.");
      if (body.token) {
        const link = new URL(`/join/${body.token}`, window.location.origin).href;
        setInvite(link);
        setMessage(await sharePartnerLink(link));
      } else {
        setInvite("");
        setMessage(
          "Akses dicabut. Profil pasangan kembali terkunci; riwayat keuangan tetap tersimpan.",
        );
      }
      router.refresh();
      window.dispatchEvent(new Event("workspace:membership-changed"));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Perubahan akses belum tersimpan.");
    } finally {
      setPending(false);
    }
  }
  return (
    <section className={styles.panel} aria-label="Workspace untuk berdua">
      <div className={styles.heading}>
        <h3>Workspace untuk berdua</h3>
        <p>
          {connected
            ? "Kalian terhubung dalam satu ruang perencanaan."
            : "Undang pasangan melalui tautan untuk melengkapi profil dan merencanakan bersama."}
        </p>
      </div>
      <p className={styles.accessStatus}>
        {connected
          ? "Pasangan terhubung"
          : status === "invited"
            ? "Menunggu pasangan bergabung"
            : "Pasangan belum terhubung"}
      </p>
      {partner ? (
        <>
          <p className={styles.description}>
            Kalian dapat mengelola rencana bersama dan menambah atau mengurangi tabungan milik
            sendiri.
          </p>
        </>
      ) : (
        <>
          <div className={styles.actions}>
            <Button
              variant={connected ? "danger" : "primary"}
              disabled={pending}
              onClick={() => void act(connected ? "revoke" : "invite")}
            >
              {pending
                ? "Memproses..."
                : connected
                  ? "Cabut akses pasangan"
                  : "Bagikan undangan pasangan"}
            </Button>
          </div>
          {invite && !connected && (
            <div className={styles.invitation}>
              <label className={styles.field}>
                Tautan undangan
                <textarea readOnly rows={3} className={styles.code} value={invite} />
              </label>
              <p className={styles.description}>
                Tautan berlaku 24 jam dan hanya dapat dipakai sekali.
              </p>
            </div>
          )}
          {status === "invited" && !invite && (
            <p className={styles.description}>
              Bagikan undangan agar pasangan dapat melengkapi profil dan bergabung.
            </p>
          )}
        </>
      )}
      {message && !connected && (
        <p role="status" className={styles.message}>
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </section>
  );
}
