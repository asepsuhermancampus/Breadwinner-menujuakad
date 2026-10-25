"use client";
import { useEffect, useState } from "react";
export function SupportQueue() {
  const [tickets, setTickets] = useState<
    { id: string; message: string; priority: string; created_at: string }[]
  >([]);
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/operations/helpdesk", { cache: "no-store", signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) return;
        const body = (await res.json()) as { tickets: typeof tickets };
        if (!controller.signal.aborted) {
          setAllowed(true);
          setTickets(body.tickets);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return allowed ? (
    <section className="space-y-3 rounded-card border border-ux-border bg-surface p-6">
      <h2 className="font-semibold">Antrean bantuan pelanggan</h2>
      {tickets.map((ticket) => (
        <article key={ticket.id} className="border-t border-ux-border pt-3">
          <p className="text-xs text-secondary">
            {ticket.id} · {ticket.priority} · {ticket.created_at}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm">{ticket.message}</p>
        </article>
      ))}
    </section>
  ) : null;
}
