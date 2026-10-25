"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { GuestInvitation } from "../types/guest";
type Tool = "seating" | "whatsapp" | "followup";
function Entry({
  guest,
  field,
  trial,
  save,
}: {
  guest: GuestInvitation;
  field: "tableNumber" | "waDraft" | "followUpNote";
  trial: boolean;
  save: (value: string) => Promise<boolean>;
}) {
  const value = String((guest as unknown as Record<string, unknown>)[field] ?? "");
  const [base, setBase] = useState(value),
    [draft, setDraft] = useState(value),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  if (value !== base && draft === base) {
    setBase(value);
    setDraft(value);
  }
  const phone = guest.contactPhone?.replace(/[^0-9]/g, "").replace(/^0/, "62") ?? "";
  return (
    <form
      className="grid gap-3 rounded-card border border-ux-border bg-surface p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        if (base !== value) {
          setError("Data berubah di tab lain. Buka ulang data terbaru.");
          return;
        }
        setBusy(true);
        try {
          if (await save(draft)) {
            setBase(draft);
            setError("");
          } else setError("Belum tersimpan. Periksa batas percobaan atau paket.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="font-semibold">{guest.name}</h2>
      <label className="grid gap-1 text-sm">
        {field === "tableNumber"
          ? "Nomor meja"
          : field === "waDraft"
            ? "Pesan WhatsApp"
            : "Catatan tindak lanjut"}
        <textarea
          maxLength={field === "tableNumber" ? 80 : 2000}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="rounded-control border border-ux-border bg-canvas p-3"
        />
      </label>
      <Button size="small" type="submit" disabled={busy}>
        Simpan {field === "tableNumber" ? "penempatan" : "catatan"}
      </Button>
      {field === "waDraft" &&
        (trial ? (
          <Link href="/login?returnTo=%2Fplanner%2Fguests" className="text-sm underline">
            Masuk untuk menggunakan pengiriman pesan.
          </Link>
        ) : guest.waConsent && phone.length >= 10 && draft.trim() ? (
          <a
            href={
              "https://wa.me/" +
              phone +
              "?text=" +
              encodeURIComponent(
                draft +
                  "\n" +
                  (typeof window === "undefined" ? "" : window.location.origin) +
                  "/i/" +
                  guest.personalToken,
              )
            }
            target="_blank"
            rel="noreferrer"
            className="text-sm underline"
          >
            Buka WhatsApp untuk mengirim
          </a>
        ) : (
          <p className="text-xs text-secondary">
            Isi pesan, nomor telepon dan persetujuan penerima untuk membuka WhatsApp.
          </p>
        ))}
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
export function CustomerGuestTools({
  guests,
  tool,
  trial,
  save,
}: {
  guests: GuestInvitation[];
  tool: Tool;
  trial: boolean;
  save: (guests: GuestInvitation[]) => Promise<boolean>;
}) {
  const field =
    tool === "seating" ? "tableNumber" : tool === "whatsapp" ? "waDraft" : "followUpNote";
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">
        {tool === "seating"
          ? "Penempatan meja"
          : tool === "whatsapp"
            ? "Pesan WhatsApp"
            : "Tindak lanjut tamu"}
      </h2>
      {tool === "whatsapp" && (
        <p className="text-sm text-secondary">
          Simpan pesan, lalu kirim sendiri melalui WhatsApp. Membuka WhatsApp tidak menandai pesan
          terkirim atau diterima.
        </p>
      )}
      {guests
        .filter((g) => !g.isArchived)
        .map((g) => (
          <Entry
            key={g.id}
            guest={g}
            field={field}
            trial={trial}
            save={(v) => save(guests.map((i) => (i.id === g.id ? { ...i, [field]: v } : i)))}
          />
        ))}
      {guests.length === 0 && <p>Tambahkan tamu terlebih dahulu melalui tab Tamu & RSVP.</p>}
    </section>
  );
}
