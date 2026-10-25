"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FeatureLock } from "./feature-lock";
export function PrioritySupport({ priority }: { priority: boolean }) {
  const [message, setMessage] = useState(""),
    [status, setStatus] = useState(""),
    [pending, setPending] = useState(false);
  return (
    <div className="space-y-5">
      {!priority && (
        <FeatureLock title="Prioritas bantuan" plan="Lifetime">
          <PrioritySupport priority />
        </FeatureLock>
      )}
      <section
        id={priority ? "feature-priority-support" : "feature-standard-support"}
        tabIndex={-1}
        className="space-y-3 rounded-card border border-ux-border bg-surface p-6"
      >
        <h2 className="font-semibold">Bantuan pasangan{priority ? " · Prioritas Lifetime" : ""}</h2>
        <form
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            setPending(true);
            setStatus("");
            try {
              const response = await fetch("/api/workspace/support", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
                signal: AbortSignal.timeout(15000),
              });
              const body = (await response.json()) as {
                id?: string;
                priority?: string;
                error?: string;
              };
              if (!response.ok) throw new Error(body.error ?? "Permintaan belum tersimpan");
              setStatus(
                `Permintaan ${body.id} tersimpan · ${body.priority === "priority" ? "antrean prioritas" : "antrean standar"}.`,
              );
              setMessage("");
            } catch (cause) {
              setStatus(cause instanceof Error ? cause.message : "Permintaan belum tersimpan");
            } finally {
              setPending(false);
            }
          }}
        >
          <label className="grid gap-1 text-sm">
            Pesan bantuan
            <textarea
              required
              minLength={5}
              maxLength={4000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-control border border-ux-border p-3"
            />
          </label>
          <Button type="submit" disabled={pending}>
            {pending ? "Mengirim…" : "Kirim permintaan bantuan"}
          </Button>
        </form>
        {status && (
          <p role="status" className="break-words text-sm">
            {status}
          </p>
        )}
      </section>
    </div>
  );
}
