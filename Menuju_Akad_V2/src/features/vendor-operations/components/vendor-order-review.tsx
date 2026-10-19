"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import { decideVendorOrder } from "../domain/vendor-operations";
import type {
  DecisionInput,
  VendorContext,
  VendorOrder,
  VendorResult,
  VendorWorkspace,
} from "../types/vendor";

export function VendorOrderReview({
  state,
  context,
  order,
  action,
  reason,
  onResult,
  onClose,
}: {
  state: VendorWorkspace;
  context: VendorContext;
  order: VendorOrder;
  action: "accept" | "reject";
  reason: string;
  onResult: (result: VendorResult) => void;
  onClose: () => void;
}) {
  const [intent] = useState<DecisionInput>(() => ({
    orderId: order.id,
    action,
    reason: reason.trim(),
    expectedOrderVersion: order.version,
    expectedVersion: state.version,
    operationId: crypto.randomUUID(),
    acknowledged: false,
  }));
  const [acknowledged, setAcknowledged] = useState(false);
  const [checked, setChecked] = useState("");
  const [result, setResult] = useState<VendorResult | null>(null);
  const [checkError, setCheckError] = useState("");
  const currentOrder = state.orders.find((item) => item.id === intent.orderId);
  const fingerprint = JSON.stringify([
    state.version,
    currentOrder?.version,
    context.latestVersion,
    context.slotAvailable,
    context.online,
    context.sessionValid,
    context.role,
    context.vendorId,
    context.actorId,
    context.permissions.orderDecide,
    context.availability,
    context.sandbox,
  ]);
  const allowed =
    context.permissions.orderDecide &&
    context.sessionValid &&
    context.online &&
    context.role === "vendor" &&
    context.vendorId === state.vendorId &&
    (context.sandbox || context.availability === "live");
  const fresh =
    state.version === intent.expectedVersion &&
    currentOrder?.version === intent.expectedOrderVersion &&
    context.latestVersion === state.version &&
    currentOrder?.status === "pending";
  const slotReady = action === "reject" || context.slotAvailable;
  const rechecked = checked === fingerprint && allowed && fresh && slotReady;
  function recheck() {
    setResult(null);
    setAcknowledged(false);
    if (!allowed) {
      setCheckError("Akses, sesi, atau koneksi belum siap. Keputusan belum disimpan.");
      setChecked("");
      return;
    }
    if (!fresh) {
      setCheckError(
        "Versi pesanan berubah. Tutup dialog dan tinjau ulang detail terbaru sebelum membuat keputusan.",
      );
      setChecked("");
      return;
    }
    if (!slotReady) {
      setCheckError(
        "Slot tidak tersedia. Item belum diterima; tinjau ulang jadwal sebelum melanjutkan.",
      );
      setChecked("");
      return;
    }
    setCheckError("");
    setChecked(fingerprint);
  }
  function confirm() {
    if (!rechecked || !acknowledged) return;
    const outcome = decideVendorOrder(state, { ...intent, acknowledged }, context);
    setResult(outcome);
    onResult(outcome);
    if (outcome.ok) onClose();
  }
  return (
    <Dialog
      open
      title={action === "accept" ? "Konfirmasi penerimaan item" : "Konfirmasi penolakan item"}
      onClose={onClose}
    >
      <div className="grid gap-5">
        <div className="rounded-card border border-border p-4">
          <p className="font-mono text-xs text-secondary">
            {intent.orderId} · kontrak v{order.contract.version}
          </p>
          <h3 className="mt-2 font-semibold">
            {order.client} · {order.contract.packageName}
          </h3>
          <p className="mt-2 font-mono text-sm">{formatIdr(order.contract.priceIdr)}</p>
          <p className="mt-2 text-xs text-secondary">Keputusan hanya untuk item terpilih.</p>
        </div>
        {action === "reject" && (
          <div className="rounded-control bg-danger/5 p-4">
            <h3 className="text-xs font-semibold">Alasan penolakan</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{intent.reason}</p>
          </div>
        )}
        <section className="grid gap-3 rounded-control bg-canvas p-4">
          <h3 className="text-sm font-semibold">Periksa kembali sebelum memutuskan</h3>
          <p className="text-xs leading-relaxed text-secondary">
            Validasi lokal akan membaca ulang slot, hak akses, dan versi item pada saat konfirmasi.
          </p>
          <Button variant="secondary" onClick={recheck}>
            <Icon name="refresh" size={16} />
            Periksa ulang slot & versi
          </Button>
          {rechecked && (
            <p
              role="status"
              className="flex items-start gap-2 text-xs leading-relaxed text-success"
            >
              <Icon name="check-circle" size={14} />
              Versi sesuai.{" "}
              {action === "accept"
                ? "Slot tersedia untuk item ini."
                : "Item masih menunggu keputusan."}
            </p>
          )}
          {checked && !rechecked && (
            <p role="alert" className="text-xs text-warning">
              Kondisi berubah. Periksa ulang sebelum mengonfirmasi.
            </p>
          )}
          {checkError && (
            <p role="alert" className="text-xs text-danger">
              {checkError}
            </p>
          )}
        </section>
        <label className="flex items-start gap-3 text-xs leading-relaxed">
          <input
            type="checkbox"
            checked={acknowledged}
            disabled={!rechecked}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 shrink-0"
          />
          Saya telah membaca kontrak dan deliverables, meninjau slot, serta memahami keputusan{" "}
          {action === "accept" ? "menerima" : "menolak"} {intent.orderId}.
        </label>
        {result && !result.ok && (
          <p role="alert" className="text-sm text-danger">
            {result.message}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Kembali meninjau
          </Button>
          <Button
            variant={action === "reject" ? "danger" : "primary"}
            disabled={!rechecked || !acknowledged}
            onClick={confirm}
          >
            {result
              ? "Coba lagi keputusan yang sama"
              : action === "accept"
                ? "Konfirmasi terima item"
                : "Konfirmasi tolak item"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
