"use client";
import { numericCategories } from "../domain/viding-templates";
import styles from "./template-catalog.module.css";

type Props = {
  selectedCategory: number;
  onSelectCategory: (categoryId: number) => void;
};

export function TemplateNumericTabs({ selectedCategory, onSelectCategory }: Props) {
  return (
    <nav className={styles.categoryScroll} aria-label="Kategori nomor template">
      {numericCategories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            className={`${styles.categoryBtn} ${isActive ? styles.categoryBtnActive : ""}`}
            onClick={() => onSelectCategory(cat.id)}
            aria-pressed={isActive}
          >
            <span>{cat.label}</span>
            <small style={{ opacity: 0.8 }}>({cat.count})</small>
          </button>
        );
      })}
    </nav>
  );
}
