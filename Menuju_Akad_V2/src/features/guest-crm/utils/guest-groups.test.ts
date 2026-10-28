import { describe, expect, it } from "vitest";
import {
  sideProfileNames,
  plannerPersonLabel,
} from "@/features/customer-workspace/domain/side-profile-names";
import { guestGroupLabel, parseGuestGroup } from "./guest-groups";
import { parseGuestCsv } from "./customer-import";

describe("family labels", () => {
  const profile = {
    fullName: "Sari Pertiwi",
    nickname: "Sari",
    partnerName: "Dimas Putra",
    partnerNickname: "Dimas",
  };
  it("maps owner and partner nicknames to their actual wedding sides", () => {
    expect(sideProfileNames(profile, "bride")).toEqual({ groom: "Dimas", bride: "Sari" });
    expect(sideProfileNames(profile, "groom")).toEqual({ groom: "Sari", bride: "Dimas" });
    expect(plannerPersonLabel("Andi", sideProfileNames(profile, "bride"))).toBe("Dimas");
    expect(plannerPersonLabel("Bersama")).toBe("Bersama");
  });
  it("uses neutral family labels without an identified owner side", () => {
    expect(guestGroupLabel("Keluarga Andi")).toBe("Keluarga pria");
    expect(guestGroupLabel("Keluarga Risa")).toBe("Keluarga wanita");
    expect(sideProfileNames(profile)).toEqual({ groom: "pria", bride: "wanita" });
  });
  it("accepts current, neutral, and legacy CSV names without changing stored IDs", () => {
    const names = sideProfileNames(profile, "bride");
    for (const value of ["Keluarga Dimas", "Keluarga pria", "Keluarga Andi"]) {
      expect(parseGuestGroup(value, names)).toBe("Keluarga Andi");
      expect(parseGuestCsv(`nama,grup\nTamu,${value}`, names)[0]?.group).toBe("Keluarga Andi");
    }
    expect(parseGuestGroup("Keluarga Sari", names)).toBe("Keluarga Risa");
    expect(parseGuestGroup("Keluarga asing", names)).toBeUndefined();
  });
  it("rejects an ambiguous shared nickname rather than assigning the wrong family", () => {
    expect(parseGuestGroup("Keluarga Ari", { groom: "Ari", bride: "Ari" })).toBeUndefined();
  });
});
