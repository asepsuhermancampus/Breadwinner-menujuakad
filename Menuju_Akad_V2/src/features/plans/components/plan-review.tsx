"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Status } from "@/components/ui/status";
import type { PlanOption } from "../config/plan-options";
import type { PlanAdapter, PlanEntitlement } from "../types/plans";
import { entitlementLabel } from "../utils/entitlement";
import styles from "./plans.module.css";

export function PlanReview({
  option,
  entitlement,
  adapter,
  onClose,
}: {
  option: PlanOption;
  entitlement: PlanEntitlement;
  adapter: PlanAdapter;
  onClose: () => void;
}) {
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [feedback, setFeedback] = useState<{ failed: boolean; message: string } | null>(null);

  async function request() {
    if (busy.current || option.id === "free") return;
    busy.current = true;
    setPending(true);
    setFeedback(null);
    try {
      const result = await adapter.requestPlanChange({ plan: option.id });
      setFeedback({
        failed: !result.ok,
        message: result.ok ? result.data.message : result.message,
      });
    } catch {
      setFeedback({
        failed: true,
        message: "Belum tersambung. Pilihan tetap tersimpan; coba lagi.",
      });
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return (
    <Dialog
      open
      onClose={() => {
        if (!pending) onClose();
      }}
      title={`Tinjau paket ${option.label}`}
    >
      <div className="grid gap-4">
        <Status>
          Paket aktif: {entitlementLabel(entitlement)}. Pilihan ini belum mengubah hak aksesmu.
        </Status>
        <p className="text-sm leading-7 text-secondary">
          {option.id === "free"
            ? "Pilihan Free tidak membatalkan masa Premium yang masih aktif. Tidak ada perubahan paket pada pratinjau ini."
            : "Ini simulasi permintaan upgrade. Tidak ada tagihan atau pembayaran nyata. Entitlement tetap mengikuti status yang terverifikasi."}
        </p>
        <p className="text-sm text-secondary">
          Vendor, custom domain, dan Wedding Kit tetap mengikuti ketersediaan rilis layanan.
        </p>
        {option.id !== "free" && (
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={acknowledged}
              className="m-3 h-5 w-5 accent-primary"
              disabled={pending}
              onChange={(event) => setAcknowledged(event.target.checked)}
            />
            Saya memahami ini simulasi dan paket aktif belum berubah.
          </label>
        )}
        {feedback && (
          <Status tone={feedback.failed ? "danger" : "success"}>{feedback.message}</Status>
        )}
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Tutup
          </Button>
          {option.id !== "free" && (
            <Button onClick={() => void request()} disabled={!acknowledged || pending}>
              {pending ? "Memproses…" : "Simulasikan permintaan"}
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
