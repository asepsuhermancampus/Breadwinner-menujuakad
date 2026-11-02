export interface EditorialFaqItem {
  id: string;
  num: string;
  question: string;
  answer: string;
}

export const editorialFaqs: EditorialFaqItem[] = [
  {
    id: "couple-sync",
    num: "01",
    question: "Bagaimana cara Menuju Akad menghubungkan calon suami dan istri?",
    answer:
      "Cukup salin tautan undangan privat di dasbor Anda dan kirimkan ke pasangan. Sekali klik, akun kalian berdua langsung terhubung dalam satu ruang perencana. Setiap progres berkas, alokasi anggaran, dan checklist vendor tersinkronisasi otomatis tanpa ada pesan penting yang tertimbun di chat WhatsApp.",
  },
  {
    id: "kua-guidance",
    num: "02",
    question: "Bagaimana panduan berkas KUA membantu agar kami tidak bolak-balik?",
    answer:
      "Modul berkas Kemenag memandu langkah demi langkah secara runtut: mulai dari surat pengantar kantor desa atau kelurahan, persetujuan kedua mempelai, hingga hasil tes kesehatan catin. Tersedia juga panduan khusus surat rekomendasi nikah jika Anda dan pasangan menikah di luar kecamatan asal.",
  },
  {
    id: "catering-calculator",
    num: "03",
    question: "Bagaimana kalkulator katering mencegah kekurangan atau pemborosan makanan?",
    answer:
      "Sistem secara otomatis menghitung rasio ideal antara porsi buffet utama (60%) dan porsi gubukan (4x jumlah undangan). Perhitungan ini disusun berdasarkan standar industri pernikahan Indonesia sehingga hidangan tamu dipastikan mencukupi tanpa membuang anggaran berlebih.",
  },
  {
    id: "digital-guestbook-qr",
    num: "04",
    question: "Apakah undangan digital dilengkapi buku tamu dan kode QR meja resepsi?",
    answer:
      "Ya. Setiap tamu undangan mendapatkan tautan personal eksklusif dengan konfirmasi kehadiran (RSVP) real-time dan kode QR unik. Saat hari H resepsi, penerima tamu cukup memindai kode QR dari ponsel untuk proses check-in kilat tanpa antrean buku tamu fisik.",
  },
  {
    id: "lifetime-pricing",
    num: "05",
    question: "Apa perbedaan paket Lifetime dengan sistem langganan bulanan?",
    answer:
      "Paket Lifetime adalah investasi satu kali bayar untuk selamanya tanpa masa kedaluwarsa dan tanpa biaya perpanjangan. Anda dan pasangan mendapatkan akses penuh ke seluruh tema undangan digital kustom, fitur manajemen tamu lanjutan, dan ekspor laporan persiapan pernikahan.",
  },
  {
    id: "privacy-commitment",
    num: "06",
    question: "Apakah data finansial dan rincian acara pernikahan kami aman?",
    answer:
      "Sangat aman. Menuju Akad beroperasi 100% bebas dari iklan pihak ketiga. Seluruh rincian anggaran, kontak tamu, dan dokumen pernikahan disimpan dengan enkripsi aman dan hanya dapat diakses oleh Anda dan pasangan yang telah terhubung.",
  },
];
