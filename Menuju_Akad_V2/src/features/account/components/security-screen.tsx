"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { AccountAdapter, AccountSnapshot } from "../types/account";
import { downloadPersonalExport } from "../utils/personal-export";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { DeviceSessions } from "./device-sessions";
import { PreferencesForm } from "./preferences-form";
import styles from "./account.module.css";
import security from "./security.module.css";

export function SecurityScreen({
  initial,
  adapter,
}: {
  initial: AccountSnapshot;
  adapter: AccountAdapter;
}) {
  const [deleting, setDeleting] = useState(false);
  const [preferences, setPreferences] = useState(initial.preferences);
  return (
    <div className={styles.stack}>
      <PreferencesForm initial={initial.preferences} adapter={adapter} onSaved={setPreferences} />
      <section className={styles.panel}>
        <h2>Keamanan masuk</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/auth/recovery"
            className="inline-flex min-h-11 items-center text-sm text-primary underline"
          >
            Ubah kata sandi / PIN →
          </Link>
          <Button
            variant="ghost"
            onClick={() => downloadPersonalExport({ ...initial, preferences })}
          >
            Unduh salinan data pribadi →
          </Button>
        </div>
        <p className={styles.finePrint}>
          Unduhan hanya berisi data pribadi simulasi; tidak menyertakan data akun pasangan.
        </p>
      </section>
      <DeviceSessions initial={initial.sessions} adapter={adapter} />
      <section className={security.dangerZone}>
        <div>
          <h2>Hapus akun</h2>
          <p className={styles.description}>
            Tindakan permanen. Unduh data dan beri tahu pasangan sebelum melanjutkan.
          </p>
        </div>
        <Button variant="danger" onClick={() => setDeleting(true)}>
          Hapus akun…
        </Button>
      </section>
      {deleting && (
        <DeleteAccountDialog
          open
          onClose={() => setDeleting(false)}
          adapter={adapter}
          verificationHint={initial.verificationHint}
        />
      )}
    </div>
  );
}
