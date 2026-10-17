import { WorkspaceFault, type OnboardingDraft } from "@/features/planner-workspaces/contracts";
import { readStored, scenario, writeStored } from "./mock-runtime";
import { workspaceStorageSchema } from "./storage-schema";

const key = "ma-v2-workspace";

export function workspaceStore(initial: OnboardingDraft) {
  const ready = () => {
    const mode = scenario();
    if (mode === "offline") {
      throw new WorkspaceFault("offline", "Kamu sedang offline. Draf tetap tersedia.");
    }
    if (mode === "revoked") {
      throw new WorkspaceFault("forbidden", "Akses ruang dicabut. Draf belum disimpan.");
    }
    if (mode === "conflict") {
      throw new WorkspaceFault("stale", "Versi ruang berubah. Tinjau sebelum menyimpan.");
    }
  };
  const scoped = (workspaceId: string): OnboardingDraft => {
    ready();
    const parsed = workspaceStorageSchema.safeParse(readStored(key));
    const draft = parsed.success ? parsed.data : structuredClone(initial);
    if (
      workspaceId !== initial.workspaceId ||
      draft.workspaceId !== initial.workspaceId ||
      draft.actorId !== initial.actorId ||
      !draft.members.some(
        (member) =>
          member.workspaceId === draft.workspaceId &&
          member.actorId === initial.actorId &&
          member.role === "owner",
      )
    ) {
      throw new WorkspaceFault("forbidden", "Ruang tidak tersedia untuk akun ini.");
    }
    if (
      draft.invite &&
      (draft.invite.workspaceId !== draft.workspaceId || draft.invite.ownerId !== initial.actorId)
    ) {
      throw new WorkspaceFault("wrong-owner", "Tautan tidak dimiliki ruang pasangan ini.");
    }
    return draft;
  };
  const persist = (draft: OnboardingDraft) => {
    const next = { ...draft, version: draft.version + 1 };
    writeStored(key, next);
    return structuredClone(next);
  };
  return { scoped, persist, ready };
}

export type WorkspaceStore = ReturnType<typeof workspaceStore>;
