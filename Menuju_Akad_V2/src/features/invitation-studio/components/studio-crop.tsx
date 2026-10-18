"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import type { StudioEditor } from "../hooks/use-studio-editor";

export function StudioCrop({ editor }: { editor: StudioEditor }) {
  const { state, edit } = editor;
  const cover = state.document.cover;
  return (
    <div className="grid gap-4">
      <h3 className="border-t border-border pt-4 text-sm font-semibold">Atur area potong</h3>
      <label className="grid gap-2 text-xs">
        Rasio area foto
        <select
          className="min-h-11 rounded-control border border-border px-2"
          value={cover.crop.ratio}
          onChange={(event) =>
            edit({
              ...state.document,
              cover: { ...cover, crop: { ...cover.crop, ratio: event.target.value } },
            })
          }
        >
          {["375:340", "1:1", "16:9"].map((ratio) => (
            <option key={ratio}>{ratio}</option>
          ))}
        </select>
      </label>
      {(
        [
          ["x", "Fokus horizontal", 0, 100, 1],
          ["y", "Fokus vertikal", 0, 100, 1],
          ["scale", "Pembesaran crop", 1, 3, 0.1],
        ] as const
      ).map(([key, label, min, max, step]) => (
        <Field
          key={key}
          type="number"
          label={label}
          value={cover.crop[key]}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const value = event.target.valueAsNumber;
            if (Number.isFinite(value))
              edit({
                ...state.document,
                cover: {
                  ...cover,
                  crop: { ...cover.crop, [key]: Math.max(min, Math.min(max, value)) },
                },
              });
          }}
        />
      ))}
      <Button
        variant="secondary"
        size="small"
        onClick={() =>
          edit({
            ...state.document,
            cover: {
              ...cover,
              src: cover.originalSrc,
              crop: { x: 50, y: 50, scale: 1, ratio: "375:340" },
            },
          })
        }
      >
        Reset ke foto asli
      </Button>
      <p className="text-xs text-secondary">
        Crop bersifat non-destruktif di dalam cover 375 × 340. Posisi layer terkunci dan versi aktif
        tetap utuh.
      </p>
    </div>
  );
}
