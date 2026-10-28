import { expect, it } from "vitest";
import { orderedCoupleNames } from "./profile-names";

const profile = {
  fullName: "Suep Lengkap",
  partnerName: "Latifah Lengkap",
  nickname: "Suep",
  partnerNickname: "Latifah",
};
it("places the bride first whether the owner is groom or bride", () => {
  expect(orderedCoupleNames(profile, "groom")).toEqual(["Latifah", "Suep"]);
  expect(orderedCoupleNames({ fullName: "Latifah", partnerName: "Suep" }, "bride")).toEqual([
    "Latifah",
    "Suep",
  ]);
});
it("keeps available names without stray separators when a profile is incomplete", () => {
  expect(orderedCoupleNames({ fullName: "Suep", partnerName: null }, "groom")).toEqual(["Suep"]);
  expect(orderedCoupleNames({ fullName: "", partnerName: null })).toEqual([]);
});
