import type { FollowUpFilters, FollowUpGuest } from "../types/followup";

// Deterministic follow-up segment per Batch 05 contract frame 66:
// 150 unanswered / 42 eligible / 108 excluded. 4 sample rows pre-selected (Hendra/Salsa/Bayu/Ayu).
export const followUpContext = {
  unanswered: 150,
  eligible: 42,
  excluded: 108,
  sessionLabel: "Resepsi 10.00–14.00",
  sessionNote: "14 Feb 2027 · kuota per undangan",
};

export const followUpCampaignId = "pernikahan-resepsi-followup-2026-10-25";
export const followUpSnapshotAt = "2026-10-25T10:00:00+07:00";

export const followUpFilters: FollowUpFilters = {
  side: "Semua pihak",
  session: "Resepsi 10.00–14.00",
  condition: "Belum jawab + izin WA",
};

export const followUpGuests: FollowUpGuest[] = [
  {
    id: "fu-1",
    name: "Hendra & Partner",
    category: "Teman",
    side: "Andi",
    quota: 2,
    lastWaDate: "18 Okt 2026",
    lastSentAt: "2026-10-18T10:00:00+07:00",
    contactPhone: "+6281234567801",
    rsvpStatus: "PENDING",
    consent: "Diberikan",
    selected: true,
  },
  {
    id: "fu-2",
    name: "Salsa Putri",
    category: "Keluarga",
    side: "Risa",
    quota: 1,
    lastWaDate: "17 Okt 2026",
    lastSentAt: "2026-10-17T10:00:00+07:00",
    contactPhone: "+6281234567802",
    rsvpStatus: "PENDING",
    consent: "Diberikan",
    selected: true,
  },
  {
    id: "fu-3",
    name: "Bayu & keluarga",
    category: "Keluarga",
    side: "Andi",
    quota: 3,
    lastWaDate: "16 Okt 2026",
    lastSentAt: "2026-10-16T10:00:00+07:00",
    contactPhone: "+6281234567803",
    rsvpStatus: "PENDING",
    consent: "Diberikan",
    selected: true,
  },
  {
    id: "fu-4",
    name: "Ayu Maharani",
    category: "Teman",
    side: "Risa",
    quota: 2,
    lastWaDate: "15 Okt 2026",
    lastSentAt: "2026-10-15T10:00:00+07:00",
    contactPhone: "+6281234567804",
    rsvpStatus: "PENDING",
    consent: "Diberikan",
    selected: true,
  },
  {
    id: "fu-5",
    name: "Tono Wijaya",
    category: "Kolega",
    side: "Andi",
    quota: 2,
    lastWaDate: "18 Okt 2026",
    lastSentAt: "2026-10-18T10:00:00+07:00",
    contactPhone: "+6281234567805",
    rsvpStatus: "PENDING",
    consent: "Diberikan",
    selected: false,
  },
  {
    id: "fu-6",
    name: "Laras Ayu",
    category: "Teman",
    side: "Risa",
    quota: 1,
    lastWaDate: "14 Okt 2026",
    lastSentAt: "2026-10-14T10:00:00+07:00",
    contactPhone: "+6281234567806",
    rsvpStatus: "PENDING",
    consent: "Diberikan",
    selected: false,
  },
];

export const followUpNote = {
  title: "Tinjau lagi sebelum mengirim",
  body: "Persetujuan, nomor, jawaban terbaru, dan jeda kirim diperiksa saat dispatch. Tamu yang sudah menjawab atau mencabut izin tidak lagi diikutkan.",
};
