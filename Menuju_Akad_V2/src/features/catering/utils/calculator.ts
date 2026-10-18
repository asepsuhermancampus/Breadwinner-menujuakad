import type { CateringCalculationInput, CateringCalculationResult } from "../types/catering";

export function calculateCatering(input: CateringCalculationInput): CateringCalculationResult {
  const totalBaseGuests = input.invitations * input.multiplier;
  const bufferPax = Math.round(totalBaseGuests * (input.bufferPercent / 100));
  const totalWithBuffer = totalBaseGuests + bufferPax;
  const buffetPax = Math.round(totalWithBuffer * (input.buffetPercent / 100));
  const stallPax = Math.max(0, totalWithBuffer - buffetPax);
  const stallPortionsTotal = stallPax * input.stallDishesCount;
  const totalPortions = buffetPax + stallPortionsTotal;

  return {
    totalBaseGuests,
    totalWithBuffer,
    bufferPax,
    buffetPax,
    stallPax,
    stallPortionsTotal,
    totalPortions,
  };
}

export const defaultCateringInput: CateringCalculationInput = {
  invitations: 500,
  multiplier: 2,
  bufferPercent: 10,
  buffetPercent: 60,
  stallDishesCount: 4,
};
