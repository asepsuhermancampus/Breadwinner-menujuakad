export type CateringCalculationInput = {
  invitations: number;
  multiplier: number;
  bufferPercent: number;
  buffetPercent: number;
  stallDishesCount: number;
};

export type CateringCalculationResult = {
  totalBaseGuests: number;
  totalWithBuffer: number;
  bufferPax: number;
  buffetPax: number;
  stallPax: number;
  stallPortionsTotal: number;
  totalPortions: number;
};
