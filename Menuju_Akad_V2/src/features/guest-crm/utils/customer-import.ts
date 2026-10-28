import { parseGuestGroup } from "./guest-groups";
import {
  defaultSideNames,
  type SideNames,
} from "@/features/customer-workspace/domain/side-profile-names";
import type { GuestInvitation } from "../types/guest";
export const newGuestIdentity = () => ({
  id: crypto.randomUUID(),
  personalToken: crypto.randomUUID(),
});
function csvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [],
    cell = "",
    quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = !quoted;
    } else if (!quoted && (c === "," || c === ";" || c === "\n")) {
      row.push(cell.trim());
      cell = "";
      if (c === "\n") {
        if (row.some(Boolean)) rows.push(row);
        row = [];
      }
    } else if (c !== "\r") cell += c;
  }
  if (quoted) throw Error("Tanda kutip CSV belum ditutup.");
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}
export function parseGuestCsv(
  text: string,
  names: SideNames = defaultSideNames,
): GuestInvitation[] {
  if (text.length > 1e6) throw Error("CSV maksimal 1 MB.");
  const rows = csvRows(text.replace(/^\uFEFF/, "")),
    header = rows.shift()?.map((v) => v.toLowerCase()) ?? [];
  const nameIndex = header.indexOf("nama");
  if (nameIndex < 0) throw Error("CSV memerlukan kolom nama, telepon, kuota, grup (nama wajib).");
  if (rows.length === 0 || rows.length > 10000)
    throw Error("Isi CSV perlu berisi 1 sampai 10000 tamu.");
  return rows.map((row, i) => {
    const get = (name: string) => row[header.indexOf(name)] ?? "",
      name = row[nameIndex] ?? "",
      quota = get("kuota") ? Number(get("kuota")) : 1,
      group = parseGuestGroup(get("grup") || "Teman", names);
    if (
      !name ||
      name.length > 160 ||
      !Number.isInteger(quota) ||
      quota < 1 ||
      quota > 1000 ||
      !group ||
      get("telepon").length > 80
    )
      throw Error("Periksa nama, kuota atau grup pada baris " + (i + 2));
    return {
      ...newGuestIdentity(),
      name,
      quota,
      group: group!,
      contactPhone: get("telepon"),
      rsvpStatus: "PENDING",
      attendingCount: 0,
      waConsent: false,
    };
  });
}
