"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import type { StudioEditor } from "../hooks/use-studio-editor";
import type { StudioNode } from "../types/editor";

export function StudioInspector({ editor, selected }: { editor: StudioEditor; selected: string }) {
  const { state, updateNode, content } = editor;
  const node = state.document.nodes.find((item) => item.id === selected);
  if (!node)
    return <p className="text-sm text-secondary">Pilih layer di kanvas atau daftar layer.</p>;
  const numeric: [keyof StudioNode, string, number, number][] = [
    ["x", "X", 0, 375 - node.width],
    ["y", "Y", 0, 2000],
    ["width", "W", 1, 375 - node.x],
    ["height", "H", 1, 2000],
    ["fontSize", "Ukuran font", 8, 120],
    ["lineHeight", "Tinggi baris", 0.7, 3],
    ["rotation", "Rotasi", -180, 180],
    ["opacity", "Opasitas", 0, 100],
  ];
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-sm font-semibold">
          {node.kind === "image" ? "Foto cover" : "Teks terpilih"}
        </h2>
        <p className="mt-2 text-xs text-secondary">Sampul / {node.name}</p>
      </div>
      {node.locked && (
        <p className="rounded-control bg-warning-bg p-3 text-xs text-warning">
          Layer terkunci. Buka kunci pada panel Layer untuk mengubah propertinya.
        </p>
      )}
      {node.kind === "text" && (
        <Field
          label="Teks"
          value={node.text}
          disabled={node.locked}
          onChange={(event) =>
            node.id === "couple-title"
              ? content({ coupleTitle: event.target.value })
              : updateNode(node.id, { text: event.target.value })
          }
        />
      )}
      <p className="text-xs text-secondary">
        Font: {node.id === "couple-title" ? "Instrument Serif" : "Plus Jakarta Sans"}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {numeric.map(([key, label, min, max]) => (
          <Field
            key={key}
            type="number"
            label={label}
            min={min}
            max={Math.max(min, max)}
            step={key === "lineHeight" ? 0.1 : 1}
            value={Number(node[key])}
            disabled={node.locked}
            onChange={(event) => {
              const value = event.target.valueAsNumber;
              if (Number.isFinite(value))
                updateNode(node.id, { [key]: Math.min(Math.max(min, value), Math.max(min, max)) });
            }}
          />
        ))}
      </div>
      <p className="text-xs text-secondary">Warna teks · Obsidian</p>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          size="small"
          disabled={node.locked}
          aria-pressed={node.flipX}
          onClick={() => updateNode(node.id, { flipX: !node.flipX })}
        >
          Balik H
        </Button>
        <Button
          variant="secondary"
          size="small"
          disabled={node.locked}
          aria-pressed={node.flipY}
          onClick={() => updateNode(node.id, { flipY: !node.flipY })}
        >
          Balik V
        </Button>
      </div>
      <div className="border-t border-ux-border pt-4">
        <p className="text-xs font-semibold">Konten tetap sinkron</p>
        <p className="mt-2 text-xs leading-relaxed text-secondary">
          Mengedit judul memperbarui field Form. Daftar tamu dan jawaban RSVP tetap tersimpan
          terpisah.
        </p>
      </div>
    </div>
  );
}
