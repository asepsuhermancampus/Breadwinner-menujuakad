"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { EventFinanceContext } from "../types/finance";
import styles from "./finance.module.css";

type Props = {
  eventContext: EventFinanceContext;
  onToggleContext: () => void;
  onOpenRecordExpense: () => void;
  onOpenRecordDeposit: () => void;
};

export function FinanceHeader({
  eventContext,
  onToggleContext,
  onOpenRecordExpense,
  onOpenRecordDeposit,
}: Props) {
  const isWedding = eventContext === "wedding";

  return (
    <div className={styles.headerRow}>
      <div className={styles.titleArea}>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className={styles.title}>
            {isWedding ? "Dana jelas, rencana tenang." : "Satu lamaran, satu rencana dana."}
          </h1>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {isWedding ? "Pernikahan (Akad & Resepsi)" : "Mode Lamaran"}
          </span>
        </div>
        <p className={styles.subtitle}>
          {isWedding
            ? "Pernikahan · 14 Februari 2027 · catatan per 25 Oktober 2026"
            : "Lamaran · 22 November 2026 · tidak digabung dengan tabungan pernikahan"}
        </p>
      </div>

      <div className={styles.actionsGroup}>
        <Button
          variant="secondary"
          size="small"
          onClick={onToggleContext}
          className="flex items-center gap-1.5"
          aria-label={isWedding ? "Beralih ke Mode Lamaran" : "Beralih ke Mode Pernikahan"}
        >
          <Icon name="calendar" size={14} />
          <span>{isWedding ? "Lihat Lamaran" : "Lihat Pernikahan"}</span>
        </Button>
        {isWedding && (
          <>
            <Button
              variant="secondary"
              size="small"
              onClick={onOpenRecordDeposit}
              className="flex items-center gap-1.5"
            >
              <Icon name="wallet" size={14} />
              <span>Catat setoran</span>
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={onOpenRecordExpense}
              className="flex items-center gap-1.5"
            >
              <Icon name="plus" size={14} />
              <span>Catat pengeluaran</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
