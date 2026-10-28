"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatRupiah } from "../domain/rupiah";
import { savingsName } from "../domain/savings-name";
import type { FinanceCommand, FinanceSnapshot, SavingsSide } from "../types/finance-ledger";
import { SavingsAdjustmentForm } from "./savings-adjustment-form";
import { SavingsReportButton } from "./savings-report-button";
import styles from "./customer-savings.module.css";
import ornamentStyles from "./savings-ornaments.module.css";
import { FinanceCardOrnament } from "./finance-card-ornament";
import controls from "./finance-controls.module.css";

export function CustomerSavings({
  snapshot,
  pending,
  error,
  onCommand,
  trial = false,
  onExport,
}: {
  snapshot: FinanceSnapshot;
  pending: boolean;
  error: string;
  onCommand: (command: FinanceCommand) => Promise<boolean>;
  trial?: boolean;
  onExport?: () => Promise<boolean>;
}) {
  const [editor, setEditor] = useState<{ side: SavingsSide; direction: "add" | "subtract" } | null>(
    null,
  );
  const [localError, setLocalError] = useState("");
  const [claiming, setClaiming] = useState(false);
  async function claim(side: SavingsSide) {
    if (pending || claiming) return;
    setClaiming(true);
    setLocalError("");
    try {
      if (!(await onCommand({ type: "claim", side })))
        setLocalError("Pilihan belum tersimpan. Periksa data terbaru lalu coba lagi.");
    } catch {
      setLocalError("Pilihan belum tersimpan. Silakan coba lagi.");
    } finally {
      setClaiming(false);
    }
  }
  return (
    <section
      className={styles.container}
      aria-label="Tabungan pasangan"
      aria-busy={pending || claiming}
    >
      <div className={`${styles.summary} ${ornamentStyles.summary}`}>
        <FinanceCardOrnament variant={2} />
        <div>
          <p>Total tabungan bersama</p>
          <strong>{formatRupiah(snapshot.balances.total)}</strong>
          <p>Saldo kalian untuk melangkah bersama.</p>
        </div>
        <SavingsReportButton
          snapshot={snapshot}
          pending={pending}
          trial={trial}
          {...(onExport ? { onExport } : {})}
          onError={setLocalError}
        />
      </div>
      {trial && (
        <p className={styles.notice}>
          Mode simulasi: pencatatan ini untuk mencoba fitur. Pembatasan dua akun memerlukan akun
          pasangan yang sudah masuk.
        </p>
      )}
      {!snapshot.actorSide && (
        <div className={styles.notice}>
          <p>
            Pilih peran akun ini satu kali. Setelah tersimpan, akun ini hanya dapat mengubah
            tabungannya sendiri. Pilihan tidak dapat diganti selama akun terhubung.
          </p>
          <div className={styles.actions}>
            {(["groom", "bride"] as const)
              .filter((side) => !snapshot.members.some((member) => member.side === side))
              .map((side) => (
                <Button
                  key={side}
                  variant="secondary"
                  className={controls.compact}
                  disabled={pending || claiming}
                  onClick={() => void claim(side)}
                >
                  Saya pasangan {side === "groom" ? "pria" : "wanita"}
                </Button>
              ))}
          </div>
        </div>
      )}
      {(error || localError) && !editor && (
        <p role="alert" className={styles.error}>
          {localError || error}
        </p>
      )}
      <div className={styles.columns}>
        {(["groom", "bride"] as const).map((side) => {
          const title = savingsName(snapshot, side);
          const name = snapshot.members.find((member) => member.side === side)?.actorName;
          const own = snapshot.actorSide === side;
          const entries = snapshot.entries
            .filter((entry) => entry.side === side)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
          return (
            <article key={side} className={`${styles.card} ${ornamentStyles.card}`}>
              <FinanceCardOrnament variant={own ? 3 : side === "groom" ? 4 : 1} />
              <div className={styles.cardHeading}>
                <Icon name="wallet" size={21} />
                <div>
                  <h3>{title}</h3>
                  <p>
                    {snapshot.sideNames?.[side]
                      ? own
                        ? "Tabungan pribadi"
                        : "Tabungan pasangan"
                      : name || "Belum terhubung"}
                  </p>
                </div>
                {own && <span className={styles.badge}>Tabungan saya</span>}
              </div>
              <strong className={styles.balance}>{formatRupiah(snapshot.balances[side])}</strong>
              {own ? (
                <div className={styles.actions}>
                  <Button
                    className={controls.compact}
                    disabled={pending}
                    onClick={() => setEditor({ side, direction: "add" })}
                  >
                    <Icon name="plus" size={16} />
                    Tambah
                  </Button>
                  <Button
                    variant="secondary"
                    className={controls.compact}
                    disabled={pending}
                    onClick={() => setEditor({ side, direction: "subtract" })}
                  >
                    Kurangi
                  </Button>
                </div>
              ) : (
                <p className={styles.muted}>
                  Hanya akun pasangan ini yang dapat menambah atau mengurangi tabungannya.
                </p>
              )}
              <h4 className={styles.historyHeading}>Riwayat tabungan</h4>
              <div
                className={`${styles.history} app-scroll`}
                role="region"
                aria-label={`Riwayat tabungan ${title.toLowerCase()}`}
                tabIndex={0}
              >
                {entries.length ? (
                  <ul>
                    {entries.map((entry) => (
                      <li key={entry.id}>
                        <time dateTime={entry.createdAt}>
                          {new Date(entry.createdAt).toLocaleDateString("id-ID", {
                            timeZone: "Asia/Jakarta",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                        <strong className={entry.amount < 0 ? styles.negative : styles.positive}>
                          {entry.amount < 0 ? "−" : entry.amount > 0 ? "+" : ""}
                          {formatRupiah(Math.abs(entry.amount))}
                        </strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.empty}>Belum ada riwayat tabungan.</p>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {editor && snapshot.actorSide === editor.side && (
        <SavingsAdjustmentForm
          {...editor}
          balance={snapshot.balances[editor.side]}
          pending={pending}
          error={error}
          onCommand={onCommand}
          onClose={() => setEditor(null)}
        />
      )}
    </section>
  );
}
