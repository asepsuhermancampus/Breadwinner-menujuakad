import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceDirectory = process.argv[2];
if (!sourceDirectory) throw Error("Provide the source PNG directory.");
const destination = "public/assets/finance/ornaments";
await mkdir(destination, { recursive: true });
const sources = [
  "01_kiri_atas.png",
  "02_kanan_atas.png",
  "03_kiri_bawah.png",
  "04_kanan_bawah.png",
];

// Trace visible pixels into closed polygons, including transparent interior holes.
function contours(mask, width, height) {
  const edges = new Map();
  const key = (x, y) => y * (width + 1) + x;
  const add = (x, y, nextX, nextY) => {
    const start = key(x, y);
    const list = edges.get(start) ?? [];
    list.push(key(nextX, nextY));
    edges.set(start, list);
  };
  const filled = (x, y) => x >= 0 && y >= 0 && x < width && y < height && mask[y * width + x];
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      if (!filled(x, y)) continue;
      if (!filled(x, y - 1)) add(x, y, x + 1, y);
      if (!filled(x + 1, y)) add(x + 1, y, x + 1, y + 1);
      if (!filled(x, y + 1)) add(x + 1, y + 1, x, y + 1);
      if (!filled(x - 1, y)) add(x, y + 1, x, y);
    }
  const point = (value) => [value % (width + 1), Math.floor(value / (width + 1))];
  const result = [];
  while (edges.size) {
    const start = edges.keys().next().value;
    let current = start;
    let previous;
    const points = [];
    do {
      points.push(point(current));
      const choices = edges.get(current);
      if (!choices?.length) throw Error("Open trace contour");
      let index = 0;
      if (previous !== undefined && choices.length > 1) {
        const [px, py] = point(previous),
          [cx, cy] = point(current);
        const dx = cx - px,
          dy = cy - py;
        index = choices.findIndex((choice) => {
          const [nx, ny] = point(choice);
          return nx - cx === -dy && ny - cy === dx;
        });
        if (index < 0) index = 0;
      }
      const next = choices.splice(index, 1)[0];
      if (!choices.length) edges.delete(current);
      previous = current;
      current = next;
    } while (current !== start);
    result.push(points);
  }
  return result;
}

function simplify(points, tolerance = 0.35) {
  if (points.length <= 2) return points;
  const [ax, ay] = points[0],
    [bx, by] = points.at(-1);
  const length = (bx - ax) ** 2 + (by - ay) ** 2;
  let maxDistance = 0,
    index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const t = length
      ? Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / length))
      : 0;
    const distance = (x - ax - t * (bx - ax)) ** 2 + (y - ay - t * (by - ay)) ** 2;
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  return maxDistance > tolerance ** 2
    ? [
        ...simplify(points.slice(0, index + 1), tolerance).slice(0, -1),
        ...simplify(points.slice(index), tolerance),
      ]
    : [points[0], points.at(-1)];
}

for (const [index, source] of sources.entries()) {
  const { data, info } = await sharp(path.join(sourceDirectory, source))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const mask = Array.from({ length: width * height }, (_, pixel) => data[pixel * 4 + 3] >= 96);
  const loops = contours(mask, width, height);
  const d = loops
    .map((loop) => {
      const points = simplify([...loop, loop[0]]);
      return `M${points.map(([x, y]) => `${x} ${y}`).join("L")}Z`;
    })
    .join("");
  // Normalize each original corner so the flower's center meets the upper right.
  const transforms = [
    `translate(0 ${height}) scale(1 -1)`,
    `translate(${width} ${height}) scale(-1 -1)`,
    "",
    `translate(${width} 0) scale(-1 1)`,
  ];
  const originalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path fill="currentColor" fill-rule="evenodd" d="${d}"/></svg>`;
  const raster = await sharp(Buffer.from(originalSvg)).ensureAlpha().raw().toBuffer();
  let intersection = 0,
    union = 0;
  for (let i = 0; i < mask.length; i++) {
    const traced = raster[i * 4 + 3] >= 96;
    if (mask[i] || traced) union++;
    if (mask[i] && traced) intersection++;
  }
  const similarity = intersection / union;
  if (similarity < 0.96) throw Error(`Trace differs from source: ${source} (${similarity})`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" color="#087f5b" fill="currentColor"><!-- Vector trace of ${source}; normalized to upper right. --><g transform="${transforms[index]}"><path fill-rule="evenodd" d="${d}"/></g></svg>\n`;
  await writeFile(`${destination}/flower-${index + 1}.svg`, svg);
  console.log(
    `${source}: ${loops.length} contours; ${(similarity * 100).toFixed(2)}% mask match; ${Buffer.byteLength(svg)} bytes`,
  );
}
