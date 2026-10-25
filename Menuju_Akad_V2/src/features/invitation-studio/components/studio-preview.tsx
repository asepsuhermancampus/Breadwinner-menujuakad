"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { createPreviewHtml } from "../domain/preview-html";
import type { StudioDocument } from "../types/editor";

export function StudioPreview({
  document,
  viewport,
  onClose,
}: {
  document: StudioDocument;
  viewport: number;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(400);
  const scale = Math.min(1, available / viewport);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setAvailable(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <Dialog open onClose={onClose} title={`Hasil undangan · ${viewport} px`}>
      <p className="mb-4 text-xs text-secondary">
        Viewport aktual {viewport} CSS px. Konten melakukan reflow; tanpa selection, inspector, atau
        daftar kontak.
      </p>
      <div ref={ref} className="w-full overflow-hidden" style={{ height: 1000 * scale }}>
        <iframe
          width={viewport}
          title={`Hasil undangan ${viewport}`}
          sandbox=""
          srcDoc={createPreviewHtml(document, window.location.origin, true)}
          style={{
            width: viewport,
            height: 1000,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            border: 0,
          }}
        />
      </div>
    </Dialog>
  );
}
