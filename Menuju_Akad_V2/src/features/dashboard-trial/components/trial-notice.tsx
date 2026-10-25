"use client";
import type { TrialFeatureKind, TrialSnapshot } from "../types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
export function TrialNotice({
  snapshot,
  error,
  limit,
  close,
}: {
  snapshot: TrialSnapshot | null;
  error: string;
  limit: boolean;
  close: () => void;
}) {
  const pathname = usePathname();
  const kind = (
    pathname.startsWith("/marketplace") || pathname.startsWith("/checkout/services")
      ? "vendor-favorites"
      : pathname.includes("/kua")
        ? "documents"
        : pathname.endsWith("/studio")
          ? "studio-drafts"
          : pathname.endsWith("/wedding-kit")
            ? "pdf"
            : pathname.split("/").at(-1)
  ) as TrialFeatureKind;
  const used =
    kind === "documents"
      ? (snapshot?.resources.documents?.filter((v) => (v as { completed?: boolean }).completed)
          .length ?? 0)
      : (snapshot?.used[kind] ?? 0);
  const login = `/login?returnTo=${encodeURIComponent(pathname)}`;
  return (
    <>
      <aside
        className="mb-6 rounded-card border border-champagne/40 bg-champagne/10 p-4 text-sm"
        aria-label="Status trial"
      >
        <strong>Mode percobaan</strong>
        <p role="status">
          {snapshot === null
            ? "Memuat data trial..."
            : kind === "documents"
              ? `${used} dari 5 checklist aktif`
              : `Sisa ${Math.max(0, 5 - used)} dari 5 percobaan per fitur`}
        </p>
        <p className="mt-1 text-xs text-secondary">
          Data percobaan hanya tersimpan di browser ini.{" "}
          <Link href={login} className="underline">
            Masuk untuk menggunakan fitur Free tanpa batas trial.
          </Link>
        </p>
        {error && (
          <p role="alert" className="mt-2 text-danger">
            {error}
          </p>
        )}
      </aside>
      <Dialog open={limit} onClose={close} title="Masuk untuk melanjutkan">
        <p className="mb-5 text-sm">
          Batas lima percobaan fitur atau lima checklist aktif telah tercapai. Data percobaan tetap
          tersedia di browser ini. Masuk untuk menggunakan fitur Free pada akun kalian.
        </p>
        <Link href={login} className="rounded-control bg-primary px-4 py-3 text-sm text-white">
          Masuk atau daftar
        </Link>
      </Dialog>
    </>
  );
}
