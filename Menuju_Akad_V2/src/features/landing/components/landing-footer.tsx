import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-ux-border bg-canvas py-16 text-secondary">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <BrandLogo variant="cypress" width={32} height={15} />
              <span className="font-sans text-xl font-semibold tracking-tight text-primary">
                menuju akad<span className="text-rose">.</span>
              </span>
            </Link>
            <p className="max-w-xs text-xs leading-relaxed text-secondary">
              Rencana yang rapi.
              <br />
              Perjalanan yang tetap milik kalian.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-sans text-xs font-semibold tracking-wider text-primary uppercase">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#tentang" className="transition hover:text-foreground">
                  Tentang
                </a>
              </li>
              <li>
                <a href="#cara-kerja" className="transition hover:text-foreground">
                  Cara kerja
                </a>
              </li>
              <li>
                <a href="#paket" className="transition hover:text-foreground">
                  Paket
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-sans text-xs font-semibold tracking-wider text-primary uppercase">
              Jelajahi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#undangan" className="transition hover:text-foreground">
                  Contoh undangan
                </a>
              </li>
              <li>
                <a href="#faq" className="transition hover:text-foreground">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-sans text-xs font-semibold tracking-wider text-primary uppercase">
              Ruang Kalian
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/auth/register" className="transition hover:text-foreground">
                  Daftar gratis
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-foreground">
                  Masuk
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-sans text-xs font-semibold tracking-wider text-primary uppercase">
              Informasi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-muted">Privasi</span>
              </li>
              <li>
                <span className="text-muted">Syarat penggunaan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ux-border pt-8 text-xs text-muted">
          <span>© 2026 Menuju Akad</span>
          <span>Satu langkah bersama, menuju hari bahagia.</span>
        </div>
      </div>
    </footer>
  );
}
