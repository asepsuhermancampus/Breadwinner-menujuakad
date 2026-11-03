"use client";

import { useState, useEffect } from "react";

/**
 * Menentukan apakah interaksi pengguna (misal klik bagian kosong)
 * harus membatalkan status fokus irisan.
 */
export function shouldDismissSliceFocus(
  target: Element | null,
  activeSliceId: string | null,
): boolean {
  if (!activeSliceId) return false;
  return !target?.closest(`[data-slice-id="${activeSliceId}"]`);
}

/**
 * Hook untuk mengelola interaktivitas fokus potongan donut chart.
 * Mendukung pembatalan fokus ketika pengguna menekan area kosong,
 * menekan tombol Escape, atau mengklik di luar irisan aktif.
 */
export function useDonutFocus() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (shouldDismissSliceFocus(target, selectedId)) {
        setSelectedId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedId(null);
      }
    };

    // Beri delay sesaat agar pointerdown yang memicu fokus tidak langsung membatalkannya
    const timer = setTimeout(() => {
      document.addEventListener("pointerdown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);
    }, 20);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedId]);

  const toggleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return {
    selectedId,
    setSelectedId,
    toggleSelect,
  };
}
