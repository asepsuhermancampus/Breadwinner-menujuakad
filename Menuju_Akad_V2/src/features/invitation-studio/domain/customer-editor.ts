import { createEditorState } from "./editor-reducer";
export function createCustomerEditor(projectId: string) {
  const state = createEditorState(projectId),
    doc = state.document;
  doc.title = "Undangan kalian";
  doc.content = {
    groom: "",
    bride: "",
    date: "",
    venue: "",
    pinSet: false,
    rsvpDeadline: "",
    coupleTitle: "Nama pasangan",
  };
  doc.nodes = doc.nodes.map((node) => ({
    ...node,
    text:
      node.id === "couple-title" ? "Nama pasangan" : node.id === "eyebrow" ? "THE WEDDING OF" : "",
  }));
  doc.activeVersion = null;
  doc.publication = "unpublished";
  doc.assetsUsedMb = 0;
  state.savedDocument = structuredClone(doc);
  state.activeDocument = null;
  return state;
}
