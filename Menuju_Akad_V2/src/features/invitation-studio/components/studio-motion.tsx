"use client";

import { Field } from "@/components/ui/field";
import type { StudioEditor } from "../hooks/use-studio-editor";

export function StudioMotion({ editor }: { editor: StudioEditor }) {
  const { state, edit } = editor;
  const motion = state.document.motion;
  return (
    <div className="grid gap-5">
      <h2 className="text-sm font-semibold">Gerak & aksesibilitas</h2>
      <label className="grid gap-2 text-xs">
        Masuk · tersimpan
        <select
          value={motion.effect}
          className="min-h-11 rounded-control border border-border px-2"
          onChange={(event) =>
            edit({
              ...state.document,
              motion: { ...motion, effect: event.target.value as "fade" | "none" },
            })
          }
        >
          <option value="fade">Fade halus</option>
          <option value="none">Tanpa gerakan</option>
        </select>
      </label>
      <Field
        type="number"
        label="Durasi (ms)"
        min={0}
        max={2000}
        step={50}
        value={motion.duration}
        onChange={(event) => {
          if (Number.isFinite(event.target.valueAsNumber))
            edit({
              ...state.document,
              motion: {
                ...motion,
                duration: Math.max(0, Math.min(2000, event.target.valueAsNumber)),
              },
            });
        }}
      />
      <Field
        type="number"
        label="Jeda (ms)"
        min={0}
        max={2000}
        step={50}
        value={motion.delay}
        onChange={(event) => {
          if (Number.isFinite(event.target.valueAsNumber))
            edit({
              ...state.document,
              motion: { ...motion, delay: Math.max(0, Math.min(2000, event.target.valueAsNumber)) },
            });
        }}
      />
      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={motion.reducedMotion}
          onChange={(event) =>
            edit({ ...state.document, motion: { ...motion, reducedMotion: event.target.checked } })
          }
        />
        Preview tanpa gerak
      </label>
      <p className="rounded-control bg-ux-soft p-3 text-xs leading-relaxed text-brand-secondary">
        Preferensi perangkat untuk reduced motion selalu dihormati. Efek hanya dinonaktifkan saat
        berlaku; preferensi animasi tersimpan tetap utuh.
      </p>
      <p className="text-xs text-secondary">Tidak ada loop, parallax, atau musik otomatis.</p>
    </div>
  );
}
