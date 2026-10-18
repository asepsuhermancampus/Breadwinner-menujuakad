"use client";

import { Button } from "@/components/ui/button";
import type { StudioEditor } from "../hooks/use-studio-editor";

export function StudioSections({
  editor,
  selected,
  onSelect,
}: {
  editor: StudioEditor;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const { state, edit } = editor;
  const sections = state.document.sections;
  function move(index: number, direction: number) {
    if (index + direction < 0 || index + direction >= sections.length) return;
    const list = [...sections];
    const [section] = list.splice(index, 1);
    if (!section) return;
    list.splice(index + direction, 0, section);
    edit({ ...state.document, sections: list });
  }
  return (
    <div className="grid gap-4">
      <h2 className="text-sm font-semibold">Susunan undangan</h2>
      <div className="grid gap-1">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`flex items-center rounded-control ${selected === section.id ? "bg-ux-soft" : ""}`}
          >
            <button
              className="min-h-11 min-w-0 flex-1 px-2 text-left text-xs"
              aria-pressed={selected === section.id}
              onClick={() => onSelect(section.id)}
            >
              {section.label}
              {!section.visible && " · tersembunyi"}
            </button>
            <button
              aria-label={`Naikkan ${section.label}`}
              className="min-h-11 min-w-7 text-xs disabled:opacity-30"
              disabled={!index}
              onClick={() => move(index, -1)}
            >
              ↑
            </button>
            <button
              aria-label={`Turunkan ${section.label}`}
              className="min-h-11 min-w-7 text-xs disabled:opacity-30"
              disabled={index === sections.length - 1}
              onClick={() => move(index, 1)}
            >
              ↓
            </button>
          </div>
        ))}
      </div>
      <Button
        variant="secondary"
        size="small"
        disabled={selected === "gifts"}
        onClick={() =>
          edit({
            ...state.document,
            sections: sections.map((section) =>
              section.id === selected ? { ...section, visible: !section.visible } : section,
            ),
          })
        }
      >
        Tampilkan / sembunyikan seksi
      </Button>
      <p className="text-xs leading-relaxed text-secondary">
        Pindahkan seksi dengan tombol naik/turun. Hadiah tetap nonaktif pada rilis ini.
      </p>
    </div>
  );
}
