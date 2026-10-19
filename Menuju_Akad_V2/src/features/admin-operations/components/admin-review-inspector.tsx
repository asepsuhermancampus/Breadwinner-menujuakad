import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Icon } from "@/components/ui/icon";
import type { ReviewItem, ReviewDecision } from "../types/admin";
export function AdminReviewInspector({
  item,
  isKyb,
  action,
  allowed,
  onAction,
  onReview,
  onProof,
}: {
  item: ReviewItem;
  isKyb: boolean;
  action: ReviewDecision["action"];
  allowed: boolean;
  onAction: (action: ReviewDecision["action"]) => void;
  onReview: () => void;
  onProof: () => void;
}) {
  return (
    <aside className="grid content-start gap-5 rounded-card bg-ux-dock p-6">
      <div>
        <h2 className="text-lg font-semibold">
          {isKyb ? `${item.id} · ${item.vendor}` : `${item.vendor} · ${item.kind} v${item.version}`}
        </h2>
        <p className="mt-2 text-xs text-secondary">
          {isKyb
            ? `Usulan rekening · pengajuan v${item.version}`
            : `Deteksi 25 Okt 10.20 · ruleset 4.2 · ${item.id}`}
        </p>
      </div>
      <div className="grid gap-3 text-sm leading-relaxed">
        {isKyb && <Icon name="file-text" size={26} />}
        <p>{item.excerpt}</p>
        <p className={isKyb ? "text-secondary" : "font-mono text-danger"}>{item.signal}</p>
        {isKyb && (
          <Button
            variant="secondary"
            size="small"
            className="w-fit"
            disabled={!allowed}
            onClick={onProof}
          >
            Buka pratinjau berizin
          </Button>
        )}
      </div>
      <Select
        label="Keputusan"
        value={action}
        onChange={(e) => onAction(e.target.value as ReviewDecision["action"])}
      >
        <option value="revision">
          {isKyb ? "Minta revisi dokumen rekening" : "Minta perbaikan caption"}
        </option>
        <option value="approved">Setujui setelah pemeriksaan</option>
        {!isKyb && <option value="false-positive">False positive · keputusan manusia</option>}
      </Select>
      <Button
        className="bg-primary"
        disabled={!allowed || (isKyb && action === "approved" && !item.proofComplete)}
        onClick={onReview}
      >
        {action === "false-positive"
          ? "False positive…"
          : action === "approved"
            ? "Setujui"
            : isKyb
              ? "Kirim catatan revisi"
              : "Kirim revisi"}
      </Button>
      <p className="text-xs leading-relaxed text-secondary">
        {isKyb
          ? "Persetujuan diblokir sampai berkas dan kecocokan identitas lolos. BCA •••• 1188 tetap aktif."
          : "Keputusan untuk v7 tidak boleh diterapkan diam-diam ke caption v8. Semua keputusan mencatat aktor, alasan dan snapshot."}
      </p>
    </aside>
  );
}
