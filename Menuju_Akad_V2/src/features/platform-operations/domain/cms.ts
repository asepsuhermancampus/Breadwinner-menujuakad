import type { ContentEntry, GateContext } from "../types/operations";
import { accepted, blocked, guardOperation } from "./guards";
export function saveContentDraft(entry: ContentEntry, text: string, context: GateContext) {
  const gate = guardOperation({
    ...context,
    action: "cms.write",
    version: entry.draft ?? entry.active,
  });
  if (!gate.ok) return { ...gate, entry };
  if (text.trim().length < 12) return { ...blocked("Konten draf minimal 12 karakter."), entry };
  return {
    ...accepted("Draf tersimpan. Konten aktif dan entitlement pembeli tetap pada versinya."),
    entry: {
      ...entry,
      publishedText: entry.publishedText ?? entry.text,
      text: text.trim(),
      draft: (entry.draft ?? entry.active) + 1,
    },
  };
}
export function publishContent(input: {
  entry: ContentEntry;
  context: GateContext;
  seo: boolean;
  legal: boolean;
  acknowledged: boolean;
  reason: string;
}) {
  const { entry, context, seo, legal, acknowledged, reason } = input;
  const gate = guardOperation({
    ...context,
    action: "cms.write",
    version: entry.draft ?? entry.active,
  });
  if (!gate.ok) return { ...gate, entry };
  if (!entry.draft) return { ...blocked("Belum ada draf untuk direview."), entry };
  if (!seo || !legal || !acknowledged || reason.trim().length < 8)
    return {
      ...blocked("Review SEO, dampak legal, alasan dan konfirmasi versi diperlukan."),
      entry,
    };
  return {
    ...accepted(
      `Publikasi v${entry.draft} disimulasikan. Proyek Andi & Risa v3 serta entitlement Premium tidak berubah.`,
    ),
    entry: { ...entry, publishedText: entry.text, active: entry.draft, draft: null },
  };
}
