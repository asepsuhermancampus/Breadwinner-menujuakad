export const MARKETPLACE_CATEGORIES = [
  "Prewedding",
  "Busana / Fitting",
  "MUA",
  "Seserahan / Mahar",
  "Dokumentasi",
  "Dekorasi / Florist",
  "Katering",
  "Kue / Dessert",
  "Souvenir",
  "Undangan Digital / Cetak / Hybrid",
  "Denah Ilustrasi",
] as const;

export type MarketplaceCategory = (typeof MARKETPLACE_CATEGORIES)[number];

export type VendorPackage = {
  id: string;
  name: string;
  description: string;
  priceIdr: number;
  durationHours?: number;
};

export type MarketplaceVendor = {
  id: string;
  slug: string;
  name: string;
  category: MarketplaceCategory;
  city: string;
  distanceKm: number;
  startingPriceIdr: number;
  availableOn14Feb: boolean;
  unavailabilityReason?: string;
  sessionTime?: string;
  rating: number;
  reviewCount: number;
  isComingSoon?: boolean;
  packages: VendorPackage[];
};

export type BundleItem = {
  id: string;
  vendorId: string;
  vendorName: string;
  serviceName: string;
  unitPriceIdr: number;
  quantity: number;
  status: "available" | "unavailable" | "replaced";
};
