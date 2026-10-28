import type { CustomerProfile } from "../types";

/** Older profiles retain their existing name until a nickname is provided. */
export function profileNames(profile: CustomerProfile) {
  return {
    own: profile.nickname?.trim() || profile.fullName.trim(),
    partner: profile.partnerNickname?.trim() || profile.partnerName?.trim() || "",
  };
}

export function orderedCoupleNames(profile: CustomerProfile, ownerSide?: "groom" | "bride" | null) {
  const names = profileNames(profile);
  return (ownerSide === "groom" ? [names.partner, names.own] : [names.own, names.partner]).filter(
    Boolean,
  );
}
export function orderedCoupleIdentities(
  profile: CustomerProfile,
  ownerSide?: "groom" | "bride" | null,
) {
  const names = profileNames(profile);
  const own = {
    name: names.own,
    photoUrl: profile.photoUrl ?? null,
    fallback:
      ownerSide === "bride" ? "Pasangan wanita" : ownerSide === "groom" ? "Pasangan pria" : "Anda",
  };
  const partner = {
    name: names.partner,
    photoUrl: profile.partnerPhotoUrl ?? null,
    fallback:
      ownerSide === "bride"
        ? "Pasangan pria"
        : ownerSide === "groom"
          ? "Pasangan wanita"
          : "Pasangan",
  };
  return (ownerSide === "groom" ? [partner, own] : [own, partner])
    .filter((item) => item.name || item.photoUrl)
    .map(({ name, photoUrl, fallback }) => ({ name: name || fallback, photoUrl }));
}
