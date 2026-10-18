import type { EditorState, StudioDocument, StudioNode } from "../types/editor";

const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === "string";
const flag = (value: unknown): value is boolean => typeof value === "boolean";
const number = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
const version = (value: unknown) => number(value) && Number.isInteger(value) && value >= 1;
const choice = (value: unknown, values: readonly string[]) => text(value) && values.includes(value);

export function isSafeStudioImage(value: unknown): value is string {
  return (
    text(value) &&
    (/^\/assets\/(?:[a-z\d_-]+\/)*[a-z\d_.-]+\.(?:png|jpe?g|webp|gif|avif)$/i.test(value) ||
      /^data:image\/(?:png|jpeg|webp|gif|avif);base64,[a-z\d+/]+={0,2}$/i.test(value))
  );
}

function isNode(value: unknown): value is StudioNode {
  return (
    object(value) &&
    text(value.id) &&
    text(value.name) &&
    text(value.text) &&
    choice(value.kind, ["text", "image"]) &&
    ["x", "y", "width", "height", "fontSize", "lineHeight", "rotation", "opacity"].every((key) =>
      number(value[key]),
    ) &&
    ["visible", "locked", "flipX", "flipY"].every((key) => flag(value[key])) &&
    (value.groupId === undefined || text(value.groupId))
  );
}

export function isStudioDocument(value: unknown): value is StudioDocument {
  if (
    !object(value) ||
    !text(value.projectId) ||
    !text(value.eventId) ||
    !text(value.title) ||
    !choice(value.theme, ["editorial", "cypress", "monochrome"]) ||
    !version(value.revision) ||
    !version(value.expectedVersion) ||
    !(value.activeVersion === null || version(value.activeVersion)) ||
    !choice(value.publication, ["published", "unpublished"]) ||
    !choice(value.draftStatus, ["editing", "archived", "deleted"])
  )
    return false;
  const { content, cover, motion, privacy } = value;
  const crop = object(cover) ? cover.crop : null;
  return (
    object(content) &&
    ["groom", "bride", "date", "venue", "rsvpDeadline", "coupleTitle"].every((key) =>
      text(content[key]),
    ) &&
    flag(content.pinSet) &&
    Array.isArray(value.nodes) &&
    value.nodes.every(isNode) &&
    new Set(value.nodes.map((node) => node.id)).size === value.nodes.length &&
    Array.isArray(value.sections) &&
    value.sections.every(
      (section) =>
        object(section) && text(section.id) && text(section.label) && flag(section.visible),
    ) &&
    object(cover) &&
    isSafeStudioImage(cover.src) &&
    isSafeStudioImage(cover.originalSrc) &&
    object(crop) &&
    ["x", "y", "scale"].every((key) => number(crop[key])) &&
    text(crop.ratio) &&
    object(motion) &&
    choice(motion.effect, ["fade", "none"]) &&
    number(motion.duration) &&
    number(motion.delay) &&
    flag(motion.loop) &&
    flag(motion.reducedMotion) &&
    object(privacy) &&
    ["giftsEnabled", "searchEngineIndex", "autoplayMusic"].every((key) => flag(privacy[key])) &&
    number(value.assetsUsedMb) &&
    value.assetsUsedMb >= 0
  );
}

export function isStoredEditorState(value: unknown, projectId: string): value is EditorState {
  if (
    !object(value) ||
    !isStudioDocument(value.document) ||
    !isStudioDocument(value.savedDocument) ||
    !object(value.environment) ||
    !object(value.operations)
  )
    return false;
  const current = value.document;
  const sameScope = (document: unknown) =>
    isStudioDocument(document) &&
    document.projectId === projectId &&
    document.eventId === current.eventId;
  const environment = value.environment;
  return (
    sameScope(value.document) &&
    sameScope(value.savedDocument) &&
    (value.activeDocument === null || sameScope(value.activeDocument)) &&
    Array.isArray(value.past) &&
    value.past.every(sameScope) &&
    Array.isArray(value.future) &&
    value.future.every(sameScope) &&
    ["online", "canEdit", "entitled", "available", "saveFailure"].every((key) =>
      flag(environment[key]),
    ) &&
    version(environment.serverVersion) &&
    choice(environment.upload, ["idle", "pending", "error"]) &&
    flag(value.dirty) &&
    flag(value.ticketsRevoked) &&
    text(value.notice) &&
    choice(value.saveStatus, [
      "saved",
      "dirty",
      "saving",
      "offline",
      "conflict",
      "forbidden",
      "error",
    ]) &&
    Object.values(value.operations).every(version)
  );
}
