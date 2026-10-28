import type { TrialSnapshot, TrialResourceKind } from "../types";
import { validateTrialData } from "./trial-validation";
export const trialKinds = [
  "tasks",
  "documents",
  "guests",
  "finance",
  "savings",
  "invitations",
  "moodboard",
  "studio-drafts",
  "calendar",
  "rundown",
  "seserahan",
  "emergency",
  "catering",
  "vendor-favorites",
] as const;
export const emptyTrial = (): TrialSnapshot => ({
  version: 2,
  revision: 0,
  used: {},
  resources: {},
});
export function parseTrial(raw: string | null): TrialSnapshot {
  if (raw === null) return emptyTrial();
  const value = JSON.parse(raw);
  const invalid = () => {
    throw new Error("Data trial browser tidak dapat dibaca. Data lama tidak dihapus.");
  };
  if (
    !value ||
    ![1, 2].includes(value.version) ||
    !Number.isSafeInteger(value.revision) ||
    value.revision < 0 ||
    !value.resources ||
    typeof value.resources !== "object" ||
    Array.isArray(value.resources)
  )
    return invalid();
  if (value.version === 1) {
    if (
      !Number.isInteger(value.used) ||
      value.used < 0 ||
      value.used > 10 ||
      value.revision !== value.used
    )
      return invalid();
  } else {
    if (!value.used || typeof value.used !== "object" || Array.isArray(value.used))
      return invalid();
    for (const [kind, count] of Object.entries(value.used))
      if (
        ![...trialKinds, "pdf"].includes(kind as TrialResourceKind) ||
        !Number.isInteger(count) ||
        Number(count) < 0 ||
        Number(count) > 5
      )
        return invalid();
    if (value.documentTemplate !== undefined && value.documentTemplate !== 1) return invalid();
  }
  for (const [kind, data] of Object.entries(value.resources)) {
    if (!trialKinds.includes(kind as TrialResourceKind)) return invalid();
    validateTrialData(kind as TrialResourceKind, data);
  }
  return { ...value, version: 2, used: value.version === 1 ? {} : value.used };
}
