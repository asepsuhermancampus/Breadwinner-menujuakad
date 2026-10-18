"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { AccountAdapter, AccountSnapshot, PartnerProfile } from "../types/account";
import { PartnerInspector } from "./partner-inspector";
import { ProfileForm } from "./profile-form";
import styles from "./account.module.css";

export function ProfileScreen({
  initial,
  adapter,
}: {
  initial: AccountSnapshot;
  adapter: AccountAdapter;
}) {
  const [profile, setProfile] = useState(initial.profile);
  const [partner, setPartner] = useState<PartnerProfile | null>(initial.partner);
  const [inspector, setInspector] = useState(false);
  const expiry = initial.entitlement.expiresAt
    ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(
        new Date(initial.entitlement.expiresAt),
      )
    : "Tanpa kedaluwarsa";

  return (
    <div className={styles.stack}>
      <section aria-labelledby="role-access">
        <div className="mb-3 flex flex-wrap justify-between gap-3">
          <h2 id="role-access" className="text-sm font-semibold">
            Akses peran
          </h2>
          <span className={styles.finePrint}>Peran tambahan memerlukan persetujuan</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {initial.memberships.map((membership) => (
            <div key={membership.id} className="min-w-44 rounded-xl bg-subtle px-4 py-3">
              <p className="text-sm font-medium">{membership.label}</p>
              <p className={styles.finePrint}>{membership.detail}</p>
            </div>
          ))}
        </div>
      </section>
      <div className={styles.columns}>
        <ProfileForm profile={profile} adapter={adapter} onSaved={setProfile} />
        <aside className={styles.stack}>
          <section className={styles.panel}>
            <p className="text-sm text-secondary">Pasanganmu</p>
            <h2 className="mt-3">{partner?.fullName ?? "Rencanakan bersama"}</h2>
            <p className="mb-3 text-xs text-primary">
              {partner ? "● Terhubung" : "Belum terhubung"}
            </p>
            {partner && <p className="break-all text-xs text-secondary">{partner.email}</p>}
            <p className="my-5 text-xs text-secondary">
              {partner
                ? "2 akun · 1 shared workspace"
                : "Undang pasangan tanpa menggabungkan ruang lain."}
            </p>
            {partner ? (
              <Button variant="secondary" onClick={() => setInspector(true)} className="w-full">
                Kelola pasangan
              </Button>
            ) : (
              <Link
                href="/onboarding/partner"
                className="inline-flex min-h-11 items-center text-sm text-primary underline"
              >
                Undang pasangan
              </Link>
            )}
          </section>
          <section className="rounded-2xl bg-subtle p-6">
            <p className="text-xs font-semibold uppercase tracking-wider">
              Paket {initial.entitlement.plan}
            </p>
            <p className="mt-3 text-sm text-secondary">{expiry}</p>
            <p className={styles.description}>
              Jaga rencana tetap berjalan dengan memperpanjang paket atau akses Lifetime.
            </p>
            <Link
              href="/account/plans"
              className="mt-5 inline-flex min-h-11 items-center text-xs font-medium text-primary"
            >
              Kelola paket & upgrade ↗
            </Link>
          </section>
        </aside>
      </div>
      {partner && inspector && (
        <PartnerInspector
          open
          partner={partner}
          adapter={adapter}
          onClose={() => setInspector(false)}
          onSaved={setPartner}
          onUnlinked={() => setPartner(null)}
        />
      )}
    </div>
  );
}
