import type { AccountSnapshot } from "@/features/account/types/account";

export const accountFixture: AccountSnapshot = {
  profile: {
    fullName: "Risa Pratiwi",
    email: "risa.pratiwi@gmail.com",
    phone: "+6281234567890",
    culture: "Jawa modern",
    roleLabel: "Mempelai wanita",
    version: 1,
  },
  partner: {
    id: "actor-andi",
    fullName: "Andi Ramadhan",
    nickname: "Andi",
    email: "andi.ramadhan@gmail.com",
    roleLabel: "Mempelai pria",
    accessLabel: "Dapat mengedit",
    connected: true,
    version: 1,
  },
  preferences: {
    inApp: true,
    email: true,
    whatsApp: false,
    reducedMotion: false,
    partnerSync: true,
    discoverable: false,
    version: 1,
  },
  sessions: [
    {
      id: "session-current",
      label: "Chrome · Windows",
      location: "Bandung, Indonesia",
      lastActive: "Aktif sekarang",
      current: true,
    },
    {
      id: "session-other",
      label: "Safari · iPhone",
      location: "Bandung, Indonesia",
      lastActive: "Terakhir aktif 2 jam lalu",
      current: false,
    },
  ],
  memberships: [{ id: "workspace-couple", label: "Pasangan", detail: "Aktif · pemilik ruang" }],
  entitlement: { plan: "premium", expiresAt: "2026-11-30T23:59:59+07:00" },
  asOf: new Date().toISOString(),
  invoices: [
    {
      id: "invoice-demo-premium",
      label: "Premium · 6 bulan",
      date: "2026-05-30",
      amountIdr: 149_000,
      status: "paid",
    },
  ],
  verificationHint: "Kode simulasi: 882016. Tidak ada kode nyata yang dikirim.",
};
