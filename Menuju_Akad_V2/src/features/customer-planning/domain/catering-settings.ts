import { z } from "zod";
const count = z.number().int().min(0).max(100000);
const percent = z.number().int().min(0).max(100);
export const cateringSettingsSchema = z
  .object({
    id: z.literal("catering-settings"),
    invitations: count,
    multiplier: count,
    bufferPercent: percent,
    buffetPercent: percent,
    stallDishesCount: count,
    useGuests: z.boolean(),
  })
  .strict();
export type CateringSettings = z.infer<typeof cateringSettingsSchema>;
export const defaultCateringSettings: CateringSettings = {
  id: "catering-settings",
  invitations: 0,
  multiplier: 2,
  bufferPercent: 10,
  buffetPercent: 60,
  stallDishesCount: 4,
  useGuests: true,
};
