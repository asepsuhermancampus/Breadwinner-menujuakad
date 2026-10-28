const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
export function portraitCrop(width: number, height: number, zoom: number, x: number, y: number) {
  const size = Math.min(width, height) / clamp(zoom, 1, 3);
  return { x: (width - size) * clamp(x, 0, 1), y: (height - size) * clamp(y, 0, 1), size };
}
export function movePortraitCrop(
  width: number,
  height: number,
  zoom: number,
  x: number,
  y: number,
  dx: number,
  dy: number,
  frame: number,
) {
  const { size } = portraitCrop(width, height, zoom, x, y);
  return {
    x: width === size ? x : clamp(x - (dx * size) / frame / (width - size), 0, 1),
    y: height === size ? y : clamp(y - (dy * size) / frame / (height - size), 0, 1),
  };
}
