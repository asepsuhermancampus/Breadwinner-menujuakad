"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useAccountOperation } from "../hooks/use-account-operation";
import type { AccountAdapter, NotificationPreferences } from "../types/account";
import { OperationFeedback } from "./operation-feedback";
import styles from "./account.module.css";
import security from "./security.module.css";

type PreferenceKey = Exclude<keyof NotificationPreferences, "version">;

const notificationFields: [PreferenceKey, string, string][] = [
  ["inApp", "Notifikasi di aplikasi", "Semua pembaruan dalam satu tempat"],
  ["email", "Pengingat email", "Ringkasan mingguan & tenggat penting"],
  ["whatsApp", "Pengingat WhatsApp", "Tugas mendesak & konfirmasi pembayaran"],
  ["reducedMotion", "Kurangi gerakan", "Minimalkan animasi & efek dekoratif"],
];

export function PreferencesForm({
  initial,
  adapter,
  onSaved,
}: {
  initial: NotificationPreferences;
  adapter: AccountAdapter;
  onSaved: (preferences: NotificationPreferences) => void;
}) {
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const mutation = useAccountOperation();
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  function toggle(key: PreferenceKey) {
    setDraft((current) => ({ ...current, [key]: !current[key] }));
  }

  function row(key: PreferenceKey, label: string, hint: string) {
    return (
      <label key={key} className={security.toggleRow}>
        <span>
          <span className={security.toggleLabel}>{label}</span>
          <span className={styles.finePrint}>{hint}</span>
        </span>
        <input
          type="checkbox"
          role="switch"
          checked={draft[key]}
          disabled={mutation.pending}
          onChange={() => toggle(key)}
        />
      </label>
    );
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { inApp, email, whatsApp, reducedMotion, partnerSync, discoverable } = draft;
    const values = { inApp, email, whatsApp, reducedMotion, partnerSync, discoverable };
    const result = await mutation.run(
      () => adapter.savePreferences({ ...values, expectedVersion: saved.version }),
      "Preferensi disimpan pada pratinjau. Tidak ada pesan yang dikirim.",
    );
    if (result.ok) {
      setDraft(result.data);
      setSaved(result.data);
      onSaved(result.data);
    }
  }

  return (
    <form onSubmit={save} data-reduced-motion={draft.reducedMotion}>
      <div className={security.preferenceColumns}>
        <section className={styles.panel} aria-labelledby="notification-preferences">
          <h2 id="notification-preferences">Kabar yang ingin kamu terima</h2>
          <p className={styles.description}>Pengingat tugas, pembayaran, dan aktivitas pasangan.</p>
          <div className="mt-4">
            {notificationFields.map(([key, label, hint]) => row(key, label, hint))}
          </div>
        </section>
        <section className={styles.panel} aria-labelledby="privacy-preferences">
          <h2 id="privacy-preferences">Ruang yang tetap pribadi</h2>
          {row(
            "partnerSync",
            "Sinkronisasi pasangan",
            "Berbagi pembaruan dengan pasangan terhubung",
          )}
          {row(
            "discoverable",
            "Profil dapat ditemukan",
            "Izinkan profil muncul pada pencarian publik",
          )}
          <p className={styles.finePrint}>
            Preferensi pratinjau tidak memberikan izin kirim kepada provider atau menambah akses
            pasangan.
          </p>
        </section>
      </div>
      <OperationFeedback feedback={mutation.feedback} />
      <div className={styles.actions}>
        {dirty && <span className={styles.finePrint}>Perubahan belum disimpan</span>}
        <Button
          type="submit"
          disabled={!dirty || mutation.pending}
          className="bg-foreground text-white hover:bg-foreground/90"
        >
          {mutation.pending ? "Menyimpan…" : "Simpan preferensi"}
        </Button>
      </div>
    </form>
  );
}
