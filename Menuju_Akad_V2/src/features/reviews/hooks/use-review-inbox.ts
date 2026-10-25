"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PrivateReview, ReviewPage } from "../types";
import { reviewRequest } from "../lib/review-request";

export function useReviewInbox(query: string) {
  const [data, setData] = useState<ReviewPage<PrivateReview> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const sequence = useRef(0);
  const active = useRef(false);
  const savingRef = useRef(false);
  const invalidate = useCallback(() => {
    sequence.current += 1;
  }, []);
  const refresh = useCallback(async () => {
    const current = ++sequence.current;
    setLoading(true);
    setError("");
    try {
      const next = await reviewRequest<ReviewPage<PrivateReview>>(
        `/api/superadmin/reviews?${query}`,
      );
      if (active.current && current === sequence.current) setData(next);
    } catch (cause) {
      if (active.current && current === sequence.current)
        setError(cause instanceof Error ? cause.message : "Inbox belum dapat dimuat.");
    } finally {
      if (active.current && current === sequence.current) setLoading(false);
    }
  }, [query]);
  useEffect(() => {
    active.current = true;
    const timer = window.setTimeout(() => {
      void refresh();
    }, 250);
    return () => {
      active.current = false;
      invalidate();
      window.clearTimeout(timer);
    };
  }, [refresh, invalidate]);
  async function moderate(id: string, status: "published" | "hidden") {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(id);
    setError("");
    setNotice("");
    try {
      await reviewRequest(`/api/superadmin/reviews/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (!active.current) return;
      setNotice(
        status === "published"
          ? "Ulasan sudah ditampilkan di landing."
          : "Ulasan sudah disembunyikan dari landing.",
      );
      await refresh();
    } catch (cause) {
      if (active.current)
        setError(cause instanceof Error ? cause.message : "Perubahan belum tersimpan.");
    } finally {
      savingRef.current = false;
      if (active.current) setSaving("");
    }
  }
  return { data, loading, saving, error, notice, refresh, moderate };
}
