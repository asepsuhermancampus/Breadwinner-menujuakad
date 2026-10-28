"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FeatureLock } from "./feature-lock";
import { PageSkeleton } from "@/components/ui/page-skeleton";
type Domain = { hostname: string; challenge: string; state: string };
export function DomainSettings({ enabled, owner = true }: { enabled: boolean; owner?: boolean }) {
  const [domain, setDomain] = useState<Domain | null>(null),
    [hostname, setHostname] = useState("");
  const [message, setMessage] = useState(""),
    [pending, setPending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    if (enabled)
      void fetch("/api/workspace/domain", { cache: "no-store", signal: controller.signal })
        .then(async (res) => {
          if (!res.ok) throw new Error("Pengaturan domain belum dapat dimuat.");
          return res.json();
        })
        .then((body: { domain?: Domain }) => {
          if (!controller.signal.aborted) setDomain(body.domain ?? null);
        })
        .catch(() => {
          if (!controller.signal.aborted) setMessage("Pengaturan domain belum dapat dimuat.");
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoaded(true);
        });
    return () => controller.abort();
  }, [enabled]);
  async function submit(verify: boolean) {
    if (!enabled) return;
    setPending(true);
    setMessage("");
    try {
      const res = await fetch("/api/workspace/domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verify ? { action: "verify" } : { hostname }),
        signal: AbortSignal.timeout(15000),
      });
      const body = (await res.json()) as { domain?: Domain; error?: string };
      if (!res.ok) throw new Error(body.error ?? "Domain belum dapat disimpan");
      setDomain(body.domain ?? null);
      setMessage(
        verify
          ? "Pemeriksaan DNS selesai."
          : "Tambahkan record verifikasi DNS untuk mengaktifkan domain.",
      );
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Domain gagal diproses");
    } finally {
      setPending(false);
    }
  }
  if (enabled && !loaded && !message) {
    return <PageSkeleton variant="form" label="Memuat pengaturan domain" />;
  }
  const content = (
    <section
      id="feature-custom-domain"
      tabIndex={-1}
      className="space-y-4 rounded-card border border-ux-border bg-surface p-6"
    >
      <h2 className="font-semibold">Custom domain</h2>
      {
        <>
          <p className="text-sm text-secondary">
            Daftarkan domain milik kalian. Domain baru aktif setelah DNS, routing hosting, dan HTTPS
            selesai diverifikasi.
          </p>
          <form
            className="flex flex-wrap gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              void submit(false);
            }}
          >
            <label className="grid flex-1 gap-1 text-sm">
              Domain
              <input
                required
                placeholder="undangan.domainkalian.com"
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
                className="rounded-control border border-ux-border p-3"
              />
            </label>
            <Button type="submit" disabled={pending}>
              Simpan domain
            </Button>
          </form>
          {domain && (
            <div className="space-y-2 break-words text-sm">
              <p>
                {domain.hostname} ·{" "}
                {domain.state === "pending-hosting"
                  ? "DNS terverifikasi; menunggu pengaturan hosting & HTTPS"
                  : "Menunggu verifikasi DNS"}
              </p>
              <p>
                Record TXT: <code>_menuju-akad.{domain.hostname}</code>
              </p>
              <p>
                Nilai: <code>{domain.challenge}</code>
              </p>
              <Button variant="secondary" disabled={pending} onClick={() => void submit(true)}>
                Periksa DNS
              </Button>
            </div>
          )}
        </>
      }
      {message && (
        <p role="status" className="text-sm">
          {message}
        </p>
      )}
    </section>
  );
  return enabled ? (
    content
  ) : (
    <FeatureLock
      title="Custom domain"
      plan="Lifetime"
      showPlans={owner}
      description={
        owner
          ? undefined
          : "Pengaturan domain hanya dapat diubah oleh pemilik ruang. Hubungi pemilik untuk mengelolanya."
      }
    >
      {content}
    </FeatureLock>
  );
}
