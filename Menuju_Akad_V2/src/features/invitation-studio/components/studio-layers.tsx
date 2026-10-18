"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import type { StudioEditor } from "../hooks/use-studio-editor";

export function StudioLayers({
  editor,
  selected,
  onSelect,
}: {
  editor: StudioEditor;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const { state, edit, updateNode } = editor;
  const node = state.document.nodes.find((item) => item.id === selected);
  function reorder(direction: number) {
    const nodes = [...state.document.nodes];
    const index = nodes.findIndex((item) => item.id === selected);
    if (!node || node.locked || index + direction < 0 || index + direction >= nodes.length) return;
    nodes.splice(index, 1);
    nodes.splice(index + direction, 0, node);
    edit({ ...state.document, nodes });
  }
  return (
    <div className="grid gap-4">
      <h2 className="text-sm font-semibold">Layer · Sampul</h2>
      <div className="grid gap-1" role="listbox" aria-label="Layer undangan">
        {state.document.nodes.map((item) => (
          <button
            key={item.id}
            role="option"
            aria-selected={selected === item.id}
            className={`min-h-11 rounded-control px-3 text-left text-xs ${selected === item.id ? "bg-ux-soft font-semibold text-primary" : "hover:bg-subtle"}`}
            onClick={() => onSelect(item.id)}
          >
            {item.name}
            {item.locked ? " · terkunci" : ""}
            {!item.visible ? " · tersembunyi" : ""}
            {item.groupId ? " · grup" : ""}
          </button>
        ))}
      </div>
      {node && (
        <>
          <Field
            label="Nama layer"
            value={node.name}
            disabled={node.locked}
            onChange={(event) => updateNode(node.id, { name: event.target.value })}
          />
          <Button
            size="small"
            variant="secondary"
            onClick={() => updateNode(node.id, { locked: !node.locked })}
          >
            {node.locked ? "Buka kunci" : "Kunci layer"}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="small"
              variant="secondary"
              disabled={node.locked}
              onClick={() => reorder(-1)}
            >
              Naikkan
            </Button>
            <Button
              size="small"
              variant="secondary"
              disabled={node.locked}
              onClick={() => reorder(1)}
            >
              Turunkan
            </Button>
          </div>
          <Button
            size="small"
            variant="secondary"
            disabled={node.locked}
            onClick={() => updateNode(node.id, { visible: !node.visible })}
          >
            {node.visible ? "Sembunyikan" : "Tampilkan"} layer
          </Button>
          <Button
            size="small"
            variant="secondary"
            disabled={node.locked}
            onClick={() =>
              edit({
                ...state.document,
                nodes: state.document.nodes.map((item) =>
                  item.locked ? item : { ...item, groupId: node.groupId ? "" : "cover-group" },
                ),
              })
            }
          >
            {node.groupId ? "Pisahkan grup" : "Kelompokkan layer terbuka"}
          </Button>
        </>
      )}
      <p className="text-xs text-secondary">
        Layer terkunci tidak dapat dipindah. Urutan dan properti dapat diubah tanpa menyeret.
      </p>
    </div>
  );
}
