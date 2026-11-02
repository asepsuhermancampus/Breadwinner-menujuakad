export interface FaqItem {
  id: string;
  category: "kolaborasi" | "kua" | "biaya" | "tamu";
  q: string;
  a: string;
}

export const faqCategories = [
  { id: "kolaborasi", label: "Kolaborasi Pasangan" },
  { id: "kua", label: "Syarat KUA Kemenag" },
  { id: "biaya", label: "Anggaran & Katering" },
  { id: "tamu", label: "Undangan & Tamu QR" },
] as const;

export const landingFaqs: FaqItem[] = [
  // 1. Kolaborasi Pasangan
  {
    id: "sync-problem",
    category: "kolaborasi",
    q: "Bagaimana cara Menuju Akad mencegah catatan tercecer di chat?",
    a: "Calon suami dan istri terhubung dalam satu dasbor privat. Setiap keputusan, ide vendor, dan progres tugas tersinkronisasi otomatis tanpa ada pesan penting yang tertimbun obrolan WhatsApp.",
  },
  {
    id: "single-account",
    category: "kolaborasi",
    q: "Apakah kami berdua harus mendaftar dan membayar terpisah?",
    a: "Tidak perlu. Cukup satu akun perencana, lalu undang pasangan melalui tautan instan. Kalian berdua memiliki hak akses penuh ke ruang persiapan yang sama tanpa biaya dobel.",
  },
  {
    id: "data-privacy",
    category: "kolaborasi",
    q: "Apakah data rencana pernikahan kami aman dan privat?",
    a: "Sangat aman. Menuju Akad 100% bebas dari iklan komersial pihak ketiga. Seluruh rincian keuangan, nomor kontak tamu, dan dokumen hanya dapat diakses oleh Anda dan pasangan.",
  },

  // 2. Syarat KUA Kemenag
  {
    id: "kua-steps",
    category: "kua",
    q: "Bagaimana sistem membantu agar kami tidak bolak-balik KUA?",
    a: "Modul kami memandu runtut syarat resmi Kemenag langkah demi langkah: mulai dari surat pengantar kelurahan, persetujuan catin, hingga hasil tes kesehatan tanpa ada berkas yang tertinggal.",
  },
  {
    id: "numpang-nikah",
    category: "kua",
    q: "Bagaimana jika lokasi akad nikah kami berbeda kecamatan atau kota?",
    a: "Tersedia panduan khusus surat rekomendasi nikah (numpang nikah) antar KUA asal dan tujuan, lengkap dengan syarat dokumen yang wajib dibawa.",
  },
  {
    id: "kua-timing",
    category: "kua",
    q: "Kapan waktu paling ideal untuk mulai mengurus berkas ke KUA?",
    a: "Disarankan 1 hingga 3 bulan sebelum hari H. Dasbor memberi pengingat otomatis agar pengurusan berkas tuntas sebelum batas minimal 10 hari kerja Kemenag.",
  },

  // 3. Anggaran & Katering
  {
    id: "catering-ratio",
    category: "biaya",
    q: "Bagaimana kalkulator katering mencegah pemborosan makanan?",
    a: "Sistem menghitung otomatis rasio ideal porsi buffet utama (60%) dan porsi gubukan (4x jumlah tamu) sesuai basis undangan, sehingga hidangan terjamin cukup tanpa biaya mubazir.",
  },
  {
    id: "savings-commitment",
    category: "biaya",
    q: "Bisakah kami memantau komitmen tabungan bersama calon pasangan?",
    a: "Bisa. Tersedia pencatatan setoran tabungan berdua dan alokasi dana vendor (venue, katering, MUA) yang terdistribusi transparan dan teratur secara real-time.",
  },
  {
    id: "vendor-dp",
    category: "biaya",
    q: "Apakah ada pencatatan uang muka (DP) dan termin vendor?",
    a: "Ya. Setiap pembayaran vendor dapat dicatat status pelunasannya beserta tanggal jatuh tempo agar arus kas persiapan pernikahan tetap terkontrol aman.",
  },

  // 4. Undangan & Tamu QR
  {
    id: "digital-invitation",
    category: "tamu",
    q: "Apa kemudahan undangan digital dibanding sebar undangan manual?",
    a: "Bebas biaya cetak, bisa dikirim dengan sapaan nama personal dan batas kuota kehadiran (pax), serta dilengkapi konfirmasi kehadiran (RSVP) real-time otomatis.",
  },
  {
    id: "qr-reception",
    category: "tamu",
    q: "Bagaimana alur scan QR di meja penerima tamu saat resepsi?",
    a: "Setiap undangan membawa kode QR unik. Penerima tamu cukup memindai QR lewat ponsel untuk check-in instan tanpa antrean panjang di buku tamu fisik.",
  },
  {
    id: "no-watermark",
    category: "tamu",
    q: "Apakah undangan digital bebas dari watermark dan iklan?",
    a: "Ya, 100% bebas watermark dan tanpa iklan pihak ketiga. Tampilan undangan eksklusif dan murni menjadi milik momen sakral pernikahan kalian berdua.",
  },
];
