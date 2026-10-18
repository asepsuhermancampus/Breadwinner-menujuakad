import type { StudioDocument } from "../types/editor";

export function getCoverCropFrame(crop: StudioDocument["cover"]["crop"]) {
  const ratio = crop.ratio === "1:1" ? 1 : crop.ratio === "16:9" ? 16 / 9 : 375 / 340;
  const width = Math.min(375, 340 * ratio);
  const height = Math.min(340, 375 / ratio);
  return {
    left: ((375 - width) / 2 / 375) * 100,
    top: ((340 - height) / 2 / 340) * 100,
    width: (width / 375) * 100,
    height: (height / 340) * 100,
  };
}
