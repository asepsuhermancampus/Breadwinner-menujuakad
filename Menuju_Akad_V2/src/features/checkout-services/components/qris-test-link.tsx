import Link from "next/link";

export function QrisTestLink() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-subtle p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span className="font-semibold text-foreground">Uji pembayaran QRIS</span>
        <p className="mt-0.5 text-[11px] text-secondary">
          Harga awal Rp5.000. Tersedia diskon pengguna baru; total termasuk kode unik tidak melebihi
          harga awal.
        </p>
      </div>
      <Link
        href="/checkout/qris"
        className="inline-flex shrink-0 items-center justify-center rounded-control border border-border bg-surface px-3 py-1.5 font-semibold text-foreground hover:bg-subtle"
      >
        Uji QRIS Rp5.000 →
      </Link>
    </div>
  );
}
