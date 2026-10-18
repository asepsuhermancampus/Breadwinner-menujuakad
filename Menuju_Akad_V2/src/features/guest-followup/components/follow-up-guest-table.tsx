import type { FollowUpGuest } from "../types/followup";
import { SelectionCheckbox } from "./selection-checkbox";

export function FollowUpGuestTable({
  guests,
  onToggle,
  onToggleAll,
}: {
  guests: FollowUpGuest[];
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}) {
  const selectedCount = guests.filter((guest) => guest.selected).length;
  const allSelected = guests.length > 0 && selectedCount === guests.length;
  const checked = allSelected ? true : selectedCount > 0 ? "mixed" : false;

  return (
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <table className="w-full min-w-[720px] text-left text-xs">
        <thead>
          <tr className="bg-canvas text-secondary">
            <th scope="col" className="w-14 p-1">
              <SelectionCheckbox
                checked={checked}
                label={allSelected ? "Kosongkan pilihan terlihat" : "Pilih semua tamu terlihat"}
                onChange={onToggleAll}
              />
            </th>
            {["Nama", "Kategori", "Pihak", "Kuota", "WA terakhir", "Izin"].map((label) => (
              <th key={label} scope="col" className="p-3 font-semibold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest.id} className="border-t border-border">
              <td className="p-1">
                <SelectionCheckbox
                  checked={guest.selected}
                  label={`Pilih ${guest.name}`}
                  onChange={() => onToggle(guest.id)}
                />
              </td>
              <td className="p-3 font-semibold text-foreground">{guest.name}</td>
              <td className="p-3 text-secondary">{guest.category}</td>
              <td className="p-3 text-secondary">{guest.side}</td>
              <td className="p-3 font-mono text-foreground">{guest.quota}</td>
              <td className="p-3 font-mono text-secondary">{guest.lastWaDate}</td>
              <td
                className={`p-3 font-semibold ${guest.consent === "Diberikan" ? "text-success" : "text-warning"}`}
              >
                {guest.consent}
              </td>
            </tr>
          ))}
          {guests.length === 0 && (
            <tr>
              <td colSpan={7} className="p-4 text-center text-secondary">
                Tidak ada tamu sesuai pencarian. Pilihan sebelumnya tetap tersimpan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
