"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export function SubscriptionReminder({ expiresAt }: { expiresAt: string | null }) {
  const [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const router = useRouter();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now()),
      first = setTimeout(tick, 0),
      timer = setInterval(tick, 60000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);
  const remaining = expiresAt && now !== null ? Date.parse(expiresAt) - now : 0;
  if (remaining <= 0 || remaining > 15 * 86400000) return null;
  async function renew() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/payments/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "premium", claimDiscount: false, renewal: true }),
        signal: AbortSignal.timeout(20000),
      });
      const data = (await response.json()) as {
        quote?: { intentId: string; totalAmount: number | null };
        error?: string;
      };
      if (!response.ok || !data.quote || data.quote.totalAmount === null)
        throw new Error(data.error ?? "Perpanjangan belum dapat dibuat.");
      router.push(`/checkout/qris?intent=${encodeURIComponent(data.quote.intentId)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Perpanjangan gagal");
    } finally {
      setPending(false);
    }
  }
  return (
    <section
      aria-label="Pengingat masa aktif"
      className="rounded-card border border-amber-300 bg-amber-50 p-5 text-sm"
    >
      <h2 className="font-semibold">
        Premium berakhir dalam {Math.ceil(remaining / 86400000)} hari
      </h2>
      <p className="mt-2">
        Aktif sampai {new Date(expiresAt!).toLocaleDateString("id-ID")}. Perpanjangan menambah 6
        bulan dari akhir masa aktif saat ini.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Button disabled={pending} onClick={() => void renew()}>
          {pending ? "Memproses…" : "Perpanjang Premium"}
        </Button>
        <Link href="/#paket" className="underline">
          Lihat Lifetime
        </Link>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-danger">
          {error}{" "}
          <Link href="/#paket" className="underline">
            Kelola pesanan paket
          </Link>
        </p>
      )}
    </section>
  );
}
