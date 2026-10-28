import {
  defaultSideNames,
  type SideNames,
} from "@/features/customer-workspace/domain/side-profile-names";
import type { GuestGroup } from "../types/guest";

export const guestGroups: GuestGroup[] = [
  "Keluarga Andi",
  "Keluarga Risa",
  "Teman",
  "Kolega",
  "Rekanan",
  "VIP",
];

export function guestGroupLabel(group: GuestGroup, names: SideNames = defaultSideNames) {
  return group === "Keluarga Andi"
    ? `Keluarga ${names.groom}`
    : group === "Keluarga Risa"
      ? `Keluarga ${names.bride}`
      : group;
}

/** Accept exports from older versions and the current visible family labels. */
export function parseGuestGroup(
  value: string,
  names: SideNames = defaultSideNames,
): GuestGroup | undefined {
  const normalized = value.trim().toLocaleLowerCase("id");
  const explicit =
    normalized === "keluarga pria"
      ? "Keluarga Andi"
      : normalized === "keluarga wanita"
        ? "Keluarga Risa"
        : undefined;
  if (explicit) return explicit;
  const matches = guestGroups.filter(
    (group) =>
      group.toLocaleLowerCase("id") === normalized ||
      guestGroupLabel(group, names).toLocaleLowerCase("id") === normalized,
  );
  return matches.length === 1 ? matches[0] : undefined;
}
