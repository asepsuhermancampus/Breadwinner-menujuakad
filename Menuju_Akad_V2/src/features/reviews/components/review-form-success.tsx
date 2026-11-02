"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReviewFormSuccess({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-5 py-4 text-center" role="status">
      <CheckCircle2
        className="mx-auto text-emerald-600 dark:text-emerald-400"
        size={52}
        strokeWidth={1.4}
        aria-hidden="true"
      />
      <div>
        <h3 className="text-lg font-bold text-foreground">Terima Kasih atas Cerita Anda!</h3>
        <p className="mt-2 text-xs leading-relaxed text-secondary sm:text-sm">
          Ulasan Anda telah masuk ke antrean panel <strong>Superadmin</strong>. Tim kami akan
          memverifikasinya sebelum ditampilkan di beranda publik.
        </p>
      </div>
      <Button onClick={onClose} className="w-full">
        Selesai
      </Button>
    </div>
  );
}

