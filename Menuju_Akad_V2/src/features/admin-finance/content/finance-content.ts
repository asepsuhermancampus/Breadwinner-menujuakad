import type { FinanceContext, FinanceRole, FinanceState } from "../types/admin-finance";

export const rupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
export function createFinanceState(): FinanceState {
  return {
    reconciliations: [
      {
        id: "TX-8421",
        paymentId: "PAY8421",
        amount: 4_500_000,
        internal: "paid",
        provider: "settled",
        version: 17,
      },
      {
        id: "TX-8422",
        paymentId: "PAY8422",
        amount: 6_000_000,
        internal: "paid",
        provider: "settled",
        version: 17,
      },
      {
        id: "TX-8423",
        paymentId: "PAY8423",
        amount: 2_000_000,
        internal: "waiting",
        provider: "settled",
        version: 17,
      },
      {
        id: "TX-8424",
        paymentId: "PAY8424",
        amount: 1_500_000,
        internal: "expired",
        provider: "expired",
        version: 17,
      },
    ],
    payouts: [
      {
        id: "WD-105",
        vendor: "Kalyana Photography & Cinema",
        amount: 5_000_000,
        holdAmount: 5_000_000,
        bankLast4: "1188",
        bankVerified: true,
        disputed: false,
        serviceComplete: true,
        version: 1,
        status: "accepted",
        scheduledFor: null,
      },
      {
        id: "WD-106",
        vendor: "Arunika Decor",
        amount: 4_750_000,
        holdAmount: 4_750_000,
        bankLast4: "5301",
        bankVerified: true,
        disputed: true,
        serviceComplete: true,
        version: 1,
        status: "accepted",
        scheduledFor: null,
      },
      {
        id: "WD-107",
        vendor: "Svara Music",
        amount: 2_000_000,
        holdAmount: 2_000_000,
        bankLast4: "2250",
        bankVerified: false,
        disputed: false,
        serviceComplete: true,
        version: 1,
        status: "accepted",
        scheduledFor: null,
      },
      {
        id: "WD-108",
        vendor: "Luma Studio",
        amount: 1_250_000,
        holdAmount: 1_250_000,
        bankLast4: "4461",
        bankVerified: true,
        disputed: false,
        serviceComplete: false,
        version: 1,
        status: "accepted",
        scheduledFor: null,
      },
    ],
    dispute: { id: "DS-019", orderId: "ORD-8204", paymentId: "PAY8300", active: true, version: 3 },
    payment: {
      id: "PAY8300",
      captured: 15_000_000,
      refunded: 0,
      reservedRefund: 0,
      version: 4,
      status: "captured",
    },
    config: { version: 17, feeBps: 500, bankName: "BCA", bankLast4: "9087", manualQris: false },
    otp: null,
    operations: {},
    audit: [],
  };
}
export function createFinanceContext(role: FinanceRole): FinanceContext {
  return {
    role,
    actorId:
      role === "support" ? "farah-support" : role === "finance" ? "raka-finance" : "nadia-permata",
    online: true,
    sessionValid: true,
    permissions: {
      reconcile: role !== "support",
      payout: role !== "support",
      refund: role !== "support",
      settings: role === "superadmin",
      export: role !== "support",
    },
    now: () => Date.now(),
  };
}
export const historicalFinanceAudit = [
  ["25 Okt · 10.48", "Naya · Keuangan", "CFG-18", "Bank & fee v17 → v18", "Diterapkan · vignette"],
  [
    "25 Okt · 10.46",
    "Pemilik vendor",
    "WD-105",
    "Pencairan Rp5.000.000",
    "Diterima · belum transfer",
  ],
  ["25 Okt · 10.40", "Webhook worker", "TX-8422", "Event duplikat", "No-op · tanpa jurnal baru"],
  ["25 Okt · 10.36", "Naya · KYB", "KYB-341", "Catatan revisi rekening", "Revisi diminta"],
  ["25 Okt · 10.32", "Naya · Keuangan", "RF:PAY8300:01", "Refund Rp5.000.000", "Menunggu provider"],
];
