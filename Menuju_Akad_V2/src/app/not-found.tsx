import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main id="main-content" className="mx-auto grid min-h-dvh max-w-lg content-center gap-5 p-8">
      <p className="text-sm text-secondary">Menuju Akad</p>
      <h1 className="text-3xl font-semibold">Halaman belum tersedia</h1>
      <p className="text-sm text-secondary">
        Tautan ini tidak tersedia. Kembali ke halaman masuk untuk melanjutkan.
      </p>
      <Link className={buttonVariants()} href="/login">
        Kembali ke halaman masuk
      </Link>
    </main>
  );
}
