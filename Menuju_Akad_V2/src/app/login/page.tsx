import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
export default function LoginPage() {
  return (
    <main id="main-content" className="mx-auto grid min-h-dvh max-w-lg content-center gap-5 p-8">
      <p className="font-serif text-2xl">menuju akad</p>
      <h1 className="text-3xl font-semibold">Ruang kalian sedang disiapkan.</h1>
      <p className="text-sm leading-relaxed text-secondary">
        Layanan akun V2 belum terhubung. Kamu dapat mencoba pratinjau lokal batch 1 dengan data
        contoh.
      </p>
      <Link href="/preview-ui/auth/login" className={buttonVariants()}>
        Buka pratinjau batch 1
      </Link>
    </main>
  );
}
