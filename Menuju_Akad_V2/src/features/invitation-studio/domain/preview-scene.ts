import type { StudioDocument, StudioNode } from "../types/editor";
import { getCoverCropFrame } from "./cover-crop";

export const escapePreview = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );

function appearance(node: StudioNode) {
  return `opacity:${node.opacity / 100};transform:rotate(${node.rotation}deg) scale(${node.flipX ? -1 : 1},${node.flipY ? -1 : 1})`;
}

export function renderPreviewHero(doc: StudioDocument, src: string, sampleGuest = true) {
  if (!doc.sections.some((section) => section.id === "cover" && section.visible)) return "";
  const cover = doc.nodes.find((node) => node.id === "cover");
  const coverHeight = cover?.height && cover.height > 0 ? cover.height : 340;
  const bodyTop =
    Math.max(0, ...doc.nodes.filter((node) => node.visible).map((node) => node.y + node.height)) +
    24 -
    coverHeight;
  const crop = getCoverCropFrame(doc.cover.crop);
  const photo = cover?.visible
    ? `<div class="photo-wrap" style="--cover-height:${coverHeight}px">
    <div class="cover-node" style="left:${(cover.x / 375) * 100}%;top:${(cover.y / coverHeight) * 100}%;width:${(cover.width / 375) * 100}%;height:${(cover.height / coverHeight) * 100}%;${appearance(cover)}">
      <div class="crop-frame" style="left:${crop.left}%;top:${crop.top}%;width:${crop.width}%;height:${crop.height}%">
        <img class="photo" src="${escapePreview(src)}" alt="Foto pasangan" style="object-position:${doc.cover.crop.x}% ${doc.cover.crop.y}%;transform:scale(${doc.cover.crop.scale})">
      </div>
    </div></div>`
    : "";
  const nodes = doc.nodes
    .map((node, index) => {
      if (!node.visible || node.kind !== "text") return "";
      const tag = node.id === "couple-title" ? "h1" : "p";
      return `<${tag} class="scene-node ${node.id === "couple-title" ? "scene-title" : ""}" style="left:${(node.x / 375) * 100}%;top:${node.y - coverHeight}px;width:${(node.width / 375) * 100}%;height:${node.height}px;font-size:${node.fontSize}px;line-height:${node.lineHeight};z-index:${index};${appearance(node)}">${escapePreview(node.text)}</${tag}>`;
    })
    .join("");
  return `<div class="hero${photo ? "" : " no-photo"}">${photo}<div class="intro">${nodes}
    ${sampleGuest ? `<div class="guest-meta" style="margin-top:${Math.max(0, bodyTop)}px"><div class="meta" style="margin-top:0"><strong>Budi Santoso &amp; Partner</strong><p>Maksimal 2 orang · RSVP per sesi · contoh personal</p></div><button disabled>Konfirmasi kehadiran · pratinjau</button></div>` : ""}
  </div></div>`;
}
