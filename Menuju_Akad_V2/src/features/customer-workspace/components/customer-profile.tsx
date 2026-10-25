"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import type { CustomerWorkspace } from "../types";
import { PartnerAccess } from "./partner-access";
import styles from "@/features/account/components/account.module.css";
import visuals from "./customer-settings.module.css";
export function CustomerProfile({ workspace }: { workspace: CustomerWorkspace }) {
  const [name, setName] = useState(workspace.profile.fullName);
  const [partner, setPartner] = useState(workspace.profile.partnerName ?? "");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const canEdit = workspace.role === "owner";
  const expiry = workspace.subscription.expiresAt;
  return (
    <div className={styles.stack}>
      <section aria-labelledby="role-access">
        <div className="mb-3 flex flex-wrap justify-between gap-3">
          <h2 id="role-access" className="text-sm font-semibold">
            Akses peran
          </h2>
          <span className={styles.finePrint}>Ruang perencanaan kalian</span>
        </div>
        <div className={visuals.role}>
          <div>
            <p className="text-sm font-medium">Pasangan</p>
            <p className={styles.finePrint}>
              {canEdit ? "Pemilik ruang" : "Akses bersama pasangan"}
            </p>
          </div>
        </div>
      </section>
      <div className={styles.columns}>
        <form
          className={`${styles.panel} ${styles.stack}`}
          onSubmit={async (event) => {
            event.preventDefault();
            if (!canEdit || pending) return;
            setPending(true);
            setMessage("");
            try {
              const response = await fetch("/api/workspace", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName: name, partnerName: partner || null }),
              });
              const body = (await response.json()) as { error?: string };
              if (!response.ok) throw new Error(body.error ?? "Profil belum tersimpan");
              setMessage("Profil tersimpan.");
              router.refresh();
            } catch (cause) {
              setMessage(cause instanceof Error ? cause.message : "Profil gagal disimpan");
            } finally {
              setPending(false);
            }
          }}
        >
          <div className="flex flex-wrap justify-between gap-3">
            <h2>Profil pribadi</h2>
            <span className={styles.finePrint}>{canEdit ? "Pemilik ruang" : "Pasangan"}</span>
          </div>
          <Field
            label="Nama lengkap"
            name="fullName"
            value={name}
            autoComplete="name"
            maxLength={160}
            disabled={!canEdit || pending}
            onChange={(event) => setName(event.target.value)}
          />
          <Field
            label="Nama pasangan"
            name="partnerName"
            value={partner}
            maxLength={160}
            disabled={!canEdit || pending}
            onChange={(event) => setPartner(event.target.value)}
          />
          <p className={styles.finePrint}>
            {canEdit
              ? "Profil dapat dilengkapi kapan saja dan tidak menghalangi akses paket."
              : "Profil ruang dikelola oleh pemilik. Kalian tetap dapat merencanakan bersama."}
          </p>
          <div className={styles.actions}>
            <Button type="submit" disabled={pending || !canEdit}>
              {pending ? "Menyimpan…" : "Simpan perubahan"}
            </Button>
          </div>
          {message && (
            <p role="status" className={styles.finePrint}>
              {message}
            </p>
          )}
        </form>
        <aside className={styles.stack}>
          <section className={styles.panel}>
            <p className="text-sm text-secondary">Pasanganmu</p>
            <h2 className="mt-3">{workspace.profile.partnerName || "Rencanakan bersama"}</h2>
            <p className={styles.finePrint}>
              Dua akun, satu ruang perencanaan. Kelola undangan dan akses pasangan.
            </p>
            <details className={visuals.partnerDetails}>
              <summary>Kelola pasangan</summary>
              <PartnerAccess partner={workspace.role === "partner"} />
            </details>
          </section>
          <section className={visuals.planSummary}>
            <p className="text-xs font-semibold uppercase tracking-wider">
              Paket {workspace.subscription.planId}
            </p>
            <p className={styles.description}>
              {expiry
                ? `Aktif hingga ${new Date(expiry).toLocaleDateString("id-ID", { dateStyle: "long" })}`
                : "Tanpa kedaluwarsa"}
            </p>
            <p className={styles.finePrint}>
              Jaga rencana tetap berjalan dengan dukungan yang pas untuk kalian.
            </p>
            <Link href="/account/plans" className={visuals.textLink}>
              Kelola paket & upgrade ↗
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
