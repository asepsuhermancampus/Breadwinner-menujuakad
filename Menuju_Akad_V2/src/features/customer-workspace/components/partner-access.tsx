"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export function PartnerAccess({ partner }: { partner: boolean }) {
  const [workspaces, setWorkspaces] = useState<{ id: string; name: string; role: string }[]>([]);
  useEffect(() => {
    const abort = new AbortController();
    void fetch("/api/workspace/partner", { signal: abort.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((b: { workspaces?: typeof workspaces } | null) => {
        if (!abort.signal.aborted) setWorkspaces(b?.workspaces ?? []);
      })
      .catch(() => {});
    return () => abort.abort();
  }, [partner]);
  const router = useRouter(),
    [token, setToken] = useState(""),
    [invite, setInvite] = useState("");
  const [message, setMessage] = useState(""),
    [pending, setPending] = useState(false);
  async function act(action: string, workspaceId?: string) {
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/workspace/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, token, workspaceId }),
        signal: AbortSignal.timeout(15000),
      });
      const body = (await response.json()) as { token?: string; error?: string };
      if (!response.ok) throw new Error(body.error ?? "Permintaan pasangan gagal");
      if (body.token) {
        setInvite(body.token);
        setMessage(
          "Kode berlaku 24 jam dan hanya dapat dipakai sekali. Pasangan masuk dengan Google lalu menempelkan kode di bagian ini.",
        );
      } else {
        setMessage(action === "revoke" ? "Akses pasangan dicabut." : "Workspace diperbarui.");
        router.refresh();
      }
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Permintaan pasangan gagal");
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="space-y-4 rounded-card border border-ux-border bg-surface p-6">
      <h2 className="font-semibold">Workspace untuk berdua</h2>
      {workspaces
        .filter((w) => w.role === "partner")
        .map((w) => (
          <Button
            key={w.id}
            variant="secondary"
            disabled={pending}
            onClick={() => void act("select", w.id)}
          >
            Buka ruang pasangan · {w.name}
          </Button>
        ))}
      {partner ? (
        <>
          <p className="text-sm text-secondary">
            Kalian sedang membuka workspace bersama pasangan.
          </p>
          <Button disabled={pending} onClick={() => void act("own")}>
            Buka workspace pribadi
          </Button>
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            <Button disabled={pending} onClick={() => void act("invite")}>
              Buat kode undangan pasangan
            </Button>
            <Button variant="secondary" disabled={pending} onClick={() => void act("revoke")}>
              Cabut akses pasangan
            </Button>
          </div>
          {invite && (
            <label className="grid gap-2 text-sm">
              Kode undangan
              <textarea
                readOnly
                value={invite}
                className="rounded-control border border-ux-border p-3 font-mono text-xs"
              />
            </label>
          )}
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              void act("accept");
            }}
          >
            <label className="grid gap-1 text-sm">
              Punya kode dari pasangan?
              <input
                required
                minLength={64}
                maxLength={64}
                value={token}
                onChange={(e) => setToken(e.target.value.trim())}
                className="rounded-control border border-ux-border p-3 font-mono text-xs"
              />
            </label>
            <Button type="submit" variant="secondary" disabled={pending}>
              Gabung workspace pasangan
            </Button>
          </form>
        </>
      )}
      {message && (
        <p role="status" className="text-sm">
          {message}
        </p>
      )}
    </section>
  );
}
