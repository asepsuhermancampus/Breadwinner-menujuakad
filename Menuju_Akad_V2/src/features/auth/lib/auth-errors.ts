import type { AuthErrorCode } from "../types/auth-contracts";

const messages: Record<AuthErrorCode, string> = {
  invalid: "Data akses belum cocok. Periksa kembali email/nomor dan sandi/PIN Anda.",
  "wrong-code": "Kode belum cocok. Periksa keenam digit dan coba kembali.",
  expired: "Kode sudah kedaluwarsa. Minta kode baru untuk melanjutkan.",
  "rate-limit": "Terlalu banyak percobaan. Tunggu sebelum mencoba kembali.",
  offline: "Koneksi terputus. Isian tetap tersimpan; periksa koneksi lalu coba kembali.",
  revoked: "Akses verifikasi berakhir atau dicabut. Mulai kembali dari halaman masuk.",
  unavailable: "Layanan belum tersedia. Coba kembali beberapa saat lagi.",
  conflict: "Verifikasi sudah berubah. Mulai kembali agar memakai data terbaru.",
};

export function authErrorMessage(code: AuthErrorCode) {
  return messages[code];
}
