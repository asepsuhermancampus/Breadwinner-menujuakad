"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Send, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { reviewInputSchema } from "../domain/review-schema";
import { reviewRequest } from "../lib/review-request";
import { ReviewPackageBadge } from "./review-package-badge";
import { ReviewAuthGate } from "./review-auth-gate";
import { ReviewFormSuccess } from "./review-form-success";
import type { ReviewTier } from "../types";
import styles from "./reviews.module.css";

type AuthIdentity = {
  authenticated: boolean;
  user: { id: string; name: string; email: string; role: string; tier: ReviewTier } | null;
};

export function ReviewForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [authData, setAuthData] = useState<AuthIdentity | null>(null);
  const [name, setName] = useState(""), [comment, setComment] = useState("");
  const [rating, setRating] = useState(5), [hover, setHover] = useState(0);
  const [busy, setBusy] = useState(false), [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    reviewRequest<AuthIdentity>("/api/reviews/identity")
      .then((data) => {
        setAuthData(data);
        if (data.authenticated && data.user) setName((prev) => prev || data.user!.name || "");
      })
      .catch(() => setAuthData({ authenticated: false, user: null }));
  }, [open]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    const input = reviewInputSchema.safeParse({ name, rating, comment });
    if (!input.success) {
      setError("Isi nama (2–80 karakter), pilih 1–5 bintang, dan komentar (10–2000 karakter).");
      return;
    }
    submitting.current = true;
    setBusy(true); setError("");
    try {
      await reviewRequest("/api/reviews", { method: "POST", body: JSON.stringify(input.data) });
      setSuccess(true); setComment("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Ulasan belum terkirim.");
    } finally {
      submitting.current = false; setBusy(false);
    }
  }

  function close() {
    if (submitting.current) return;
    setSuccess(false);
    setError("");
    onClose();
  }

  const checkingAuth = open && authData === null;
  const title = checkingAuth
    ? "Memeriksa Akun…"
    : !authData?.authenticated
      ? "Akses Ulasan Terbatas"
      : success ? "Ulasan Berhasil Terkirim" : "Bagikan Pengalaman Anda";

  return (
    <Dialog open={open} onClose={close} title={title}>
      {checkingAuth ? (
        <div className="py-12 text-center text-sm text-secondary animate-pulse">
          Memverifikasi status akun Anda…
        </div>
      ) : !authData?.authenticated ? (
        <ReviewAuthGate onClose={close} />
      ) : success ? (
        <ReviewFormSuccess onClose={close} />
      ) : (
        <form onSubmit={submit} className="space-y-4" aria-busy={busy}>
          {authData.user && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ux-border/70 bg-canvas/60 p-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {authData.user.name?.[0]?.toUpperCase() ?? "P"}
                </span>
                <div>
                  <p className="font-semibold text-foreground">{authData.user.email}</p>
                  <p className="text-[11px] text-muted">Akun Terdaftar Pengantin</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ReviewPackageBadge
                  review={{ id: authData.user.id, name: authData.user.name, rating: 5, comment: "", createdAt: "", tier: authData.user.tier }}
                />
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck size={13} /> Terverifikasi
                </span>
              </div>
            </div>
          )}

          <fieldset disabled={busy}>
            <legend className="mb-2 text-xs font-semibold text-secondary">Penilaian Anda</legend>
            <div className="flex gap-1.5" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((val) => {
                const filled = val <= (hover || rating);
                return (
                  <label
                    key={val}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onMouseEnter={() => setHover(val)}
                  >
                    <input
                      type="radio"
                      name="review-rating"
                      value={val}
                      checked={rating === val}
                      onChange={() => setRating(val)}
                      aria-label={`${val} bintang`}
                      className="sr-only"
                    />
                    <Star
                      size={30}
                      strokeWidth={1.3}
                      className={filled ? "fill-amber-400 text-amber-400" : "text-amber-400/30"}
                      aria-hidden="true"
                    />
                  </label>
                );
              })}
            </div>
            <p className="mt-1 text-xs font-medium text-foreground">
              {rating} dari 5 bintang {rating === 5 ? "· Sempurna!" : ""}
            </p>
          </fieldset>

          <Field
            label="Nama pasangan / panggilan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
            maxLength={80}
            required
            disabled={busy}
            placeholder="Contoh: Sarah & Dimas"
          />

          <div className="grid gap-1.5">
            <label htmlFor={id} className="text-xs font-semibold text-secondary">
              Ceritakan pengalaman persiapan Anda
            </label>
            <textarea
              id={id}
              className={styles.textarea}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              minLength={10}
              maxLength={2000}
              rows={4}
              required
              disabled={busy}
              placeholder="Ceritakan bagaimana Menuju Akad membantu persiapan pernikahan kalian..."
            />
            <span className="text-[11px] text-muted text-right">
              {comment.length} / 2000 karakter (min. 10)
            </span>
          </div>

          <div className="rounded-lg border border-ux-border/50 bg-subtle/50 p-3 text-[11px] text-muted leading-relaxed">
            🛡️ Ulasan Anda akan dimoderasi terlebih dahulu di panel Superadmin sebelum tampil di
            beranda untuk menjaga keaslian cerita komunitas pengantin.
          </div>

          {error && (
            <p role="alert" className="text-xs text-danger font-medium">
              {error}
            </p>
          )}

          <Button type="submit" disabled={busy} className="w-full">
            <Send size={15} aria-hidden="true" />
            {busy ? "Mengirim ulasan…" : "Kirim Ulasan untuk Diverifikasi"}
          </Button>
        </form>
      )}
    </Dialog>
  );
}
