"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export function JoinWorkspace({ token }: { token: string }) {
  const router = useRouter(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <section className="space-y-4 rounded-card border border-ux-border bg-surface p-6">
      <h1 className="text-2xl font-semibold">Bergabung ke ruang pasangan</h1>
      <p>Terima undangan ini untuk mengelola rencana bersama pasangan.</p>
      <Button
        disabled={busy}
        onClick={async () => {
          if (busy) return;
          setBusy(true);
          try {
            const res = await fetch("/api/workspace/partner", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "accept", token }),
            });
            const body = await res.json();
            if (!res.ok) throw Error(body.error ?? "Undangan belum dapat diterima.");
            router.push("/dashboard");
            router.refresh();
          } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal bergabung.");
            setBusy(false);
          }
        }}
      >
        Terima undangan pasangan
      </Button>
      {error && (
        <p role="alert" className="text-danger">
          {error}
        </p>
      )}
    </section>
  );
}
