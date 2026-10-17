export const onboardingHeadings = {
  profile: [
    "Kenali kalian berdua",
    "Mulai dari data dasar. Kamu bisa melengkapinya bersama pasangan nanti.",
  ],
  events: [
    "Seperti apa hari istimewa kalian?",
    "Gunakan perkiraan dulu. Semua detail bisa diubah kapan saja.",
  ],
  partner: [
    "Ajak pasangan ke ruang kalian",
    "Bagikan tautan atau QR untuk mencoba kolaborasi pada preview lokal.",
  ],
  success: [
    "Kalian sudah terhubung",
    "Rencana berikutnya bisa kalian buat bersama dalam simulasi lokal.",
  ],
} as const;

export const onboardingOrder = ["profile", "events", "partner", "success"] as const;
