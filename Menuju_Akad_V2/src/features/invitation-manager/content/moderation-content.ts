import type { ModerationItem, ModerationSummary } from "../types/manager";

// Deterministic moderation queue per Batch 05 contract frame 65:
// 12 pending = 8 wishes + 4 photos; 26 shown; 3 hidden. Four rows are a sample subset.
export const moderationSummary: ModerationSummary = {
  pendingTotal: 12,
  pendingWishes: 8,
  pendingPhotos: 4,
  shown: 26,
  hidden: 3,
  mode: "Sebelum tampil",
};

export const moderationItems: ModerationItem[] = [
  {
    id: "mod-1",
    publicationConsent: true,
    version: 1,
    audit: [],
    guest: "Budi & Partner",
    kind: "Foto",
    submittedAt: "10.22",
    status: "Menunggu",
    publicName: "Tamu undangan",
    consentEvidence:
      "Izin publikasi dicatat · 25 Okt 2026, 10.22. Tetap tinjau wajah, privasi, dan kelayakan sebelum menampilkan.",
    photo: "/assets/images/generated-1.png",
  },
  {
    id: "mod-2",
    publicationConsent: true,
    version: 1,
    audit: [],
    guest: "Nadia Putri",
    kind: "Ucapan",
    submittedAt: "10.20",
    status: "Menunggu",
    publicName: "Nadia",
    consentEvidence: "Consent publikasi dicentang saat mengirim.",
    body: "Semoga menjadi keluarga yang sakinah dan penuh keberkahan.",
  },
  {
    id: "mod-3",
    publicationConsent: true,
    version: 1,
    audit: [],
    guest: "Fajar & keluarga",
    kind: "Ucapan",
    submittedAt: "10.14",
    status: "Menunggu",
    publicName: "Fajar & keluarga",
    consentEvidence: "Consent publikasi dicentang saat mengirim.",
    body: "Barakallahu lakuma. Selamat menuju hari akad!",
  },
  {
    id: "mod-4",
    publicationConsent: false,
    version: 1,
    audit: [],
    guest: "Gita Maharani",
    kind: "Ucapan",
    submittedAt: "10.08",
    status: "Menunggu",
    publicName: "Tamu undangan",
    consentEvidence:
      "Consent publikasi tidak dicentang; kiriman tetap privat dan tidak dapat ditampilkan.",
    body: "Selamat Andi & Risa! Doa terbaik dari kami.",
  },
];
