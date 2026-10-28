import type { CustomerProfile } from "../types";
import { profileNames } from "./profile-names";

export type SideNames = { groom: string; bride: string };
export const defaultSideNames: SideNames = { groom: "pria", bride: "wanita" };

export function sideProfileNames(
  profile: CustomerProfile,
  ownerSide?: "groom" | "bride" | null,
): SideNames {
  const names = profileNames(profile);
  if (!ownerSide) return defaultSideNames;
  return ownerSide === "groom"
    ? { groom: names.own || "pria", bride: names.partner || "wanita" }
    : { groom: names.partner || "pria", bride: names.own || "wanita" };
}

/** These values are legacy role IDs, retained for saved planner records. */
export function plannerPersonLabel(value: string, names: SideNames = defaultSideNames) {
  return value === "Andi" ? names.groom : value === "Risa" ? names.bride : value;
}
