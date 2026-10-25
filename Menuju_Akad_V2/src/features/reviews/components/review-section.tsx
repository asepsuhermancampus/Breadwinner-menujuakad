"use client";
import { useState } from "react";
import { ArrowDown, ArrowUpRight, Heart, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "./review-card";
import { ReviewForm } from "./review-form";
import { usePublicReviews } from "../hooks/use-public-reviews";
import styles from "./reviews.module.css";

export function ReviewSection() {
  const [open, setOpen] = useState(false);
  const { data, busy, error, load } = usePublicReviews();
  return (
    <section id="ulasan" aria-labelledby="review-heading" className={styles.section}>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-rose uppercase">
              <Heart size={14} aria-hidden="true" /> Dari ruang yang sama
            </span>
            <h2
              id="review-heading"
              className="mt-4 text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-5xl"
            >
              Setiap cerita, <span className="font-serif font-normal italic">berarti.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-secondary sm:text-base">
              Ada banyak cara menuju hari bahagia. Ini cerita dan masukan yang menemani kami tumbuh,
              bersama kalian.
            </p>
          </div>
          <Button onClick={() => setOpen(true)} className="justify-self-start lg:justify-self-end">
            <MessageCircle size={17} aria-hidden="true" /> Tulis ulasan{" "}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Button>
        </div>
        {data && data.total > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-secondary">
            <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
              <Star className="text-ux-gold-ink" fill="currentColor" size={16} aria-hidden="true" />
              {data.average.toLocaleString("id-ID", {
                maximumFractionDigits: 1,
                minimumFractionDigits: 1,
              })}{" "}
              / 5
            </span>
            <span aria-hidden="true">·</span>
            <span>Dari {data.total} ulasan yang ditampilkan</span>
            <span className="hidden h-px flex-1 bg-ux-border sm:block" aria-hidden="true" />
          </div>
        )}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-busy={busy}>
          {data?.items.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>
        <div className="mt-7 text-center" aria-live="polite">
          {busy && !data && (
            <p className="text-sm text-secondary" role="status">
              Memuat cerita kalian…
            </p>
          )}
          {data?.total === 0 && !busy && (
            <p className="rounded-card border border-ux-border bg-surface p-8 text-sm text-secondary">
              Belum ada ulasan yang ditampilkan. Bagikan pengalaman Anda lewat Tulis ulasan.
            </p>
          )}
          {error && (
            <div role="alert" className="space-y-3">
              <p className="text-sm text-danger">{error}</p>
              <Button
                variant="secondary"
                onClick={() => void load(data?.hasMore ? data.page + 1 : 1)}
                disabled={busy}
              >
                Coba lagi
              </Button>
            </div>
          )}
          {data?.hasMore && !error && (
            <Button variant="secondary" onClick={() => void load(data.page + 1)} disabled={busy}>
              {busy ? "Memuat…" : "Baca cerita lainnya"}
              <ArrowDown size={15} aria-hidden="true" />
            </Button>
          )}
        </div>
        <p className="mt-9 text-center text-xs leading-6 text-secondary">
          Ruang ini tumbuh dari masukan kalian. Terima kasih sudah menjadi bagian dari perjalanan
          kami.
        </p>
      </div>
      <ReviewForm open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
