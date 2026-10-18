import type { GiftAccount, GuestExperienceContent, RsvpSession } from "../types/experience";

// Deterministic guest microsite content per Batch 05 contract (frames 58–64).
// Public-facing content only: no contact list, no addresses, no private quota.
export const guestExperienceContent: GuestExperienceContent = {
  eyebrow: "THE WEDDING · 14 FEBRUARI 2027",
  heading: "Andi\n& Risa",
  couple: [
    { name: "Andi Ramadhan", family: "Putra dari Bapak H. Budi Santoso & Ibu Hj. Siti Aminah" },
    { name: "Risa Pratiwi", family: "Putri dari Bapak H. Dedi Prasetyo & Ibu Hj. Ratna Dewi" },
  ],
  story: [
    { year: "2022", description: "Sebuah pertemuan, lalu percakapan yang tak selesai." },
    { year: "2025", description: "Saling mengenal keluarga, menyamakan arah." },
    { year: "2027", description: "Melangkah bersama menuju akad." },
  ],
  eventNote: {
    title: "Minggu, 14 Februari 2027",
    body: "Akad 08.00 WIB · Resepsi 10.00–14.00 WIB. Bumi Samami, Bandung.",
  },
  dressTones: ["Ivory", "Sage", "Cypress"],
  gallery: [
    {
      src: "/assets/images/editorial-1.png",
      alt: "Mempelai diiringi keluarga",
      caption: "Satu langkah menuju hari kita.",
    },
    {
      src: "/assets/images/editorial-2.png",
      alt: "Momen lamaran",
      caption: "Dua keluarga, satu tujuan.",
    },
    {
      src: "/assets/images/editorial-4.png",
      alt: "Persiapan akad",
      caption: "Detail kecil yang bermakna.",
    },
    {
      src: "/assets/images/editorial-5.png",
      alt: "Hari bahagia",
      caption: "Tawa yang ingin kami ingat.",
    },
  ],
  wishes: [
    {
      id: "w-1",
      publicName: "Tamu undangan",
      body: "Semoga perjalanan kalian selalu dipenuhi kebaikan.",
    },
  ],
  giftsInactive: true,
};

export const rsvpSessionsFixture: RsvpSession[] = [
  {
    id: "akad",
    name: "Akad nikah",
    time: "08.00–09.00 WIB",
    maxQuota: 2,
    status: "ATTENDING",
    pax: 1,
  },
  {
    id: "resepsi",
    name: "Resepsi",
    time: "10.00–14.00 WIB",
    maxQuota: 2,
    status: "ATTENDING",
    pax: 2,
  },
];

export const rsvpExpiryText =
  "Batas perubahan: 7 Feb 2027, 23.59 WIB. Kuota diperiksa ulang saat disimpan.";

export const guestGuideTexts = {
  heading: "Ruang untuk\nmerayakan.",
  intro: "Budi & Partner · akses personal untuk Akad dan Resepsi.",
  mapDisclaimer: "Denah skematik contoh, bukan peta lokasi terverifikasi. Ikuti petugas di venue.",
  transportTitle: "Transportasi & aksesibilitas",
  transportBody:
    "Area drop-off tersedia. Hubungi pengirim undangan jika membutuhkan bantuan mobilitas atau rekomendasi penginapan.",
  faqQuestion: "FAQ · boleh membawa anak?",
  faqAnswer:
    "Silakan mengikuti jumlah orang pada undangan personal Anda. Hubungi pasangan bila ada kebutuhan khusus.",
  dressHeading: "Berpakaian nyaman, bernuansa hangat.",
};

export const guestWishesTexts = {
  heading: "Sebait doa,\nsejuta makna.",
  intro: "Tidak perlu membuat akun atau mengirim hadiah.",
  consentLabel: "Saya setuju ucapan ini ditampilkan setelah disetujui pasangan.",
  approvedHeading: "Doa yang sudah ditampilkan",
  moderationNote: {
    title: "Tampil setelah disetujui",
    body: "Anda dapat menarik ucapan. Nomor WhatsApp dan nama lengkap dari undangan tidak otomatis menjadi nama publik.",
  },
};

export const guestMomentsTexts = {
  heading: "Bagikan momen\nyang hangat.",
  intro: "Satu foto dapat menyimpan banyak cerita.",
  restrictions: "JPG / PNG · maksimal 10 MB per foto. Lokasi EXIF tidak ditampilkan kepada publik.",
  consentLabel: "Saya memiliki izin orang dalam foto dan setuju foto ini ditinjau untuk publikasi.",
  queueNote: {
    title: "Belum dipublikasikan",
    body: "Foto baru masuk antrean setelah izin diberikan dan unggahan berhasil. Pasangan meninjau sebelum foto terlihat oleh tamu lain.",
  },
};

export const guestGiftsTexts = {
  heading: "Doa Anda\nsudah berarti.",
  intro: "Memberi hadiah tidak menjadi syarat kehadiran atau RSVP.",
  moduleNote: {
    title: "Pratinjau modul opsional",
    body: "Modul ini nonaktif di undangan aktif Andi & Risa. Contoh rekening disamarkan; bukan instruksi pembayaran nyata.",
  },
  transferNote: {
    title: "Transfer langsung ke penerima",
    body: "Menuju Akad tidak menahan atau memindahkan hadiah. Tidak ada QRIS aktif pada pratinjau ini.",
  },
  shippingPrivacy:
    "Alamat rumah tidak dibuka di laman umum. Minta melalui percakapan dengan pengirim undangan.",
};

export const guestGalleryTexts = {
  heading: "Cerita dalam gambar.",
  title: "Beberapa momen kami",
  videoNote: {
    title: "Video & siaran langsung",
    body: "Konten eksternal belum dimuat. Putar hanya atas pilihan Anda.",
  },
  lightboxCaption: "Satu langkah menuju hari kita.",
};

export const giftAccountsFixture: GiftAccount[] = [
  { bank: "BCA", recipient: "Andi Ramadhan", maskedAccount: "•••• 4821" },
  { bank: "Mandiri", recipient: "Risa Pratiwi", maskedAccount: "•••• 9012" },
];
