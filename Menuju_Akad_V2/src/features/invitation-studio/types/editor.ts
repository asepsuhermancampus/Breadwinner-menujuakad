import type { InvitationTheme } from "./studio";

export type StudioNode = {
  id: string;
  name: string;
  kind: "text" | "image";
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  lineHeight: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  flipX: boolean;
  flipY: boolean;
  groupId?: string;
};

export type StudioDocument = {
  projectId: string;
  eventId: string;
  title: string;
  theme: InvitationTheme;
  revision: number;
  expectedVersion: number;
  activeVersion: number | null;
  publication: "published" | "unpublished";
  draftStatus: "editing" | "archived" | "deleted";
  content: {
    groom: string;
    bride: string;
    date: string;
    venue: string;
    pinSet: boolean;
    rsvpDeadline: string;
    coupleTitle: string;
  };
  nodes: StudioNode[];
  sections: { id: string; label: string; visible: boolean }[];
  cover: {
    src: string;
    originalSrc: string;
    crop: { x: number; y: number; scale: number; ratio: string };
  };
  motion: {
    effect: "fade" | "none";
    duration: number;
    delay: number;
    loop: boolean;
    reducedMotion: boolean;
  };
  privacy: { giftsEnabled: boolean; searchEngineIndex: boolean; autoplayMusic: boolean };
  assetsUsedMb: number;
};

export type EditorEnvironment = {
  online: boolean;
  canEdit: boolean;
  entitled: boolean;
  available: boolean;
  serverVersion: number;
  upload: "idle" | "pending" | "error";
  saveFailure: boolean;
};

export type EditorState = {
  document: StudioDocument;
  past: StudioDocument[];
  future: StudioDocument[];
  savedDocument: StudioDocument;
  activeDocument: StudioDocument | null;
  environment: EditorEnvironment;
  dirty: boolean;
  saveStatus: "saved" | "dirty" | "saving" | "offline" | "conflict" | "forbidden" | "error";
  notice: string;
  operations: Record<string, number>;
  ticketsRevoked: boolean;
};

export type EditorAction =
  | { type: "edit"; document: StudioDocument }
  | {
      type:
        | "undo"
        | "redo"
        | "save"
        | "restore"
        | "unpublish"
        | "archive"
        | "delete"
        | "revoke-tickets";
    }
  | { type: "environment"; patch: Partial<EditorEnvironment> }
  | { type: "resolve"; source: "local" | "server" }
  | { type: "publish"; expectedVersion: number; operationId: string; acknowledged: boolean }
  | { type: "rename"; title: string }
  | { type: "duplicate" | "new"; projectId?: string }
  | { type: "open"; projectId: string }
  | { type: "hydrate"; state: EditorState };
