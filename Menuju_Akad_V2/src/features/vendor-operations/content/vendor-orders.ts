import type { VendorOrder } from "../types/vendor";

export function createVendorOrders(): VendorOrder[] {
  const requests = [
    [
      "ITM-2041",
      "Rama & Sinta",
      "2027-02-14",
      "package-full-day",
      "Photography full day",
      15_000_000,
    ],
    ["ITM-2042", "Dara & Reza", "2027-02-20", "package-akad", "Akad intimate", 7_500_000],
    ["ITM-2043", "Nisa & Bagas", "2027-02-21", "package-full-day", "Wedding full day", 15_000_000],
    ["ITM-2044", "Alya & Faris", "2027-02-27", "package-cinema", "Cinema add-on", 5_000_000],
  ] as const;
  return requests.map(([id, client, eventDate, packageId, packageName, priceIdr]) => ({
    id,
    vendorId: "vendor-kalyana",
    client,
    eventDate,
    venue: "Bandung",
    packageId,
    status: "pending",
    version: 2,
    decision: null,
    contract: {
      version: 2,
      title: `Kontrak ${id} · v2`,
      packageName,
      priceIdr,
      scope: ["Dokumentasi sesuai paket yang disepakati", "Hasil akhir mengikuti kontrak versi 2"],
      terms: [
        {
          id: "deposit",
          label: "Termin 1 · DP 30%",
          amountIdr: (priceIdr * 3) / 10,
          dueDate: "Setelah konfirmasi",
        },
        {
          id: "second",
          label: "Termin 2 · 40%",
          amountIdr: (priceIdr * 4) / 10,
          dueDate: "Sesuai kontrak",
        },
        {
          id: "final",
          label: "Termin 3 · 30%",
          amountIdr: (priceIdr * 3) / 10,
          dueDate: eventDate,
        },
      ],
    },
  }));
}
