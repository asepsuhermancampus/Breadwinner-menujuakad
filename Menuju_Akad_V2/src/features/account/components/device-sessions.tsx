"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useAccountOperation } from "../hooks/use-account-operation";
import type { AccountAdapter, DeviceSession } from "../types/account";
import { OperationFeedback } from "./operation-feedback";
import styles from "./account.module.css";
import security from "./security.module.css";

export function DeviceSessions({
  initial,
  adapter,
}: {
  initial: DeviceSession[];
  adapter: AccountAdapter;
}) {
  const [sessions, setSessions] = useState(initial);
  const [selected, setSelected] = useState<string[]>([]);
  const mutation = useAccountOperation();
  const others = sessions.filter((session) => !session.current);

  async function revoke() {
    const result = await mutation.run(
      () => adapter.revokeSessions({ ids: selected }),
      "Sesi perangkat dicabut pada pratinjau.",
    );
    if (result.ok) {
      setSessions(result.data);
      setSelected([]);
    }
  }

  return (
    <section className={styles.panel} aria-labelledby="device-sessions">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 id="device-sessions">Perangkat & sesi aktif</h2>
        <Button
          variant="ghost"
          disabled={!others.length || mutation.pending}
          onClick={() => setSelected(others.map((session) => session.id))}
        >
          Keluar dari perangkat lain
        </Button>
      </div>
      {!sessions.length && <p className={styles.description}>Tidak ada sesi perangkat lain.</p>}
      {sessions.map((session) => (
        <div key={session.id} className={security.session}>
          <div>
            <p className="text-sm font-medium">{session.label}</p>
            <p className={styles.finePrint}>
              {session.location} · {session.current ? "Perangkat ini" : session.lastActive}
            </p>
          </div>
          {session.current ? (
            <span className="text-xs text-brand-secondary">● Aktif sekarang</span>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setSelected([session.id])}
              disabled={mutation.pending}
            >
              Keluar
            </Button>
          )}
        </div>
      ))}
      <OperationFeedback feedback={mutation.feedback} />
      <Dialog
        open={selected.length > 0}
        onClose={() => {
          if (!mutation.pending) setSelected([]);
        }}
        title="Keluar dari perangkat?"
      >
        <p className={styles.description}>
          {selected.length} sesi akan dicabut. Perangkat tersebut perlu masuk kembali. Sesi
          perangkat ini tetap aktif.
        </p>
        <OperationFeedback feedback={mutation.feedback} />
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => setSelected([])} disabled={mutation.pending}>
            Batalkan
          </Button>
          <Button variant="danger" onClick={() => void revoke()} disabled={mutation.pending}>
            {mutation.pending ? "Mencabut sesi…" : "Ya, keluar"}
          </Button>
        </div>
      </Dialog>
    </section>
  );
}
