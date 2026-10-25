"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { SubscriptionNotice, NoticeAction } from "../types";
import { guideTargets } from "../config/guide-targets";
import { FeatureGuide } from "./feature-guide";
export function SubscriptionExperience({ autoStart = false }: { autoStart?: boolean }) {
  const [notice, setNotice] = useState<SubscriptionNotice | null>(null),
    [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const path = usePathname();
  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/subscriptions/notices", { cache: "no-store", signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then(async (body: { notice?: SubscriptionNotice } | null) => {
        let next = body?.notice ?? null;
        if (
          autoStart &&
          path === "/dashboard" &&
          next?.state === "new" &&
          !controller.signal.aborted
        ) {
          try {
            const response = await fetch(`/api/subscriptions/notices/${next.grantId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "start", expectedStep: next.step }),
              signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
            });
            if (response.ok)
              next = ((await response.json()) as { notice: SubscriptionNotice }).notice;
            else throw new Error("Panduan belum dapat dimulai otomatis");
          } catch {
            if (!controller.signal.aborted)
              setError("Panduan belum dapat dimulai otomatis. Coba tombol Mulai panduan.");
          }
        }
        if (!controller.signal.aborted) setNotice(next);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [path, autoStart]);
  async function act(action: NoticeAction) {
    if (!notice || pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/subscriptions/notices/${notice.grantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, expectedStep: notice.step }),
        signal: AbortSignal.timeout(15000),
      });
      const body = (await response.json()) as { notice: SubscriptionNotice; error?: string };
      if (!response.ok) throw new Error(body.error ?? "Panduan belum tersimpan");
      setNotice(body.notice);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Panduan belum tersimpan");
    } finally {
      setPending(false);
    }
  }
  if (!notice || notice.state === "completed" || notice.state === "dismissed") return null;
  return (
    <>
      <Dialog
        open={notice.state === "new"}
        onClose={() => void act("dismiss")}
        title="Fitur paket kalian sudah terbuka"
      >
        <p className="text-sm text-secondary">
          Pembayaran terverifikasi. Fitur berikut baru tersedia untuk akun kalian:
        </p>
        <ul className="my-4 list-disc space-y-2 pl-5 text-sm">
          {notice.capabilities.map((cap) => (
            <li key={cap}>{guideTargets[cap]?.title ?? cap}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <Button disabled={pending} onClick={() => void act("start")}>
            Mulai panduan
          </Button>
          <Button variant="secondary" disabled={pending} onClick={() => void act("dismiss")}>
            Nanti saja
          </Button>
        </div>
        {error && <p role="alert">{error}</p>}
      </Dialog>
      {notice.state === "started" && (
        <FeatureGuide
          notice={notice}
          dashboardFirstStep={autoStart}
          pending={pending}
          error={error}
          onAction={(action) => void act(action)}
        />
      )}
    </>
  );
}
