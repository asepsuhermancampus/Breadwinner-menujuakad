import {
  WorkspaceFault,
  type OnboardingDraft,
  type WorkspaceAdapter,
} from "@/features/planner-workspaces/contracts";
import { photoError } from "@/features/planner-workspaces/utils/onboarding-validation";
import { latency, systemClock, type Clock } from "./mock-runtime";
import { mockWorkspaceInvites } from "./mock-workspace-invites";
import { workspaceStore } from "./mock-workspace-store";
import { workspaceStorageSchema } from "./storage-schema";

export function createMockWorkspace(
  initial: OnboardingDraft,
  clock: Clock = systemClock,
  wait = latency,
): WorkspaceAdapter {
  const store = workspaceStore(initial);
  return {
    now: () => clock.now(),
    async loadDraft(workspaceId) {
      await wait();
      return store.scoped(workspaceId);
    },
    async saveDraft(input, expectedVersion) {
      await wait();
      const current = store.scoped(input.workspaceId);
      if (current.version !== expectedVersion || input.version !== expectedVersion) {
        throw new WorkspaceFault("stale", "Draf berbeda dari versi terbaru.");
      }
      const parsed = workspaceStorageSchema.safeParse(input);
      if (
        !parsed.success ||
        (["engagement", "wedding"] as const).some(
          (kind) =>
            parsed.data.events[kind].id !== current.events[kind].id ||
            parsed.data.events[kind].kind !== kind,
        ) ||
        parsed.data.events.engagement.id === parsed.data.events.wedding.id
      ) {
        throw new WorkspaceFault("invalid", "Draf belum valid atau identitas acara berubah.");
      }
      return store.persist({
        ...parsed.data,
        version: current.version,
        actorId: current.actorId,
        members: current.members,
        invite: current.invite,
      });
    },
    async uploadPhoto(file) {
      await wait();
      store.scoped(initial.workspaceId);
      const invalid = photoError(file);
      if (invalid) throw new WorkspaceFault("upload", invalid);
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          typeof reader.result === "string"
            ? resolve(reader.result)
            : reject(new WorkspaceFault("upload", "Foto gagal dibaca."));
        reader.onerror = () => reject(new WorkspaceFault("upload", "Foto gagal dibaca."));
        reader.readAsDataURL(file);
      });
    },
    ...mockWorkspaceInvites(initial.workspaceId, store, clock, wait),
  };
}
