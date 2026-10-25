"use client";
import { Button } from "@/components/ui/button";
import type { DiscountOffer } from "../types";

export function QrisDiscountOffer({
  offer,
  disabled,
  onClaim,
}: {
  offer: DiscountOffer;
  disabled: boolean;
  onClaim: () => void;
}) {
  const rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
  return (
    <div className="space-y-3 rounded-2xl border border-primary/20 bg-subtle p-6">
      <h2 className="text-sm font-bold text-foreground">Diskon pengguna baru {offer.percent}%</h2>
      <p className="text-xs leading-relaxed text-secondary">
        Klaim potongan {rupiah.format(offer.discountAmount)} untuk pembayaran pertama. Nominal
        setelah diskon {rupiah.format(offer.amount)}, sebelum kode unik. Total akhir termasuk kode
        unik maksimal {rupiah.format(offer.originalAmount)}.
      </p>
      <Button variant="primary" disabled={disabled} onClick={onClaim}>
        Klaim diskon pengguna baru
      </Button>
      <p className="text-[11px] text-secondary">
        Klaim langsung membuat tagihan QRIS. Diskon tidak dapat ditumpuk.
      </p>
    </div>
  );
}
