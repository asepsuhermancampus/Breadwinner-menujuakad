import type { ContractSnapshot } from "@/features/checkout-services/types/checkout";

export const initialContractSnapshotV9: ContractSnapshot = {
  contractId: "ORD-SIM-204",
  version: "v9",
  clientNames: "Andi Ramadhan & Risa Pratiwi",
  eventDateText: "14 Feb 2027 · Bumi Samami, Bandung (WIB)",
  venueText: "Bumi Samami, Bandung",
  items: [
    {
      id: "it-1",
      vendorName: "Aru MUA",
      serviceName: "Paket Akad",
      totalPriceIdr: 8000000,
      dpAmountIdr: 2400000,
      status: "approved",
    },
    {
      id: "it-2",
      vendorName: "Lensa Teduh Photo",
      serviceName: "Foto 8 Jam (Sehari Penuh)",
      totalPriceIdr: 15000000,
      dpAmountIdr: 4500000,
      status: "approved",
    },
    {
      id: "it-3",
      vendorName: "Rona Dekor",
      serviceName: "Cypress Style",
      totalPriceIdr: 12000000,
      dpAmountIdr: 3600000,
      status: "approved",
    },
  ],
  totalValueIdr: 35000000,
  dpAmountIdr: 10500000,
  installments: [
    { termNumber: 1, percentage: 30, dueDateText: "Saat Persetujuan Kontrak", amountIdr: 10500000 },
    { termNumber: 2, percentage: 40, dueDateText: "15 Januari 2027", amountIdr: 14000000 },
    { termNumber: 3, percentage: 30, dueDateText: "07 Februari 2027", amountIdr: 10500000 },
  ],
};
