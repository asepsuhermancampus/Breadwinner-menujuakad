import { z } from "zod";
const asset = z
  .string()
  .regex(/^\/assets\/images\/[A-Za-z0-9/_.-]+\.(png|jpe?g|webp)$/)
  .refine((value) => !value.includes(".."));
const catalogSchema = z.object({
  profile: z.object({
    name: z.string().min(1).max(120),
    ownerName: z.string().min(1),
    category: z.string().min(1),
    city: z.string().min(1).max(80),
    address: z.string().min(1),
    description: z.string().max(1000),
    pinSet: z.boolean(),
    cover: asset,
  }),
  packages: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1).max(100),
        description: z.string(),
        priceIdr: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
        active: z.boolean(),
        duration: z.string(),
        deliverables: z.array(z.string()),
        image: asset,
      }),
    )
    .max(100),
});
export const vendorCatalogStorageKey = "ma-vendor-catalog-v1:kalyana";
export function decodeVendorCatalog(raw: string) {
  return catalogSchema.parse(JSON.parse(raw));
}
