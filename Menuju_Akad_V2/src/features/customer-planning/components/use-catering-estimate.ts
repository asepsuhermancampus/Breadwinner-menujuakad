"use client";
import { useState } from "react";
import { calculateCatering } from "@/features/catering/utils/calculator";
import { cateringGuestSummary } from "../domain/catering-menu";
import {
  cateringSettingsSchema,
  defaultCateringSettings,
  type CateringSettings,
} from "../domain/catering-settings";
export function useCateringEstimate(
  guests: unknown[] | null,
  initial: CateringSettings = defaultCateringSettings,
  saveSettings?: (settings: CateringSettings) => Promise<boolean>,
) {
  const [manual, setInput] = useState({
    invitations: initial.invitations,
    multiplier: initial.multiplier,
    bufferPercent: initial.bufferPercent,
    buffetPercent: initial.buffetPercent,
    stallDishesCount: initial.stallDishesCount,
  });
  const [useGuests, setUseGuests] = useState(initial.useGuests);
  const [baseline, setBaseline] = useState(JSON.stringify(initial));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const settings = { id: "catering-settings" as const, ...manual, useGuests };
  const summary = cateringGuestSummary(guests);
  const automatic = useGuests && summary.guests > 0;
  const input = automatic ? { ...manual, invitations: summary.guests, multiplier: 1 } : manual;
  return {
    input,
    manual,
    setInput,
    automatic,
    setUseGuests,
    summary,
    dirty: JSON.stringify(settings) !== baseline,
    saving,
    saveError,
    canSave: Boolean(saveSettings),
    save: async () => {
      if (saving || !saveSettings) return;
      const parsed = cateringSettingsSchema.safeParse(settings);
      if (!parsed.success) {
        setSaveError("Periksa angka perhitungan sebelum menyimpan.");
        return;
      }
      setSaving(true);
      setSaveError("");
      try {
        if (await saveSettings(parsed.data)) setBaseline(JSON.stringify(parsed.data));
        else setSaveError("Perhitungan belum tersimpan. Periksa pesan di atas atau coba lagi.");
      } catch {
        setSaveError("Perhitungan belum tersimpan. Draf tetap tersedia.");
      } finally {
        setSaving(false);
      }
    },
    result: calculateCatering(input),
  };
}
export type CateringEstimate = ReturnType<typeof useCateringEstimate>;
