"use client";

import { useRef, useState, type PointerEvent } from "react";
import type { StudioEditor } from "../hooks/use-studio-editor";
import type { StudioNode } from "../types/editor";
import { getCoverCropFrame } from "../domain/cover-crop";

type Props = {
  editor: StudioEditor;
  selected: string;
  onSelect: (id: string) => void;
  zoom: number;
};
export function StudioCanvas({ editor, selected, onSelect, zoom }: Props) {
  const { state, edit } = editor;
  const [inlineTitle, setInlineTitle] = useState<string | null>(null);
  const drag = useRef<{ id: string; startX: number; startY: number } | null>(null);
  const doc = state.document;
  const scale = zoom / 100;
  const crop = getCoverCropFrame(doc.cover.crop);
  const title = doc.nodes.find((node) => node.id === "couple-title");
  const bodyTop =
    Math.max(0, ...doc.nodes.filter((node) => node.visible).map((node) => node.y + node.height)) +
    24;
  const canvasHeight = Math.max(850, bodyTop + 230);
  function start(event: PointerEvent<HTMLButtonElement>, node: StudioNode) {
    onSelect(node.id);
    if (node.locked || !state.environment.canEdit) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      id: node.id,
      startX: event.clientX,
      startY: event.clientY,
    };
  }
  function finish(event: PointerEvent<HTMLButtonElement>) {
    const value = drag.current;
    drag.current = null;
    if (!value) return;
    const dx = Math.round((event.clientX - value.startX) / scale);
    const dy = Math.round((event.clientY - value.startY) / scale);
    if (!dx && !dy) return;
    const moving = doc.nodes.find((node) => node.id === value.id);
    edit({
      ...doc,
      nodes: doc.nodes.map((node) =>
        !node.locked &&
        (node.id === value.id || (moving?.groupId && node.groupId === moving.groupId))
          ? {
              ...node,
              x: Math.max(0, Math.min(375 - node.width, node.x + dx)),
              y: Math.max(0, node.y + dy),
            }
          : node,
      ),
    });
  }
  return (
    <div className="grid justify-items-center gap-4">
      <p className="text-center font-mono text-[10px] uppercase tracking-widest text-secondary">
        Mobile 375 · zoom {zoom}% · draf
      </p>
      <div
        style={{ width: 375 * scale, height: canvasHeight * scale }}
        className="relative shrink-0"
      >
        <div
          data-testid="studio-canvas"
          data-model-width="375"
          className="relative origin-top-left overflow-hidden rounded-control bg-canvas"
          style={{ width: 375, height: canvasHeight, transform: `scale(${scale})` }}
        >
          {doc.nodes
            .filter((node) => node.visible)
            .map((node, index) => (
              <button
                key={node.id}
                type="button"
                aria-label={`Pilih layer ${node.name}`}
                aria-pressed={selected === node.id}
                onPointerDown={(event) => start(event, node)}
                onPointerUp={finish}
                onPointerCancel={() => {
                  drag.current = null;
                }}
                onClick={() => onSelect(node.id)}
                onDoubleClick={() => {
                  if (
                    node.id === "couple-title" &&
                    !node.locked &&
                    state.environment.canEdit &&
                    doc.draftStatus === "editing"
                  )
                    setInlineTitle(node.text);
                }}
                className={`absolute touch-none ${selected === node.id ? "outline-2 outline-primary outline-offset-2" : "hover:outline hover:outline-1 hover:outline-primary"}`}
                style={{
                  left: node.x,
                  top: node.y,
                  width: node.width,
                  height: node.height,
                  fontSize: node.fontSize,
                  lineHeight: node.lineHeight,
                  opacity: node.opacity / 100,
                  transform: `rotate(${node.rotation}deg) scale(${node.flipX ? -1 : 1},${node.flipY ? -1 : 1})`,
                  fontFamily: node.id === "couple-title" ? "var(--font-editorial)" : "inherit",
                  zIndex: index,
                }}
              >
                {node.kind === "image" ? (
                  <span
                    className="absolute overflow-hidden"
                    style={{
                      left: `${crop.left}%`,
                      top: `${crop.top}%`,
                      width: `${crop.width}%`,
                      height: `${crop.height}%`,
                    }}
                  >
                    <img
                      src={doc.cover.src}
                      alt="Foto sampul pasangan"
                      draggable={false}
                      className="size-full object-cover"
                      style={{
                        objectPosition: `${doc.cover.crop.x}% ${doc.cover.crop.y}%`,
                        transform: `scale(${doc.cover.crop.scale})`,
                      }}
                    />
                  </span>
                ) : (
                  node.text
                )}
                {selected === node.id && (
                  <span className="pointer-events-none absolute inset-0" aria-hidden="true">
                    {[
                      "-top-1 -left-1",
                      "-top-1 -right-1",
                      "-bottom-1 -left-1",
                      "-bottom-1 -right-1",
                    ].map((position) => (
                      <span
                        key={position}
                        className={`absolute size-1.5 border border-primary bg-surface ${position}`}
                      />
                    ))}
                  </span>
                )}
              </button>
            ))}
          {inlineTitle !== null && title && (
            <input
              autoFocus
              aria-label="Edit judul langsung"
              className="absolute bg-surface text-center font-serif outline-2 outline-primary"
              style={{
                left: title.x,
                top: title.y,
                width: title.width,
                height: title.height,
                fontSize: title.fontSize,
                lineHeight: title.lineHeight,
                zIndex: 100,
              }}
              value={inlineTitle}
              onChange={(event) => setInlineTitle(event.target.value)}
              onBlur={(event) => {
                editor.content({ coupleTitle: event.target.value });
                setInlineTitle(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
                if (event.key === "Escape") setInlineTitle(null);
              }}
            />
          )}
          <div className="absolute inset-x-6 grid gap-3 text-sm" style={{ top: bodyTop }}>
            <div className="border-t border-ux-border pt-4">
              <p className="font-semibold">Budi Santoso & Partner</p>
              <p className="mt-1 text-xs text-secondary">Maksimal 2 orang · RSVP per sesi</p>
            </div>
            <span className="rounded-control bg-primary py-3 text-center text-sm font-semibold text-white">
              Konfirmasi kehadiran
            </span>
            <p className="text-center font-serif text-xl">
              Dengan hangat, {doc.content.coupleTitle}
            </p>
          </div>
        </div>
      </div>
      <p role="status" className="text-xs text-secondary">
        Terpilih: {doc.nodes.find((node) => node.id === selected)?.name ?? "tidak ada"}. Gunakan
        inspector untuk mengedit.
      </p>
    </div>
  );
}
