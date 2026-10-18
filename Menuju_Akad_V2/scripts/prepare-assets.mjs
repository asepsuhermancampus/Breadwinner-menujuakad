import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";

const assets = [
  {
    id: "auth-editorial",
    category: "images",
    source: "../Menuju_Akad_V2_Prompt_Slicing/references/design/images/generated.png",
    path: "public/assets/images/auth-editorial.png",
    license: "Aset sumber Pencil; izin produksi belum diverifikasi",
    alt: "Andi dan Risa dalam busana pernikahan, saling menatap di taman",
  },
  ...[1, 2, 3, 4, 5, 6, 7].map((num) => ({
    id: `editorial-${num}`,
    category: "images",
    source: `../Menuju_Akad_V2_Prompt_Slicing/references/design/images/generated-${num}.png`,
    path: `public/assets/images/editorial-${num}.png`,
    license: "Aset sumber Pencil; izin produksi belum diverifikasi",
    alt: `Foto editorial tema ${num}`,
  })),
  ...[
    [
      "plus-jakarta-sans",
      "@fontsource-variable/plus-jakarta-sans",
      "plus-jakarta-sans-latin-wght-normal",
      "latin-variable",
    ],
    [
      "geist-mono",
      "@fontsource-variable/geist-mono",
      "geist-mono-latin-wght-normal",
      "latin-variable",
    ],
    [
      "instrument-serif",
      "@fontsource/instrument-serif",
      "instrument-serif-latin-400-normal",
      "latin-regular",
    ],
  ].map(([id, pkg, file, target]) => ({
    id,
    category: "fonts",
    source: `node_modules/${pkg}/files/${file}.woff2`,
    path: `public/assets/fonts/${id}/${target}.woff2`,
    license: "SIL Open Font License 1.1",
    licenseSource: `node_modules/${pkg}/LICENSE`,
  })),
];
const manifest = [];
for (const asset of assets) {
  await mkdir(dirname(resolve(asset.path)), { recursive: true });
  await copyFile(asset.source, asset.path);
  if (asset.licenseSource)
    await copyFile(asset.licenseSource, `public/assets/fonts/${asset.id}/LICENSE`);
  const bytes = await readFile(asset.path);
  manifest.push({
    id: asset.id,
    category: asset.category,
    path: asset.path.replace("public", ""),
    mime: asset.category === "fonts" ? "font/woff2" : "image/png",
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    source: asset.source,
    license: asset.license,
    alt: asset.alt ?? "",
    ...(asset.category === "images"
      ? { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
      : {}),
  });
}
await writeFile("public/assets/manifest.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`Prepared ${manifest.length} assets; source .pen was not read.`);
