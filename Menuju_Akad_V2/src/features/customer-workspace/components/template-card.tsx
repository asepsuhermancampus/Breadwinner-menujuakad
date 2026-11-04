"use client";
import { useState } from "react";
import Image from "next/image";
import { Eye, Sparkles } from "lucide-react";
import type { VidingTemplate } from "../types/viding-template";
import styles from "./template-card.module.css";

type Props = {
  template: VidingTemplate;
  onPreview: (template: VidingTemplate) => void;
  onSelect: (template: VidingTemplate) => void;
  disabled?: boolean;
};

export function TemplateCard({ template, onPreview, onSelect, disabled = false }: Props) {
  const [imgSrc, setImgSrc] = useState(template.image);

  return (
    <article className={styles.card}>
      <div className={styles.thumbnailContainer}>
        <Image
          src={imgSrc}
          alt={template.name}
          width={400}
          height={250}
          className={styles.thumbnailImage}
          loading="lazy"
          unoptimized
          onError={() => {
            if (imgSrc !== template.remoteImage) {
              setImgSrc(template.remoteImage);
            }
          }}
        />
        <div className={styles.cardFloatingBadge}>
          Tema #{template.themeNumber}
        </div>
        <div className={styles.cardCategoryBadge}>
          {template.categoryLabel}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div>
          <h3 className={styles.cardTitle}>{template.name}</h3>
          <p className={styles.cardDesc}>{template.description}</p>
        </div>

        <div className={styles.tagsRow}>
          {template.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tagPill}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.cardActions}>
          <button
            type="button"
            className={styles.btnPreview}
            onClick={() => onPreview(template)}
            aria-label={`Pratinjau ${template.name}`}
          >
            <Eye size={15} />
            <span>Pratinjau</span>
          </button>
          <button
            type="button"
            className={styles.btnUse}
            disabled={disabled}
            onClick={() => onSelect(template)}
            aria-label={`Gunakan ${template.name}`}
          >
            <Sparkles size={15} />
            <span>Gunakan</span>
          </button>
        </div>
      </div>
    </article>
  );
}
