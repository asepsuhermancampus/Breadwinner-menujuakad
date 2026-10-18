import { describe, expect, it } from "vitest";
import { createStudioDocument } from "../content/editor-content";
import { getCoverCropFrame } from "./cover-crop";
import { createPreviewHtml } from "./preview-html";

describe("public studio preview", () => {
  it("renders current visible node text and appearance rather than fixture text", () => {
    const doc = createStudioDocument();
    doc.nodes = doc.nodes.map((node) =>
      node.id === "couple-title"
        ? { ...node, text: "Judul visual", fontSize: 42, opacity: 70, rotation: 8, flipX: true }
        : node.id === "eyebrow"
          ? { ...node, visible: false }
          : node,
    );
    const html = createPreviewHtml(doc, "https://preview.example");
    expect(html).toContain("Judul visual");
    expect(html).toContain("font-size:42px");
    expect(html).toContain("opacity:0.7");
    expect(html).toContain("rotate(8deg) scale(-1,1)");
    expect(html).not.toContain("THE WEDDING OF");
  });

  it("respects hidden cover section and rejects remote or executable asset sources", () => {
    const doc = createStudioDocument();
    doc.sections = doc.sections.map((section) =>
      section.id === "cover" ? { ...section, visible: false } : section,
    );
    expect(createPreviewHtml(doc, "https://preview.example")).not.toContain('class="hero"');
    doc.sections[0]!.visible = true;
    doc.cover.src = "https://tracking.example/file.svg";
    const html = createPreviewHtml(doc, "https://preview.example");
    expect(html).not.toContain("tracking.example");
    expect(html).toContain("default-src 'none'");
  });

  it("preserves section order when moving the cover after the quote", () => {
    const doc = createStudioDocument();
    const cover = doc.sections.shift()!;
    doc.sections.splice(1, 0, cover);
    const html = createPreviewHtml(doc, "https://preview.example");
    expect(html.indexOf("<h2>Kutipan</h2>")).toBeLessThan(html.indexOf('class="hero"'));
  });

  it("uses nondestructive ratio crop geometry within the locked cover frame", () => {
    const doc = createStudioDocument();
    const full = getCoverCropFrame(doc.cover.crop);
    expect(full).toEqual({ left: 0, top: 0, width: 100, height: 100 });
    doc.cover.crop.ratio = "1:1";
    const square = getCoverCropFrame(doc.cover.crop);
    expect(square.width).toBeCloseTo((340 / 375) * 100);
    expect(square.height).toBe(100);
    expect(doc.nodes.find((node) => node.id === "cover")?.height).toBe(340);
    expect(createPreviewHtml(doc, "https://preview.example")).toContain(`width:${square.width}%`);
  });

  it("escapes edited text and suppresses effective animation for reduced motion", () => {
    const doc = createStudioDocument();
    doc.nodes[2]!.text = '<script>alert("x")</script>';
    doc.motion.reducedMotion = true;
    const html = createPreviewHtml(doc, "https://preview.example");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("animation:enter 600ms");
    expect(html).toContain("@media(min-width:768px)");
    expect(html).toContain("@media(min-width:1280px)");
  });
});
