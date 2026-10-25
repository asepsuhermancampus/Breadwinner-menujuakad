"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Status } from "@/components/ui/status";

const ERROR_MESSAGES = new Map<string, string>([
  ["AccessDenied", "Akses Google dibatalkan atau akun tidak diizinkan."],
  [
    "Configuration",
    "Layanan autentikasi mengalami kendala di server. Gunakan email dan password atau coba Google kembali.",
  ],
  [
    "AccountLinkRequired",
    "Akun dengan email ini sudah ada. Masuk dengan password, lalu hubungkan Google dari pengaturan keamanan akun.",
  ],
  ["OAuthSignin", "Gagal memulai sambungan dengan Google. Silakan coba kembali."],
  ["OAuthCallbackError", "Gagal memproses respons autentikasi Google."],
  ["OAuthCreateAccount", "Tidak dapat membuat sesi untuk akun Google."],
  ["Callback", "Proses autentikasi Google dibatalkan atau berakhir."],
]);

function AuthQueryAlertContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  if (!error && searchParams.get("registered") === "1")
    return (
      <Status tone="success">
        Pendaftaran berhasil. Masuk dengan email dan password yang sudah kalian buat.
      </Status>
    );
  if (!error) return null;

  const message =
    ERROR_MESSAGES.get(error) ?? "Terjadi kendala saat autentikasi Google. Silakan coba kembali.";

  return (
    <div className="mb-4">
      <Status tone="danger">{message}</Status>
    </div>
  );
}

export function AuthQueryAlert() {
  return (
    <Suspense fallback={null}>
      <AuthQueryAlertContent />
    </Suspense>
  );
}
