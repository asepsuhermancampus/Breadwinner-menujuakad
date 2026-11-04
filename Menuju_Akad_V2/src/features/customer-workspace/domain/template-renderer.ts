import fs from "node:fs";
import path from "node:path";

export type TemplateRenderData = {
  groom?: string;
  bride?: string;
  title?: string;
  date?: string;
  venue?: string;
};

const DEFAULT_GROOM = "Rizky Pratama";
const DEFAULT_BRIDE = "Amanda Putri";
const DEFAULT_DATE = "Minggu, 14 Februari 2027";
const DEFAULT_VENUE = "Hotel Shangri-La Jakarta";

export function renderClonedTemplate(
  themeId: number,
  data: TemplateRenderData = {},
): string | null {
  const safeId = Math.max(1, Math.min(167, Number(themeId) || 1));
  const htmlPath = path.join(
    process.cwd(),
    "public",
    "templates",
    "html",
    `theme-${safeId}.html`,
  );

  if (!fs.existsSync(htmlPath)) {
    return null;
  }

  let html = fs.readFileSync(htmlPath, "utf-8");

  const groom = data.groom?.trim() || DEFAULT_GROOM;
  const bride = data.bride?.trim() || DEFAULT_BRIDE;
  const title = data.title?.trim() || `The Wedding of ${groom} & ${bride}`;
  const date = data.date?.trim() || DEFAULT_DATE;
  const venue = data.venue?.trim() || DEFAULT_VENUE;

  // 1. Dynamic Title & Meta
  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${title} · Menuju Akad</title>`,
  );

  // 2. Dynamic Couple Combined Names
  html = html.replace(/Vidi\s*(&amp;|&)\s*Hening/gi, `${groom} & ${bride}`);
  html = html.replace(/Wanita\s*(&amp;|&)\s*Pria/gi, `${bride} & ${groom}`);
  html = html.replace(/Pria\s*(&amp;|&)\s*Wanita/gi, `${groom} & ${bride}`);

  // 3. Dynamic Individual Names in Headings/Spans
  html = html.replace(/\bVidi\b/g, groom);
  html = html.replace(/\bHening\b/g, bride);

  // 4. Dynamic Venue & Maps
  html = html.replace(/Hotel\s+Shangri-La(\s+Jakarta)?/gi, venue);
  html = html.replace(
    /q=Hotel%20Shangri-La%20Jakarta/g,
    `q=${encodeURIComponent(venue)}`,
  );

  // 5. Dynamic Dates
  html = html.replace(/Minggu,\s*5\s*Mei\s*2025/gi, date);
  html = html.replace(/05\s*May\s*2025/gi, date);

  // 6. Platform Branding (Menuju Akad)
  html = html.replace(/viding\.co/gi, "menujuakad.com");
  html = html.replace(/Viding/g, "Menuju Akad");

  return html;
}
