"use client";
import { useState } from "react";
import { calculateCatering } from "@/features/catering/utils/calculator";
import { cateringGuestSummary } from "../domain/catering-menu";
export function useCateringEstimate(guests: unknown[] | null) {
  const [manual, setInput] = useState({
    invitations: 0,
    multiplier: 2,
    bufferPercent: 10,
    buffetPercent: 60,
    stallDishesCount: 4,
  });
  const [useGuests, setUseGuests] = useState(true);
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
    result: calculateCatering(input),
  };
}
export type CateringEstimate = ReturnType<typeof useCateringEstimate>;
