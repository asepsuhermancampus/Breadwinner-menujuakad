import "server-only";
import type { DatabaseSync } from "node:sqlite";

const initialReviews = [
  [
    "Nadia & Fajar",
    5,
    "Awalnya bingung harus mulai dari mana. Setelah semua rencana ada di satu tempat, persiapan jadi lebih tenang dan kami bisa saling bantu.",
    "published",
    "lifetime",
  ],
  [
    "Alya & Rizky",
    5,
    "Paling suka bisa merencanakan bareng pasangan. Catatan anggaran lebih rapi, obrolan tentang pernikahan juga terasa jauh lebih ringan.",
    "published",
    "premium",
  ],
  [
    "Dinda & Arga",
    4,
    "Tampilannya nyaman dibuka dari HP. Checklist membantu kami mengingat hal-hal kecil yang sebelumnya sering terlewat.",
    "published",
    "premium",
  ],
  [
    "Intan & Bagas",
    5,
    "Ruang kecil yang ternyata membantu banyak. Dari menata daftar tamu sampai menyimpan inspirasi, sekarang tidak perlu mencari di banyak catatan.",
    "published",
    "lifetime",
  ],
  [
    "Putri & Ilham",
    5,
    "Desain undangannya terasa personal dan tidak berlebihan. Senang menemukan tempat yang membuat persiapan terasa menyenangkan.",
    "published",
    "premium",
  ],
  [
    "Salsa & Dimas",
    4,
    "Kami jadi punya gambaran pengeluaran yang lebih jelas. Akan makin membantu kalau nanti ada lebih banyak panduan untuk pasangan yang baru mulai.",
    "published",
    "free",
  ],
  [
    "Rani",
    2,
    "Saya sempat kesulitan menemukan menu daftar tamu di layar kecil. Mohon navigasinya dibuat lebih mudah dikenali.",
    "pending",
    "free",
  ],
  [
    "Yoga",
    4,
    "Akan sangat membantu jika ada pengingat jadwal persiapan supaya pekerjaan kecil tidak terlewat menjelang hari acara.",
    "pending",
    "free",
  ],
] as const;

export function seedReviews(db: DatabaseSync) {
  db.exec("BEGIN IMMEDIATE");
  try {
    if (!db.prepare("SELECT 1 FROM review_metadata WHERE key='initial-reviews-v1'").get()) {
      const insert = db.prepare(`INSERT INTO website_reviews
        (id,name,rating,comment,status,created_at,updated_at,seed,tier) VALUES (?,?,?,?,?,?,?,1,?)`);
      const now = Date.now();
      initialReviews.forEach(([name, rating, comment, status, tier], index) => {
        const date = new Date(now - (index + 1) * 86400000).toISOString();
        insert.run(`initial-review-${index + 1}`, name, rating, comment, status, date, date, tier);
      });
      db.prepare(
        "INSERT INTO review_metadata(key,value) VALUES ('initial-reviews-v1','done')",
      ).run();
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
