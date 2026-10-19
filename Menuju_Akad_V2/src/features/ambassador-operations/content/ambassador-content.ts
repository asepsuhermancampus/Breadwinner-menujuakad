import type { AmbassadorContext, AmbassadorState } from "../types/ambassador";

export const ambassadorIdentity = {
  name: "Sinta Larasati",
  tier: "Gold",
  rateBps: 1500,
  vendorCode: "BA-SINTA-2026",
  coupleCode: "SINTA2026",
};
export const ambassadorRecruits = [
  {
    name: "Kalyana Photography",
    status: "Aktif",
    orders: 12,
    eligibleFeeIdr: 1_000_000,
    commissionIdr: 150_000,
    held: false,
  },
  {
    name: "Arunika Decor",
    status: "Aktif · sengketa",
    orders: 8,
    eligibleFeeIdr: 1_000_000,
    commissionIdr: 150_000,
    held: true,
  },
  {
    name: "Luma Bridal",
    status: "Aktif",
    orders: 4,
    eligibleFeeIdr: 0,
    commissionIdr: 0,
    held: false,
  },
  {
    name: "Svara Ensemble",
    status: "KYB",
    orders: 0,
    eligibleFeeIdr: 0,
    commissionIdr: 0,
    held: false,
  },
];
export function createAmbassadorState(): AmbassadorState {
  return {
    ownerId: "ba-sinta",
    version: 1,
    bank: { name: "BCA", last4: "4029", verified: true },
    withdrawals: [],
    audit: [],
    commissions: [
      {
        id: "OPENING",
        sourceId: "opening-2026-10",
        date: "1 Okt",
        label: "Saldo awal periode",
        program: "historical",
        amountIdr: 6_000_000,
        eligibleFeeIdr: 0,
        status: "available",
        version: 1,
      },
      {
        id: "COM-061",
        sourceId: "A892",
        date: "15 Okt",
        label: "COM-061 · #A892",
        program: "couple",
        amountIdr: 250_000,
        eligibleFeeIdr: 0,
        status: "available",
        version: 1,
      },
      {
        id: "COM-062",
        sourceId: "B721",
        date: "20 Okt",
        label: "COM-062 · #B721",
        program: "couple",
        amountIdr: 150_000,
        eligibleFeeIdr: 0,
        status: "available",
        version: 1,
      },
      {
        id: "COM-V031",
        sourceId: "kalyana-fee-oct",
        date: "24 Okt",
        label: "COM-V031 · Kalyana",
        program: "vendor",
        amountIdr: 150_000,
        eligibleFeeIdr: 1_000_000,
        status: "pending",
        version: 1,
      },
      {
        id: "COM-V032",
        sourceId: "arunika-fee-oct",
        date: "25 Okt",
        label: "COM-V032 · Arunika",
        program: "vendor",
        amountIdr: 150_000,
        eligibleFeeIdr: 1_000_000,
        status: "held",
        version: 1,
      },
    ],
  };
}
export function createAmbassadorContext(state = createAmbassadorState()): AmbassadorContext {
  return {
    role: "ambassador",
    actorId: state.ownerId,
    ownerId: state.ownerId,
    online: true,
    sessionValid: true,
    sandbox: true,
    availability: "hidden",
    permissions: { withdraw: true, referralCopy: true, export: true, attributionWrite: false },
    latestVersion: state.version,
    disputed: false,
  };
}
