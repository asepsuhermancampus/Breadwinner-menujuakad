"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PublicReviewPage } from "../types";
import { reviewRequest } from "../lib/review-request";

export function usePublicReviews() {
  const [data, setData] = useState<PublicReviewPage | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const sequence = useRef(0);
  const mounted = useRef(false);
  const invalidate = useCallback(() => {
    sequence.current += 1;
  }, []);
  const load = useCallback(async (page = 1) => {
    const current = ++sequence.current;
    setBusy(true);
    setError("");
    try {
      const next = await reviewRequest<PublicReviewPage>(`/api/reviews?page=${page}`);
      if (!mounted.current || current !== sequence.current) return;
      setData((previous) => ({
        ...next,
        items:
          page === 1
            ? next.items
            : [...(previous?.items ?? []), ...next.items].filter(
                (item, index, items) => items.findIndex((other) => other.id === item.id) === index,
              ),
      }));
    } catch (cause) {
      if (mounted.current && current === sequence.current)
        setError(cause instanceof Error ? cause.message : "Ulasan belum dapat dimuat.");
    } finally {
      if (mounted.current && current === sequence.current) setBusy(false);
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    const refresh = () => {
      void load();
    };
    const timer = window.setTimeout(refresh, 0);
    window.addEventListener("focus", refresh);
    return () => {
      mounted.current = false;
      invalidate();
      window.clearTimeout(timer);
      window.removeEventListener("focus", refresh);
    };
  }, [load, invalidate]);
  return { data, busy, error, load };
}
