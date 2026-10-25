import type { StudioDocument } from "../types/editor";
import { isSafeStudioImage } from "./editor-storage";
import { escapePreview as escape, renderPreviewHero } from "./preview-scene";

export function createPreviewHtml(doc: StudioDocument, origin: string, publicMode = false) {
  const content = doc.content;
  const cover = isSafeStudioImage(doc.cover.src)
    ? doc.cover.src.startsWith("/assets/")
      ? `${origin}${doc.cover.src}`
      : doc.cover.src
    : "";
  const bodies: Record<string, string> = {
    quote: "Dengan penuh rasa syukur, kami mengundang Anda berbagi hari bahagia kami.",
    couple: `${escape(content.groom)} &amp; ${escape(content.bride)}`,
    event: `${escape(content.date)} · Akad 08.00–09.00 · Resepsi 10.00–14.00 WIB<br>${escape(content.venue)}`,
    map: `${escape(content.venue)} · Bandung. Pin ${content.pinSet ? "sudah ditinjau" : "belum diatur"}.`,
    story:
      "2022 · Pertemuan pertama<br>2025 · Memilih untuk melangkah bersama<br>2027 · Memulai kisah baru",
    gallery: `<img src="${escape(cover)}" alt="Potret pasangan" class="gallery">`,
    rsvp: `RSVP per sesi · Batas konfirmasi ${escape(content.rsvpDeadline)}<p>Form konfirmasi hanya tersedia pada undangan aktif.</p>`,
    closing: `Dengan hangat, ${escape(content.coupleTitle)}`,
  };
  const sections = doc.sections
    .filter((section) => section.visible && section.id !== "gifts")
    .map((section) =>
      section.id === "cover"
        ? renderPreviewHero(doc, cover, !publicMode)
        : `<section><h2>${escape(section.label)}</h2><div>${bodies[section.id] ?? ""}</div></section>`,
    )
    .join("");
  const animation =
    doc.motion.reducedMotion || doc.motion.effect === "none"
      ? ""
      : `.hero{animation:enter ${doc.motion.duration}ms ${doc.motion.delay}ms ${doc.motion.loop ? "infinite" : "both"}}`;
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="${doc.privacy.searchEngineIndex ? "index,follow" : "noindex,nofollow"}"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${escape(origin)} data:; font-src ${escape(origin)}; style-src 'unsafe-inline';"><style>
  @font-face{font-family:Jakarta;src:url(${origin}/assets/fonts/jakarta.woff2) format("woff2");font-weight:100 900;font-display:swap}@font-face{font-family:Instrument;src:url(${origin}/assets/fonts/instrument.woff2) format("woff2");font-display:swap}*{box-sizing:border-box}body{margin:0;background:#fbfbf9;color:#141413;font-family:Jakarta,sans-serif;overflow-wrap:anywhere}h1,h2{font-family:Instrument,serif;font-weight:400}h2{font-size:32px}.hero{display:grid}.photo-wrap{position:relative;height:var(--cover-height,340px);overflow:hidden}.cover-node{position:absolute}.crop-frame{position:absolute;overflow:hidden}.photo{display:block;width:100%;height:100%;object-fit:cover}.intro{position:relative;min-height:510px}.scene-node{position:absolute;margin:0;text-align:center;overflow-wrap:anywhere}.scene-title{font-family:Instrument,serif}.guest-meta{position:relative;margin:270px 24px 24px;font-size:14px;line-height:1.7}.meta{border-top:1px solid #eae9e4;padding-top:16px;margin-top:16px}section{padding:28px 24px;border-top:1px solid #eae9e4;font-size:14px;line-height:1.7}.sections{display:grid}.gallery{width:100%;height:260px;object-fit:cover}.notice{padding:12px 24px;background:#f4f4f0;font-size:12px}button{border:0;background:#1e3f32;color:white;padding:16px;width:100%;border-radius:12px}body[data-theme=cypress]{background:#1e3f32;color:#fff}body[data-theme=monochrome]{background:#141413;color:#fff}
  @media(min-width:768px){.hero{grid-template-columns:1fr 1fr;align-items:center}.hero.no-photo{grid-template-columns:1fr}.photo-wrap{height:560px}.intro{min-height:560px}.guest-meta{margin-top:300px}.sections{grid-template-columns:1fr 1fr}}@media(min-width:1280px){.hero{grid-template-columns:55% 45%;min-height:720px}.photo-wrap{height:720px}.intro{min-height:600px}.guest-meta{margin:320px 48px 48px}.sections{max-width:1100px;margin:auto}section{padding:48px}}@keyframes enter{from{opacity:0}to{opacity:1}}${animation}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
  .hero{grid-column:1/-1}.sections{max-width:none}
  </style></head><body data-theme="${doc.theme}"><div class="notice">${publicMode ? "Undangan untuk keluarga dan sahabat" : "Pratinjau draf · belum terlihat oleh tamu"}</div><main><div class="sections">${sections}</div></main></body></html>`;
}
