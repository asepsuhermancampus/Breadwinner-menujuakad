"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
type Details = {
  name: string;
  quota: number;
  rsvpStatus: string;
  attendingCount: number;
  title: string;
  date: string;
  venue: string;
};
export function GuestRsvp({ token, initial }: { token: string; initial: Details }) {
  const [value, setValue] = useState(initial),
    [status, setStatus] = useState(initial.rsvpStatus),
    [count, setCount] = useState(initial.attendingCount || 1),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  return (
    <main className="mx-auto grid min-h-screen max-w-xl content-center gap-5 p-6">
      <h1 className="text-3xl font-semibold">{value.title}</h1>
      <p>
        {value.date} {value.venue}
      </p>
      <section className="space-y-4 rounded-card border border-ux-border bg-surface p-6">
        <h2 className="text-xl font-semibold">Untuk {value.name}</h2>
        <p>Kuota undangan: {value.quota} orang.</p>
        <form
          className="grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (busy) return;
            setBusy(true);
            setMessage("");
            try {
              const res = await fetch("/api/invitations/" + encodeURIComponent(token) + "/rsvp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, count: status === "ATTENDING" ? count : 0 }),
              });
              const body = await res.json();
              if (!res.ok) throw Error(body.error ?? "Konfirmasi belum tersimpan.");
              setValue(body.invitation);
              setMessage("Konfirmasi kehadiran tersimpan.");
            } catch (e) {
              setMessage(e instanceof Error ? e.message : "Konfirmasi gagal.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="grid gap-1 text-sm">
            Konfirmasi kehadiran
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-control border border-ux-border bg-canvas p-3"
            >
              <option value="PENDING">Belum memastikan</option>
              <option value="ATTENDING">Hadir</option>
              <option value="DECLINED">Tidak hadir</option>
            </select>
          </label>
          {status === "ATTENDING" && (
            <label className="grid gap-1 text-sm">
              Jumlah hadir
              <input
                type="number"
                min={1}
                max={value.quota}
                required
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="rounded-control border border-ux-border bg-canvas p-3"
              />
            </label>
          )}
          <Button disabled={busy} type="submit">
            Simpan konfirmasi
          </Button>
        </form>
        {message && <p role="status">{message}</p>}
      </section>
    </main>
  );
}
