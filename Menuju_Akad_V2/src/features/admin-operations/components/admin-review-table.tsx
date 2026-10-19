import { Button } from "@/components/ui/button";
import { OperationalBadge } from "@/features/vendor-operations/components/operational-feedback";
import type { ReviewItem } from "../types/admin";
export function AdminReviewTable({
  rows,
  item,
  isKyb,
  onSelect,
}: {
  rows: ReviewItem[];
  item: ReviewItem;
  isKyb: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-card border border-ux-border">
      <table className="w-full min-w-[450px] text-left text-xs">
        <caption className="sr-only">
          {isKyb ? "Antrean KYB vendor" : "Antrean moderasi konten"}
        </caption>
        <thead className="bg-ux-dock text-secondary">
          <tr>
            <th className="p-4 font-medium">{isKyb ? "Vendor" : "Vendor / konten"}</th>
            <th className="p-4 font-medium">{isKyb ? "Jenis" : "Indikasi"}</th>
            <th className="p-4 font-medium">Status</th>
            <th>
              <span className="sr-only">Pilih</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={`border-t border-ux-border ${item.id === row.id ? "bg-ux-soft/40" : ""}`}
            >
              <td className="p-4">
                {row.vendor}
                {!isKyb && ` · ${row.kind} v${row.version}`}
              </td>
              <td className="p-4">{isKyb ? row.kind : row.signal.split(" · ")[0]}</td>
              <td className="p-4">
                <OperationalBadge
                  status={
                    row.status === "approved" || row.status === "false-positive"
                      ? "eligible"
                      : "pending"
                  }
                  label={
                    row.status === "revision-required"
                      ? "Perlu revisi"
                      : row.status === "revision"
                        ? "Revisi diminta"
                        : row.status === "approved"
                          ? "Disetujui"
                          : row.status === "false-positive"
                            ? "False positive"
                            : "Menunggu"
                  }
                />
              </td>
              <td className="p-1">
                <Button
                  variant="ghost"
                  size="small"
                  aria-label={`Tinjau ${row.vendor}`}
                  onClick={() => onSelect(row.id)}
                >
                  Detail →
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
