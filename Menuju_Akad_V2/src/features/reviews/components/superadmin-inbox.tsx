"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Inbox, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useReviewInbox } from "../hooks/use-review-inbox";
import { ModerationCard } from "./moderation-card";
import { InboxFilters } from "./inbox-filters";
import { LiveOperationsShell } from "@/features/operations-shell/components/live-operations-shell";
export function SuperadminInbox({ email }: { email: string }) {
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set("status", status);
  if (rating) params.set("rating", rating);
  if (search.trim()) params.set("search", search.trim());
  const { data, loading, saving, error, notice, refresh, moderate } = useReviewInbox(
    params.toString(),
  );
  const disabled = Boolean(saving) || logoutBusy;
  async function logout() {
    if (logoutBusy) return;
    setLogoutBusy(true);
    setLogoutError("");
    try {
      await signOut({ redirect: false });
      window.location.replace("/login");
    } catch (cause) {
      setLogoutError(cause instanceof Error ? cause.message : "Belum dapat keluar.");
      setLogoutBusy(false);
    }
  }
  return (
    <LiveOperationsShell account={email} superadmin>
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">
              CMS & Konten
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-secondary">
              Ruang untuk mendengar. Tinjau masukan pengguna dan pilih ulasan yang ditampilkan di
              landing.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/#ulasan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-brand-secondary"
            >
              Lihat landing <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Button
              variant="secondary"
              size="small"
              disabled={disabled}
              onClick={() => void logout()}
            >
              <LogOut size={14} aria-hidden="true" />
              {logoutBusy ? "Keluar…" : "Keluar"}
            </Button>
          </div>
        </div>
        <InboxFilters
          values={{ status, rating, search }}
          disabled={disabled}
          onChange={(key, value) => {
            if (key === "status") setStatus(value);
            if (key === "rating") setRating(value);
            if (key === "search") setSearch(value);
            setPage(1);
          }}
        />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-secondary">
          <p aria-live="polite">{data ? `${data.total} ulasan ditemukan` : "Memuat inbox…"}</p>
          <Button
            variant="ghost"
            size="small"
            onClick={() => void refresh()}
            disabled={loading || disabled}
          >
            Muat ulang
          </Button>
        </div>
        {notice && (
          <p role="status" className="mt-4 rounded-control bg-success-bg p-3 text-sm text-success">
            {notice}
          </p>
        )}
        {(error || logoutError) && (
          <p role="alert" className="mt-4 rounded-control bg-danger-bg p-3 text-sm text-danger">
            {error || logoutError}
          </p>
        )}
        <div className="mt-5 grid gap-4" aria-busy={loading || Boolean(saving)}>
          {data?.items.map((review) => (
            <ModerationCard
              key={review.id}
              review={review}
              saving={disabled || loading}
              onModerate={(id, next) => void moderate(id, next)}
            />
          ))}
          {data?.items.length === 0 && !loading && (
            <div className="rounded-card border border-ux-border bg-surface p-10 text-center">
              <Inbox className="mx-auto text-brand-secondary" aria-hidden="true" />
              <p className="mt-4 font-medium text-brand-secondary">
                Tidak ada ulasan di halaman ini.
              </p>
              <p className="mt-2 text-sm text-secondary">
                Sesuaikan filter atau kembali ke halaman sebelumnya.
              </p>
            </div>
          )}
        </div>
        {data && (
          <nav
            aria-label="Halaman ulasan"
            className="mt-7 flex flex-wrap items-center justify-between gap-4"
          >
            <Button
              variant="secondary"
              disabled={page <= 1 || loading || disabled}
              onClick={() => setPage(page - 1)}
            >
              Sebelumnya
            </Button>
            <span className="text-xs text-secondary">Halaman {page}</span>
            <Button
              variant="secondary"
              disabled={!data.hasMore || loading || disabled}
              onClick={() => setPage(page + 1)}
            >
              Berikutnya
            </Button>
          </nav>
        )}
      </div>
    </LiveOperationsShell>
  );
}
