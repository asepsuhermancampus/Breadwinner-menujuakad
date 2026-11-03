"use client";
import { useState } from "react";
import { X, Smartphone, Monitor, ExternalLink, Sparkles } from "lucide-react";
import type { VidingTemplate } from "../types/viding-template";
import styles from "./template-pagination.module.css";

type Props = {
  template: VidingTemplate | null;
  onClose: () => void;
  onSelect: (template: VidingTemplate) => void;
};

export function TemplatePreviewModal({ template, onClose, onSelect }: Props) {
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(true);

  if (!template) return null;

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Pratinjau ${template.name}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleGroup}>
            <div>
              <h2 className="font-bold text-base text-foreground leading-tight">
                {template.name} · {template.description}
              </h2>
              <p className="text-xs text-secondary">
                Pratinjau langsung template interaktif (Kategori {template.categoryLabel})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={styles.modalDeviceControls}>
              <button
                type="button"
                className={`${styles.deviceBtn} ${device === "mobile" ? styles.deviceBtnActive : ""}`}
                onClick={() => setDevice("mobile")}
                aria-label="Mode smartphone"
              >
                <Smartphone size={14} />
                <span>Smartphone</span>
              </button>
              <button
                type="button"
                className={`${styles.deviceBtn} ${device === "desktop" ? styles.deviceBtnActive : ""}`}
                onClick={() => setDevice("desktop")}
                aria-label="Mode desktop"
              >
                <Monitor size={14} />
                <span>Desktop</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-secondary hover:text-foreground hover:bg-canvas transition"
              aria-label="Tutup pratinjau"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={device === "mobile" ? styles.frameMobile : styles.frameDesktop} style={{ position: "relative" }}>
            {loading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#ffffff",
                  zIndex: 10,
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    border: "3px solid #e2e8f0",
                    borderTopColor: "var(--primary, #087f5b)",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                  Memuat pratinjau {template.name}…
                </p>
              </div>
            )}
            <iframe
              key={template.id}
              src={template.previewUrl}
              title={`Preview ${template.name}`}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen"
              onLoad={() => setLoading(false)}
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <a
            href={template.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-primary transition"
          >
            <ExternalLink size={14} />
            <span>Buka di tab baru (viding.co)</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-xs font-semibold border border-ux-border bg-surface text-foreground hover:bg-canvas transition"
              onClick={onClose}
            >
              Tutup
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-white hover:opacity-90 transition shadow-sm"
              onClick={() => {
                onSelect(template);
                onClose();
              }}
            >
              <Sparkles size={14} />
              <span>Gunakan Template Ini</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
