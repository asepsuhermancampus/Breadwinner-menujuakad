import type {
  AnalyticsFixture,
  DomainSetup,
  InvitationManagerSummary,
  InvitationProject,
  ThemeComparisonRow,
} from "../types/manager";

// Deterministic sandbox content per Batch 05 contract frames 53–57, 65.
// Static demo content owned by the feature; no network, storage, or fixture imports.
export const invitationManagerSummary: InvitationManagerSummary = {
  projectCount: 3,
  publishedCount: 1,
  draftCount: 2,
  weddingGuestPoolLabel: "350 undangan",
  activeVersionLabel: "v3",
  activeVersionNote: "Draf v4 tetap terpisah",
  packageLabel: "Premium",
};

export const invitationProjects: InvitationProject[] = [
  {
    id: "inv-wedding-main",
    kind: "WEDDING",
    state: "PUBLISHED",
    title: "Pernikahan utama",
    eventDateText: "14 Feb 2027 · 350 undangan",
    invitationCount: 350,
    activeVersion: 3,
    draftVersion: 4,
    slug: "andi-risa",
    slugStatus: "LIVE",
    sourcePool: null,
    thumbnail: "/assets/images/editorial-1.png",
  },
  {
    id: "inv-engagement",
    kind: "ENGAGEMENT",
    state: "DRAFT",
    title: "Lamaran keluarga",
    eventDateText: "22 Nov 2026 · Belum ada tamu",
    invitationCount: 0,
    activeVersion: null,
    draftVersion: 1,
    slug: null,
    slugStatus: "NOT_PUBLISHED",
    sourcePool: null,
    thumbnail: "/assets/images/editorial-2.png",
  },
  {
    id: "inv-wedding-vip",
    kind: "WEDDING_VIP",
    state: "DRAFT",
    title: "Pernikahan · VIP",
    eventDateText: "Varian dari Pernikahan · Subset 12 dari 350",
    invitationCount: 12,
    activeVersion: null,
    draftVersion: 1,
    slug: null,
    slugStatus: "NOT_PUBLISHED",
    sourcePool: "inv-wedding-main",
    thumbnail: "/assets/images/editorial-3.png",
  },
];

export const managerNote = {
  title: "Acara terpisah, varian tetap terhubung",
  body: "Lamaran memiliki data tamu sendiri. Varian VIP memakai subset dari daftar Pernikahan; tidak menambah 12 undangan baru. Domain khusus masih Hidden dan tidak menjadi entri publik.",
};

export const domainSetup: DomainSetup = {
  domain: "undangan.andi-risa.example",
  simulated: true,
  releaseNote: "PREVIEW INTERNAL · DOMAIN HIDDEN",
  records: [
    {
      type: "CNAME",
      host: "undangan",
      value: "cname.menujuakad.example",
      detected: true,
      note: "Terdeteksi · simulasi",
    },
    {
      type: "TXT",
      host: "_menuju-verify.undangan",
      value: "ma_demo_9f21",
      detected: false,
      note: "Belum terdeteksi",
    },
  ],
  checks: [
    { id: "TXT_OWNERSHIP", label: "Kepemilikan TXT", state: "Menunggu", pass: false },
    { id: "CNAME_TARGET", label: "Arah CNAME", state: "Sesuai · simulasi", pass: true },
    { id: "HTTPS_CERT", label: "Sertifikat HTTPS", state: "Belum diterbitkan", pass: false },
  ],
};

export const themeComparisonRows: ThemeComparisonRow[] = [
  { aspect: "Yang dibandingkan", editorial: "Editorial Light", cypress: "Cypress Modern" },
  { aspect: "Akses akun Premium", editorial: "Termasuk", cypress: "Termasuk" },
  {
    aspect: "Gerakan default",
    editorial: "Fade ringan · bisa dimatikan",
    cypress: "Fade ringan · bisa dimatikan",
  },
  {
    aspect: "Konten & RSVP",
    editorial: "Sama · tanpa input ulang",
    cypress: "Sama · tanpa input ulang",
  },
  {
    aspect: "Keterbacaan",
    editorial: "Serif editorial, latar terang",
    cypress: "Kontras terang di cypress",
  },
];

export const analyticsFixture: AnalyticsFixture = {
  range: "19–25 Okt 2026",
  uniqueVisitors: 280,
  sessions: 340,
  personalOpens: 210,
  onlineAnswers: 168,
  onlineConversion: 80,
  daily: [
    { label: "19 Okt", sessions: 24 },
    { label: "20 Okt", sessions: 28 },
    { label: "21 Okt", sessions: 36 },
    { label: "22 Okt", sessions: 44 },
    { label: "23 Okt", sessions: 48 },
    { label: "24 Okt", sessions: 72 },
    { label: "25 Okt", sessions: 88 },
  ],
  devices: [
    { label: "Ponsel", sessions: 245 },
    { label: "Desktop", sessions: 75 },
    { label: "Tablet", sessions: 20 },
  ],
  funnel: [
    { label: "Undangan terdaftar", value: 350 },
    { label: "Membuka tautan personal", value: 210 },
    { label: "RSVP daring · konversi 80%", value: 168 },
  ],
  reconciliation: {
    onlineAttend: 150,
    onlineDecline: 18,
    manualAttend: 20,
    manualDecline: 12,
    crmAttend: 170,
    crmDecline: 30,
  },
};
