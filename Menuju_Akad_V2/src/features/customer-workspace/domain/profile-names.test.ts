import { expect, it } from "vitest";
import { profileNames, orderedCoupleIdentities } from "./profile-names";

it("prefers each nickname and keeps older account names as a fallback", () => {
  expect(
    profileNames({
      fullName: "Risa Pratiwi",
      partnerName: "Dimas Putra",
      nickname: " Risa ",
      partnerNickname: " Dimas ",
    }),
  ).toEqual({ own: "Risa", partner: "Dimas" });
  expect(profileNames({ fullName: "Risa Pratiwi", partnerName: "Dimas Putra" })).toEqual({
    own: "Risa Pratiwi",
    partner: "Dimas Putra",
  });
  expect(
    profileNames({ fullName: "", partnerName: null, nickname: " ", partnerNickname: null }),
  ).toEqual({ own: "", partner: "" });
});
it("keeps photos paired with names in bride-first order for either owner side", () => {
  const profile = {
    fullName: "Suep",
    partnerName: "Latifah",
    photoUrl: "/own",
    partnerPhotoUrl: "/partner",
  };
  expect(
    orderedCoupleIdentities(profile, "groom").map((item) => [item.name, item.photoUrl]),
  ).toEqual([
    ["Latifah", "/partner"],
    ["Suep", "/own"],
  ]);
  expect(
    orderedCoupleIdentities({ ...profile, fullName: "Latifah", partnerName: "Suep" }, "bride").map(
      (item) => [item.name, item.photoUrl],
    ),
  ).toEqual([
    ["Latifah", "/own"],
    ["Suep", "/partner"],
  ]);
  expect(orderedCoupleIdentities({ fullName: "", partnerName: null })).toEqual([]);
});
