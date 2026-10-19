import Link from "next/link";
import { requireDevelopmentAccess } from "@/server/services/development-access";
import { BrandLogo } from "@/components/ui/brand-logo";
export const dynamic = "force-dynamic";
export default function OperationsDevelopmentPage() {
  requireDevelopmentAccess();
  return (
    <main id="main-content" className="mx-auto grid max-w-4xl gap-8 px-5 py-16">
      <BrandLogo />
      <div>
        <p className="font-mono text-xs text-warning">PRATINJAU INTERNAL · PRESET 3</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Ruang operasional Menuju Akad
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-secondary">
          Data contoh untuk meninjau alur Vendor, Brand Ambassador dan Superadmin. Rilis #43 tidak
          berubah. Tidak ada transaksi bank, OTP, pengiriman pesan atau perubahan produksi.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Vendor", "Kalyana Photography & Cinema", "/dev/vendor"],
          ["Brand Ambassador", "Sinta Larasati · Gold 15%", "/dev/ba"],
          ["Superadmin", "Nadia · Finance / Support terbatas", "/dev/admin"],
        ].map(([title, detail, href]) => (
          <Link
            key={href}
            href={href!}
            className="grid min-h-36 gap-3 rounded-card border border-ux-border bg-surface p-6 hover:bg-ux-soft"
          >
            <span className="text-lg font-semibold">{title}</span>
            <span className="text-sm text-secondary">{detail}</span>
            <span className="text-sm font-medium text-primary">Buka pratinjau →</span>
          </Link>
        ))}
      </div>
      <Link href="/dashboard" className="text-sm font-medium text-primary">
        Kembali ke ruang pasangan →
      </Link>
    </main>
  );
}
