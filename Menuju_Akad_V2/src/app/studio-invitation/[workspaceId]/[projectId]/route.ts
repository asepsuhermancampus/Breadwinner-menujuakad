import { getWorkspaceService } from "@/server/workspaces/runtime";
import { isStudioDocument } from "@/features/invitation-studio/domain/editor-storage";
import { createPreviewHtml } from "@/features/invitation-studio/domain/preview-html";
import { escapePreview } from "@/features/invitation-studio/domain/preview-scene";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ workspaceId: string; projectId: string }> },
) {
  const { workspaceId, projectId } = await params;
  const row = getWorkspaceService()
    .db.prepare(
      "SELECT data FROM workspace_resources WHERE workspace_id=? AND kind='studio-drafts'",
    )
    .get(workspaceId);
  const drafts = row
    ? (JSON.parse(String(row["data"])) as {
        id: string;
        document: unknown;
        activeDocument?: unknown;
      }[])
    : [];
  const draft = drafts.find((d) => d.id === projectId);
  if (
    !draft ||
    !isStudioDocument(draft.document) ||
    draft.document.publication !== "published" ||
    !isStudioDocument(draft.activeDocument)
  )
    return new Response("Undangan tidak tersedia", { status: 404 });
  const document = structuredClone(draft.activeDocument);
  // Only render content actually collected by the customer editor.
  document.sections = document.sections.filter((s) =>
    ["cover", "couple", "closing", "gallery"].includes(s.id),
  );
  const html = createPreviewHtml(document, new URL(req.url).origin, true)
    .replace(
      "</main>",
      `<section><h2>Acara kalian</h2><p>${escapePreview(document.content.date)}</p><p>${escapePreview(document.content.venue)}</p></section></main>`,
    )
    .replace("Pratinjau draf · belum terlihat oleh tamu", "Undangan untuk keluarga dan sahabat");
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
      "Content-Security-Policy":
        "default-src 'none'; img-src 'self' data:; font-src 'self'; style-src 'unsafe-inline'; frame-ancestors 'none'",
    },
  });
}
