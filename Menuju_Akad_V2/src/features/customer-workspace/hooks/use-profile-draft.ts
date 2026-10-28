"use client";
import { useState } from "react";
import type { CustomerWorkspace } from "../types";
type Slot = "owner" | "partner";
type Identity = { fullName: string; nickname: string };
function snapshot(w: CustomerWorkspace) {
  return {
    owner: { fullName: w.profile.fullName, nickname: w.profile.nickname ?? "" },
    partner: { fullName: w.profile.partnerName ?? "", nickname: w.profile.partnerNickname ?? "" },
    ownerSide: w.ownerSide ?? "",
    photo: w.profile.photoUrl ?? null,
    partnerPhoto: w.profile.partnerPhotoUrl ?? null,
  };
}
const clean = (p: Identity) => ({ fullName: p.fullName.trim(), nickname: p.nickname.trim() });
export function useProfileDraft(workspace: CustomerWorkspace) {
  const incoming = snapshot(workspace);
  const serialized = JSON.stringify(incoming);
  const [received, setReceived] = useState(serialized);
  const [baseline, setBaseline] = useState(incoming);
  const [draft, setDraft] = useState(incoming);
  const [photos, setPhotos] = useState<Partial<Record<Slot, string | null>>>({});
  const changed = (slot: Slot) =>
    JSON.stringify(clean(draft[slot])) !== JSON.stringify(clean(baseline[slot]));
  const dirty =
    changed("owner") ||
    changed("partner") ||
    draft.ownerSide !== baseline.ownerSide ||
    Object.keys(photos).length > 0;
  if (serialized !== received) {
    setReceived(serialized);
    setBaseline(incoming);
    if (!dirty) setDraft(incoming);
  }
  const own: Slot = workspace.role === "owner" ? "owner" : "partner";
  const companion: Slot = own === "owner" ? "partner" : "owner";
  function saved(w: CustomerWorkspace) {
    const next = snapshot(w);
    setBaseline(next);
    setDraft(next);
    setPhotos({});
  }
  return {
    draft,
    dirty,
    saved,
    update: (slot: Slot, key: keyof Identity, value: string) =>
      setDraft((d) => ({ ...d, [slot]: { ...d[slot], [key]: value } })),
    setSide: (ownerSide: string) => setDraft((d) => ({ ...d, ownerSide })),
    photo: (slot: Slot) =>
      photos[slot] !== undefined
        ? photos[slot]!
        : slot === "owner"
          ? baseline.photo
          : baseline.partnerPhoto,
    setPhoto: (slot: Slot, value: string | null) =>
      setPhotos((previous) => {
        const next = { ...previous, [slot]: value };
        if (value === (slot === "owner" ? baseline.photo : baseline.partnerPhoto))
          delete next[slot];
        return next;
      }),
    body: () => ({
      ...clean(draft[own]),
      ...(changed(companion) ? { companion: clean(draft[companion]) } : {}),
      ...(draft.ownerSide
        ? {
            side:
              own === "owner" ? draft.ownerSide : draft.ownerSide === "groom" ? "bride" : "groom",
          }
        : {}),
      ...(Object.keys(photos).length ? { photos } : {}),
    }),
  };
}
