import { expect, it } from "vitest";
import { portraitCrop, movePortraitCrop } from "./portrait-crop";
it("uses a centered square covering landscape and portrait images", () => {
  expect(portraitCrop(900, 600, 1, 0.5, 0.5)).toEqual({ x: 150, y: 0, size: 600 });
  expect(portraitCrop(600, 1000, 1, 0.5, 0.5)).toEqual({ x: 0, y: 200, size: 600 });
  expect(portraitCrop(900, 600, 2, 0.5, 0.5)).toEqual({ x: 300, y: 150, size: 300 });
});
it("clamps crop and dragging to the source image bounds", () => {
  expect(portraitCrop(900, 600, 0, -1, 2)).toEqual({ x: 0, y: 0, size: 600 });
  expect(movePortraitCrop(900, 600, 2, 0.5, 0.5, 10000, -10000, 280)).toEqual({ x: 0, y: 1 });
  expect(movePortraitCrop(600, 1000, 1, 0.5, 0.5, 50, 50, 280).x).toBe(0.5);
});
