"use client";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export function CancelPlanOrder({
  cancel,
  disabled,
  error,
}: {
  cancel: () => Promise<boolean>;
  disabled: boolean;
  error: string;
}) {
  const [open, setOpen] = useState(false),
    [pending, setPending] = useState(false);
  async function confirm() {
    setPending(true);
    try {
      if (await cancel()) setOpen(false);
    } finally {
      setPending(false);
    }
  }
  return (
    <>
      <Button variant="secondary" disabled={disabled || pending} onClick={() => setOpen(true)}>
        Batalkan pesanan
      </Button>
      <Dialog
        open={open}
        title="Batalkan pesanan?"
        onClose={() => {
          if (!pending) setOpen(false);
        }}
      >
        <p className="text-sm text-secondary">
          Pesanan akan dibatalkan di aplikasi. Jangan membayar QR lama; QR di penyedia mungkin masih
          dapat dipindai sampai kedaluwarsa. Jika pembayaran telanjur masuk, kami tetap
          memverifikasinya.
        </p>
        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <Button disabled={pending} onClick={() => void confirm()}>
            {pending ? "Membatalkan…" : "Ya, batalkan pesanan"}
          </Button>
          <Button variant="secondary" disabled={pending} onClick={() => setOpen(false)}>
            Tetap lanjutkan
          </Button>
        </div>
      </Dialog>
    </>
  );
}
