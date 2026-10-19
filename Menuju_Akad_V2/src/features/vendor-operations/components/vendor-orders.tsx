"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { VendorContext, VendorResult, VendorWorkspace } from "../types/vendor";
import { VendorContract } from "./vendor-contract";
import { VendorOrderDetails } from "./vendor-order-details";
import { VendorOrderReview } from "./vendor-order-review";
import { VendorOrderTable } from "./vendor-order-table";

export function VendorOrders({
  state,
  context,
  onResult,
}: {
  state: VendorWorkspace;
  context: VendorContext;
  onResult: (result: VendorResult) => void;
}) {
  const [selectedId, setSelectedId] = useState(state.orders[0]?.id ?? "");
  const [reason, setReason] = useState("");
  const [contractOpen, setContractOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<"accept" | "reject" | null>(null);
  const inspector = useRef<HTMLDivElement>(null);
  const selected = state.orders.find((order) => order.id === selectedId) ?? state.orders[0];
  const pending = state.orders.filter((order) => order.status === "pending").length;
  const canDecide =
    context.permissions.orderDecide && context.sessionValid && context.role === "vendor";
  return (
    <div className="grid gap-7">
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">
            Tinjau pekerjaan, satu item sekali.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary">
            {pending} permintaan menunggu · keputusan ini tidak membatalkan item vendor lain.
          </p>
        </div>
        <Button
          variant="secondary"
          disabled={!selected}
          onClick={() => {
            inspector.current?.scrollIntoView({ block: "start" });
            inspector.current?.focus({ preventScroll: true });
          }}
        >
          Tinjau item terpilih
        </Button>
      </header>
      {!canDecide && (
        <p
          role="status"
          className="rounded-control border border-border bg-subtle p-4 text-sm text-secondary"
        >
          Akses keputusan tidak tersedia pada sesi ini. Anda tetap dapat membaca kontrak sesuai
          akses yang diberikan.
        </p>
      )}
      {!context.online && (
        <p
          role="status"
          className="rounded-control border border-warning/30 bg-warning/5 p-4 text-sm text-warning"
        >
          Anda sedang offline. Pemeriksaan dan keputusan akan menunggu koneksi pulih.
        </p>
      )}
      {selected ? (
        <div className="grid items-start gap-7 2xl:grid-cols-[minmax(0,1fr)_440px]">
          <VendorOrderTable
            orders={state.orders}
            selectedId={selected.id}
            onSelect={(id) => {
              setSelectedId(id);
              setReason("");
            }}
          />
          <div ref={inspector} tabIndex={-1} aria-label="Inspektor kontrak terpilih">
            <VendorOrderDetails
              key={selected.id}
              order={selected}
              reason={reason}
              canDecide={canDecide}
              onReason={setReason}
              onContract={() => setContractOpen(true)}
              onReview={setReviewAction}
            />
          </div>
        </div>
      ) : (
        <div
          role="status"
          className="rounded-card border border-border bg-surface p-8 text-center text-sm text-secondary"
        >
          Belum ada item pesanan untuk ditinjau.
        </div>
      )}
      {contractOpen && selected && (
        <VendorContract order={selected} onClose={() => setContractOpen(false)} />
      )}
      {reviewAction && selected && (
        <VendorOrderReview
          key={`${selected.id}-${reviewAction}`}
          state={state}
          context={context}
          order={selected}
          action={reviewAction}
          reason={reason}
          onResult={onResult}
          onClose={() => {
            setReviewAction(null);
            setReason("");
          }}
        />
      )}
    </div>
  );
}
