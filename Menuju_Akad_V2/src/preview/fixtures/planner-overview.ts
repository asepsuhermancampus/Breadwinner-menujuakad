import type { PlannerOverviewData } from "@/features/planner-overview/types/overview";

export const weddingOverviewFixture: PlannerOverviewData = {
  dateContext: "Minggu, 25 Oktober 2026",
  greeting: "Selamat pagi, Andi & Risa.",
  countdownLabel: "H–112 · Menuju akad",
  eventDetail: "14 Feb 2027 · Bumi Samami, Bandung",
  readinessPercent: 84,
  readinessLabel: "Siap untuk hari istimewa",
  metrics: [
    { id: "m-1", label: "Checklist tugas", value: "21/25", detail: "3 tugas untuk hari ini" },
    { id: "m-2", label: "Dokumen KUA", value: "5/7", detail: "2 berkas Andi perlu perhatian" },
    {
      id: "m-3",
      label: "Target tabungan",
      value: "75%",
      detail: "Rp 112.500.000 terkumpul",
      isMono: true,
    },
    { id: "m-4", label: "Vendor terkonfirmasi", value: "13/14", detail: "1 menunggu persetujuan" },
  ],
  focusTasks: [
    {
      id: "f-1",
      title: "Konfirmasi jadwal fitting ke-2",
      pic: "Bersama",
      dueDate: "25 Okt",
      completed: false,
    },
    {
      id: "f-2",
      title: "Unggah sertifikat Elsimil",
      pic: "Andi",
      dueDate: "25 Okt",
      completed: false,
    },
    {
      id: "f-3",
      title: "Finalisasi menu test food",
      pic: "Risa",
      dueDate: "25 Okt",
      completed: false,
    },
  ],
  upcomingAgenda: [
    {
      id: "a-1",
      day: "25 OKT",
      time: "15:00",
      title: "Fitting busana ke-2",
      venue: "Nara Attire · Bersama",
    },
    {
      id: "a-2",
      day: "27 OKT",
      time: "11:00",
      title: "Test food katering",
      venue: "Dapur Rasa · Risa & Ibu",
    },
  ],
  bannerMessage: "Sertifikat Elsimil dan rekomendasi nikah Andi perlu dilengkapi sebelum 30 Okt.",
  rundownHintTitle: "Rundown tak perlu dimulai dari nol.",
  rundownHintDetail: "Susun otomatis dari jadwal MUA, dokumentasi, dan katering yang dipesan.",
  partnerActivity: "● Andi baru menyelesaikan dokumen KTP & KK · 12 menit lalu",
};

export const engagementOverviewFixture: PlannerOverviewData = {
  dateContext: "Minggu, 25 Oktober 2026",
  greeting: "Selamat pagi, Andi & Risa.",
  countdownLabel: "H–28 · Menuju lamaran",
  eventDetail: "22 Nov 2026 · Bandung",
  readinessPercent: 60,
  readinessLabel: "Siap untuk hari istimewa",
  metrics: [
    { id: "em-1", label: "Tugas lamaran", value: "6/10", detail: "4 tugas belum selesai" },
    { id: "em-2", label: "Keluarga", value: "2/2", detail: "Kedua keluarga terkonfirmasi" },
    {
      id: "em-3",
      label: "Anggaran",
      value: "60%",
      detail: "Rp 12.000.000 dari Rp 20 jt",
      isMono: true,
    },
    { id: "em-4", label: "Seserahan", value: "2/6", detail: "2 kotak siap dibawa" },
  ],
  focusTasks: [
    {
      id: "ef-1",
      title: "Konfirmasi jumlah keluarga",
      pic: "Bersama",
      dueDate: "25 Okt",
      completed: false,
    },
    {
      id: "ef-2",
      title: "Pilih cincin lamaran",
      pic: "Andi",
      dueDate: "25 Okt",
      completed: false,
    },
    {
      id: "ef-3",
      title: "Tentukan konsep hantaran",
      pic: "Risa",
      dueDate: "26 Okt",
      completed: false,
    },
  ],
  upcomingAgenda: [
    {
      id: "ea-1",
      day: "27 OKT",
      time: "19:30",
      title: "Obrolan dua keluarga",
      venue: "Video call · Bersama",
    },
    {
      id: "ea-2",
      day: "01 NOV",
      time: "10:00",
      title: "Survei lokasi lamaran",
      venue: "Rumah keluarga Risa",
    },
  ],
  bannerMessage: "Tanggal dan anggaran lamaran terpisah dari rencana pernikahan.",
  rundownHintTitle: "Satu acara, satu rencana yang rapi.",
  rundownHintDetail: "Gunakan checklist lamaran yang sudah kami siapkan.",
  partnerActivity: "● Rencana lamaran tersinkronisasi dengan pasangan",
};
