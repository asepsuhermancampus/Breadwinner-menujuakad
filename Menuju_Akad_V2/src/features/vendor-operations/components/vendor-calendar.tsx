"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import {
  blockVendorDate,
  vendorCalendarDay,
  type CalendarWorkspace,
} from "../domain/vendor-calendar";
import type { VendorContext, VendorResult, VendorWorkspace } from "../types/vendor";

const dayNames = {
  confirmed: "Terpesan",
  hold: "Hold sementara",
  blocked: "Blok internal",
  available: "Tersedia",
};
export function VendorCalendar({
  state,
  context,
  onResult,
}: {
  state: VendorWorkspace;
  context: VendorContext;
  onResult: (result: VendorResult) => void;
}) {
  const [selected, setSelected] = useState("2027-02-18");
  const [reason, setReason] = useState("Hari produksi internal");
  const [review, setReview] = useState<{ operationId: string; expectedVersion: number } | null>(
    null,
  );
  const [ack, setAck] = useState(false);
  const [message, setMessage] = useState("");
  const calendar = state as CalendarWorkspace;
  const status = vendorCalendarDay(calendar, selected);
  const block = calendar.calendar?.blocks.find((item) => item.date === selected);
  const requests = state.orders.filter((item) => item.status === "pending").length;
  const confirmed = Array.from({ length: 28 }, (_, i) =>
    vendorCalendarDay(calendar, `2027-02-${String(i + 1).padStart(2, "0")}`),
  ).filter((value) => value === "confirmed").length;
  const label = `${Number(selected.slice(-2))} Februari 2027`;
  function open() {
    setAck(false);
    setMessage("");
    setReview({ operationId: crypto.randomUUID(), expectedVersion: state.version });
  }
  function confirm() {
    if (!review) return;
    const result = blockVendorDate(
      calendar,
      { ...review, date: selected, reason, acknowledged: ack },
      context,
    );
    setMessage(result.message);
    onResult(result);
    if (result.ok) setReview(null);
  }
  return (
    <div className="grid gap-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">
            Jadwal yang bisa dipercaya.
          </h1>
          <p className="mt-3 text-sm text-secondary">
            Februari 2027 · {confirmed} acara terkonfirmasi · {requests} permintaan belum
            diputuskan.
          </p>
        </div>
        <Button
          disabled={status !== "available" || !context.permissions.calendarWrite || !reason.trim()}
          onClick={open}
        >
          Simpan blok tanggal
        </Button>
      </header>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0 rounded-card border border-border bg-surface p-3 sm:p-6">
          <h2 className="mb-5 text-lg font-semibold">Februari 2027</h2>
          <div
            role="group"
            aria-label="Kalender Februari 2027"
            className="grid grid-cols-7 gap-1 sm:gap-2"
          >
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day) => (
              <p key={day} className="pb-2 text-center text-[10px] text-secondary sm:text-xs">
                {day}
              </p>
            ))}
            {Array.from({ length: 28 }, (_, index) => {
              const date = `2027-02-${String(index + 1).padStart(2, "0")}`;
              const day = vendorCalendarDay(calendar, date);
              return (
                <button
                  key={date}
                  type="button"
                  aria-label={`${index + 1} Februari 2027, ${dayNames[day]}`}
                  aria-pressed={date === selected}
                  onClick={() => {
                    setSelected(date);
                    setMessage("");
                  }}
                  className={`flex min-h-20 min-w-0 flex-col gap-2 rounded-control border p-1.5 text-left sm:min-h-28 sm:p-3 ${date === selected ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <span className="font-mono text-xs">{String(index + 1).padStart(2, "0")}</span>
                  <span
                    className={`break-words text-[8px] leading-relaxed sm:text-[10px] ${day === "confirmed" ? "text-success" : day === "hold" ? "text-warning" : "text-secondary"}`}
                  >
                    {dayNames[day]}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
        <aside className="grid gap-5">
          <section className="rounded-card border border-border bg-surface p-5">
            <h2 className="font-semibold">{label}</h2>
            <p className="mt-3 text-xs leading-relaxed text-secondary">
              {status === "available"
                ? "Belum ada pesanan terkonfirmasi pada tanggal ini."
                : `${dayNames[status]}. ${block?.reason ?? "Pesanan dan hold aktif tetap terlindungi."}`}
            </p>
            <p className="mt-5 text-xs font-medium">Tindakan</p>
            <p className="mt-2 text-sm">Tutup untuk pesanan baru</p>
            <div className="mt-5">
              <Field
                label="Alasan internal"
                value={reason}
                disabled={!context.permissions.calendarWrite}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs font-semibold">
              <Icon name="shield" size={14} />
              Tidak mengubah pesanan lama
            </p>
            <p className="mt-2 text-xs leading-relaxed text-secondary">
              Tanggal berisi pesanan atau hold aktif perlu ditinjau, bukan dihapus melalui blok
              massal.
            </p>
            <Button
              className="mt-5 w-full"
              disabled={
                status !== "available" || !context.permissions.calendarWrite || !reason.trim()
              }
              onClick={open}
            >
              Blok tanggal ini
            </Button>
          </section>
          <div className="rounded-card border border-border bg-subtle p-5">
            <h3 className="text-sm font-semibold">Hold bukan booking final</h3>
            <p className="mt-2 text-xs leading-relaxed text-secondary">
              Hold 14 Februari masih sementara. Saat kedaluwarsa, periksa server dan ketersediaan
              ulang; jangan membuka slot pesanan yang sudah dikonfirmasi.
            </p>
          </div>
        </aside>
      </div>
      {message && (
        <p role="status" className="text-sm text-secondary">
          {message}
        </p>
      )}
      {review && (
        <Dialog open title="Tinjau blok tanggal internal" onClose={() => setReview(null)}>
          <p className="text-sm">
            {label} · {reason}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-secondary">
            Blok hanya membatasi pesanan baru. Slot, izin, dan versi diperiksa kembali saat
            konfirmasi.
          </p>
          <label className="mt-5 flex items-start gap-3 text-xs leading-relaxed">
            <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
            Saya memastikan tanggal ini tidak memiliki pesanan atau hold aktif.
          </label>
          {message && (
            <p role="alert" className="mt-4 text-sm text-danger">
              {message}
            </p>
          )}
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setReview(null)}>
              Batal
            </Button>
            <Button disabled={!ack} onClick={confirm}>
              Konfirmasi blok tanggal
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
