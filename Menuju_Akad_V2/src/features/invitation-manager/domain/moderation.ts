import type { ModerationItem } from "../types/manager";

export function decideModeration(
  current: ModerationItem,
  expectedVersion: number,
  status: "Ditampilkan" | "Disembunyikan",
  reason: string,
  nowIso = new Date().toISOString(),
): { ok: true; item: ModerationItem } | { ok: false; error: string } {
  if (current.version !== expectedVersion || current.status !== "Menunggu") {
    return { ok: false, error: "Kiriman berubah. Muat dan tinjau versi terbaru." };
  }
  if (!reason.trim()) return { ok: false, error: "Alasan keputusan wajib diisi." };
  if (status === "Ditampilkan" && !current.publicationConsent) {
    return { ok: false, error: "Izin publikasi belum diberikan. Kiriman tidak dapat ditampilkan." };
  }
  const version = current.version + 1;
  return {
    ok: true,
    item: {
      ...current,
      status,
      version,
      audit: [
        ...current.audit,
        { status, reason: reason.trim(), version, at: nowIso, actor: "Pasangan (simulasi)" },
      ],
    },
  };
}
