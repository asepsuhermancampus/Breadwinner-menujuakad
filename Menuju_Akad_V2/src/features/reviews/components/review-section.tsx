"use client";

import { useRef, useState } from "react";
import {
  MessageCircle,
  Star,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { ReviewCard } from "./review-card";
import { ReviewForm } from "./review-form";
import { ReviewDetailDialog } from "./review-detail-dialog";
import { usePublicReviews } from "../hooks/use-public-reviews";
import type { PublicReview } from "../types";
import styles from "./reviews.module.css";

export function ReviewSection() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<PublicReview | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const { data, busy, error, load } = usePublicReviews();

  const reviews = data?.items ?? [];
  const loopedReviews = reviews.length > 2 ? [...reviews, ...reviews] : reviews;

  const scroll = (direction: "left" | "right") => {
    if (!viewportRef.current) return;
    const offset = direction === "left" ? -390 : 390;
    viewportRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section id="ulasan" aria-labelledby="review-heading" className={styles.section}>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <header className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <span className="font-sans text-xs font-semibold tracking-widest text-secondary uppercase">
              Cerita Komunitas
            </span>
            <h2
              id="review-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-brand-secondary sm:text-4xl lg:text-5xl"
            >
              Cerita nyata para{" "}
              <span className="font-serif font-normal italic text-forest-neutral">pengantin</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-secondary sm:text-base">
              Ratusan pasangan merencanakan momen istimewa mereka bersama Menuju Akad. Geser dan klik
              kartu untuk membaca rincian cerita lengkap perjalanan mereka.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-self-start lg:justify-self-end">
            <Button onClick={() => setFormOpen(true)} className="shadow-xs">
              <MessageCircle size={17} aria-hidden="true" /> Tulis ulasan
              <ArrowUpRight size={16} aria-hidden="true" />
            </Button>
          </div>
        </header>

        {data && data.total > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-ux-border/70 pb-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-bold text-foreground">
                <Star className="text-amber-400 fill-amber-400" size={16} aria-hidden="true" />
                {data.average.toLocaleString("id-ID", {
                  maximumFractionDigits: 1,
                  minimumFractionDigits: 1,
                })}{" "}
                / 5
              </span>
              <span className="text-ux-border" aria-hidden="true">
                |
              </span>
              <span className="text-secondary">Berdasarkan {data.total} ulasan terverifikasi</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className={styles.ctrlBtn}
                title={isPaused ? "Lanjutkan kartu berjalan" : "Jeda kartu berjalan"}
                aria-label={isPaused ? "Lanjutkan kartu berjalan" : "Jeda kartu berjalan"}
              >
                {isPaused ? <Play size={14} /> : <Pause size={14} />}
              </button>
              <button
                type="button"
                onClick={() => scroll("left")}
                className={styles.ctrlBtn}
                title="Geser ke kiri"
                aria-label="Geser ke kiri"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className={styles.ctrlBtn}
                title="Geser ke kanan"
                aria-label="Geser ke kanan"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Carousel Container: Terkunci di dalam max-w-7xl dengan kabut gradien kiri & kanan */}
        <div className="relative mt-8 overflow-hidden rounded-3xl">
          {/* Efek kabut memudar di sisi keluar (kiri) */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-canvas via-canvas/80 to-transparent backdrop-blur-[2px]"
            aria-hidden="true"
          />
          {/* Efek kabut memudar di sisi masuk (kanan) */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-canvas via-canvas/80 to-transparent backdrop-blur-[2px]"
            aria-hidden="true"
          />

          {reviews.length > 0 ? (
            <div
              ref={viewportRef}
              className={styles.marqueeViewport}
              role="region"
              aria-label="Daftar ulasan berjalan"
            >
              <div className={cn(styles.marqueeTrack, isPaused && styles.isPaused)}>
                {loopedReviews.map((review, index) => (
                  <ReviewCard
                    key={`${review.id}-${index}`}
                    review={review}
                    index={index}
                    onSelect={setSelectedReview}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              {busy ? (
                <p className="animate-pulse text-sm text-secondary">Memuat cerita pengantin…</p>
              ) : error ? (
                <div role="alert" className="space-y-3">
                  <p className="text-sm text-danger">{error}</p>
                  <Button variant="secondary" onClick={() => void load()}>
                    Coba lagi
                  </Button>
                </div>
              ) : (
                <p className="rounded-card border border-ux-border bg-surface p-8 text-sm text-secondary">
                  Belum ada ulasan yang ditampilkan. Bagikan pengalaman Anda lewat Tulis ulasan.
                </p>
              )}
            </div>
          )}
        </div>
      </div>


      <ReviewForm open={formOpen} onClose={() => setFormOpen(false)} />
      <ReviewDetailDialog
        review={selectedReview}
        open={Boolean(selectedReview)}
        onClose={() => setSelectedReview(null)}
      />
    </section>
  );
}
