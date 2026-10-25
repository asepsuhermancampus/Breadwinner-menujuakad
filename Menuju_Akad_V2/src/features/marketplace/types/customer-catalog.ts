export interface CatalogVendor {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
}
export interface CatalogOrder {
  id: string;
  items: CatalogVendor[];
  total: number;
  message: string;
  status: "requested" | "contacted" | "cancelled";
  contactEmail?: string;
  createdAt: string;
}
