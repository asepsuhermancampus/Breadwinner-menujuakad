"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  personalToken: string;
};

export function GuestInspectorTokenSection({ personalToken }: Props) {
  const [copied, setCopied] = useState(false);

  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/i/${personalToken}`
      : `/i/${personalToken}`;

  function handleCopy() {
    navigator.clipboard?.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-3 bg-canvas border border-border rounded-control space-y-2">
      <label className="block text-xs font-semibold text-secondary">
        Tautan Personal (Opaque Token)
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={`menujuakad.id/i/••••${personalToken.slice(-4)}`}
          className="flex-1 text-xs bg-subtle px-2 py-1.5 rounded border border-border font-mono text-secondary"
        />
        <Button variant="secondary" size="small" onClick={handleCopy}>
          {copied ? "Tersalin!" : "Salin"}
        </Button>
      </div>
      <a
        href={`/i/${personalToken}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-xs text-primary font-semibold hover:underline pt-1"
      >
        Buka tampilan undangan tamu ↗
      </a>
    </div>
  );
}
