import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import type { VendorContract } from "../types/vendor";

export function vendorOrderDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00+07:00`).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      })
    : value;
}

export function VendorOrderTerms({ contract }: { contract: VendorContract }) {
  return (
    <ol className="grid gap-3">
      {contract.terms.map((term) => (
        <li key={term.id} className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium">{term.label}</p>
            <p className="mt-1 text-xs text-secondary">{vendorOrderDate(term.dueDate)}</p>
          </div>
          <p className="font-mono text-xs font-semibold">{formatIdr(term.amountIdr)}</p>
        </li>
      ))}
    </ol>
  );
}
