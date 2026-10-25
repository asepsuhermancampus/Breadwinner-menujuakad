"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Send, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { reviewInputSchema } from "../domain/review-schema";
import { reviewRequest } from "../lib/review-request";
import styles from "./reviews.module.css";

export function ReviewForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const id = useId();
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    const input = reviewInputSchema.safeParse({ name, rating, comment });
    if (!input.success) {
      setError(
        "Isi nama (2–80 karakter), pilih 1–5 bintang, dan tulis komentar (10–2000 karakter).",
      );
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError("");
    try {
      await reviewRequest("/api/reviews", { method: "POST", body: JSON.stringify(input.data) });
      setSuccess(true);
      setName("");
      setComment("");
      setRating(0);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Ulasan belum terkirim.");
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  function close() {
    if (submitting.current) return;
    setSuccess(false);
    setError("");
    onClose();
  }
  return (
    <Dialog
      open={open}
      onClose={close}
      title={success ? "Terima kasih sudah bercerita" : "Bagaimana pengalaman Anda?"}
    >
      {success ? (
        <div className="space-y-5 py-3 text-center" role="status">
          <CheckCircle2
            className="mx-auto text-primary"
            size={48}
            strokeWidth={1.3}
            aria-hidden="true"
          />
          <p className="text-sm leading-7 text-secondary">
            Ulasan Anda sudah diterima oleh superadmin. Setiap masukan membantu kami membuat Menuju
            Akad lebih baik.
          </p>
          <Button onClick={close} className="w-full">
            Selesai
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5" aria-busy={busy}>
          <p className="text-sm leading-6 text-secondary">
            Yang membantu, yang menyulitkan, atau yang Anda harapkan. Kami ingin mendengarnya.
          </p>
          <fieldset disabled={busy}>
            <legend className="mb-2 text-sm font-medium">Penilaian Anda</legend>
            <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label
                  key={value}
                  className={styles.starChoice}
                  onMouseEnter={() => setHover(value)}
                >
                  <input
                    type="radio"
                    name="review-rating"
                    value={value}
                    checked={rating === value}
                    onChange={() => setRating(value)}
                    aria-label={`${value} bintang`}
                    required
                  />
                  <Star
                    size={29}
                    strokeWidth={1.4}
                    fill={value <= (hover || rating) ? "currentColor" : "none"}
                    aria-hidden="true"
                  />
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-secondary" aria-live="polite">
              {rating ? `${rating} dari 5 bintang` : "Pilih bintang yang paling sesuai"}
            </p>
          </fieldset>
          <Field
            label="Nama yang ditampilkan"
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={2}
            maxLength={80}
            autoComplete="name"
            required
            disabled={busy}
          />
          <div className="grid gap-2">
            <label htmlFor={id} className="text-sm font-medium">
              Ceritakan pengalaman Anda
            </label>
            <textarea
              id={id}
              className={styles.textarea}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              minLength={10}
              maxLength={2000}
              rows={4}
              required
              disabled={busy}
              aria-describedby={`${id}-hint`}
              placeholder="Apa yang bisa kami tingkatkan untuk Anda?"
            />
            <span id={`${id}-hint`} className="text-xs text-secondary">
              Minimal 10 karakter · {comment.length}/2000
            </span>
          </div>
          <p className="rounded-control bg-ux-soft p-3 text-xs leading-6 text-secondary">
            Ulasan dikirim privat ke superadmin. Nama dan komentar Anda dapat ditampilkan di landing
            setelah dipilih. Hindari mencantumkan data pribadi.
          </p>
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy} className="w-full">
            <Send size={16} aria-hidden="true" />
            {busy ? "Mengirim…" : "Kirim ulasan"}
          </Button>
        </form>
      )}
    </Dialog>
  );
}
