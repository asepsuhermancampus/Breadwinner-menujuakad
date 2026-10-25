"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { SubscriptionNotice, NoticeAction } from "../types";
import { guideTargets } from "../config/guide-targets";
export function FeatureGuide({
  notice,
  pending,
  error,
  onAction,
  dashboardFirstStep = false,
}: {
  notice: SubscriptionNotice;
  pending: boolean;
  error: string;
  onAction: (action: NoticeAction) => void;
  dashboardFirstStep?: boolean;
}) {
  const capability = notice.capabilities[notice.step],
    target = capability ? guideTargets[capability] : null;
  const href = dashboardFirstStep && notice.step === 0 ? "/dashboard" : target?.href;
  const router = useRouter(),
    path = usePathname(),
    [missing, setMissing] = useState(false);
  useEffect(() => {
    if (!target || !href) return;
    if (path !== href.split("?")[0]) {
      router.push(href);
      return;
    }
    let element: HTMLElement | null = null;
    const started = Date.now();
    const timer = setInterval(() => {
      element = document.getElementById(target.targetId);
      if (element) {
        element.classList.add("ring-4", "ring-primary/40");
        element.tabIndex = -1;
        element.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
          block: "center",
        });
        element.focus({ preventScroll: true });
        setMissing(false);
        clearInterval(timer);
      } else if (Date.now() - started > 3000) {
        setMissing(true);
        clearInterval(timer);
      }
    }, 100);
    return () => {
      clearInterval(timer);
      element?.classList.remove("ring-4", "ring-primary/40");
    };
  }, [target, href, path, router]);
  return (
    <aside
      aria-label="Panduan fitur paket"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg rounded-card border border-primary/30 bg-surface p-5 shadow-xl"
    >
      <button
        type="button"
        aria-label="Tutup panduan"
        disabled={pending}
        onClick={() => onAction("dismiss")}
        className="absolute right-2 top-2 flex size-11 items-center justify-center rounded-control text-xl hover:bg-subtle disabled:opacity-50"
      >
        ×
      </button>
      <p className="text-xs text-secondary">
        Langkah {notice.step + 1} dari {notice.capabilities.length}
      </p>
      <h2 className="mt-1 font-semibold">{target?.title ?? "Fitur paket"}</h2>
      <p className="my-3 text-sm text-secondary">{target?.description}</p>
      {missing && (
        <p role="status" className="mb-3 text-xs">
          Bagian fitur belum tersedia pada halaman ini. Kalian dapat melewati langkah ini dan
          membukanya dari dashboard.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          size="small"
          variant="secondary"
          disabled={pending || notice.step === 0}
          onClick={() => onAction("back")}
        >
          Kembali
        </Button>
        <Button size="small" disabled={pending} onClick={() => onAction("next")}>
          {notice.step + 1 === notice.capabilities.length ? "Selesai" : "Next"}
        </Button>
        <Button size="small" variant="ghost" disabled={pending} onClick={() => onAction("dismiss")}>
          Lewati
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs text-danger">
          {error}
        </p>
      )}
    </aside>
  );
}
