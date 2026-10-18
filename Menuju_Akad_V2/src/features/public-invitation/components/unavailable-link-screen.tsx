import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";

export function UnavailableLinkScreen() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface p-6 rounded-2xl border border-border text-center space-y-4 shadow-sm">
        <div className="flex justify-center mb-2">
          <BrandLogo variant="cypress" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Tautan Tidak Tersedia</h1>
        <p className="text-sm text-secondary leading-relaxed">
          Tautan mungkin sudah tidak berlaku, kedaluwarsa, atau telah dicabut oleh pengirim. Silakan
          hubungi kedua mempelai untuk mendapatkan tautan undangan baru.
        </p>
        <div className="p-3 bg-subtle border border-border rounded-control text-xs text-muted leading-relaxed">
          <strong>Perlindungan Privasi:</strong> Kami tidak menampilkan identitas pengirim, daftar
          tamu lain, atau detail tiket apa pun dari tautan yang tidak valid.
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-block text-xs text-primary font-semibold hover:underline"
          >
            ← Kembali ke Beranda Menuju Akad
          </Link>
        </div>
      </div>
    </div>
  );
}
