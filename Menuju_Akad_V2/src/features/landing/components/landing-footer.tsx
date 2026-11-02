import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-ux-border bg-canvas py-16 text-secondary">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {/* Brand & Tagline */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <BrandLogo variant="cypress" width={32} height={15} />
              <span className="font-sans text-xl font-semibold tracking-tight text-brand-secondary">
                menuju akad<span className="text-rose">.</span>
              </span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-secondary">
              Platform perencanaan pernikahan berdua terpadu.
              Dari berkas KUA, anggaran vendor, hingga undangan digital dan QR check-in tamu.
            </p>
            <div className="text-[11px] text-muted">
              <span>Satu langkah terencana menuju hari bahagia.</span>
            </div>
          </div>

          {/* Kolom 1: Perencanaan & Biaya */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs font-semibold tracking-wider text-brand-secondary uppercase">
              Perencanaan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#tentang" className="transition hover:text-foreground">
                  Checklist & Berkas KUA
                </a>
              </li>
              <li>
                <a href="#tentang" className="transition hover:text-foreground">
                  Tabungan & Anggaran
                </a>
              </li>
              <li>
                <a href="#tentang" className="transition hover:text-foreground">
                  Kalkulator Katering
                </a>
              </li>
              <li>
                <a href="#cara-kerja" className="transition hover:text-foreground">
                  Rundown Acara
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 2: Undangan & Tamu */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs font-semibold tracking-wider text-brand-secondary uppercase">
              Tamu & Undangan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#undangan" className="transition hover:text-foreground">
                  Desain Undangan Digital
                </a>
              </li>
              <li>
                <a href="#undangan" className="transition hover:text-foreground">
                  Buku Tamu & RSVP
                </a>
              </li>
              <li>
                <a href="#cara-kerja" className="transition hover:text-foreground">
                  QR Check-in Akad
                </a>
              </li>
              <li>
                <a href="#ulasan" className="transition hover:text-foreground">
                  Cerita & Ulasan Pengantin
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Ruang Akun */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs font-semibold tracking-wider text-brand-secondary uppercase">
              Ruang Kalian
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="transition hover:text-foreground">
                  Buka Dasbor Gratis
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-foreground">
                  Masuk ke Ruang Bersama
                </Link>
              </li>
              <li>
                <a href="#paket" className="transition hover:text-foreground">
                  Pilihan Paket
                </a>
              </li>
              <li>
                <a href="#faq" className="transition hover:text-foreground">
                  Pusat Pertanyaan (FAQ)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ux-border pt-8 text-xs text-muted">
          <span>© 2026 Menuju Akad. Hak cipta dilindungi.</span>
          <span className="text-[11px]">Dirancang untuk kemudahan calon pengantin di Indonesia.</span>
        </div>
      </div>
    </footer>
  );
}
