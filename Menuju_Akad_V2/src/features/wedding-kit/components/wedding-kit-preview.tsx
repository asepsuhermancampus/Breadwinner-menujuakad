import { CardOrnament } from "@/components/ui/card-ornament";
import styles from "./wedding-kit.module.css";

type Props = {
  sections?: readonly string[];
  description?: string;
  footer: string;
};

export function WeddingKitPreview({ sections, description, footer }: Props) {
  return (
    <aside className={styles.panel} aria-label="Pratinjau Wedding Kit">
      <CardOrnament variant={4} />
      <div className={styles.previewDoc}>
        <span className="font-serif text-2xl text-brand-secondary">menuju akad</span>
        <div className="border-t border-ux-border pt-8">
          <h2 className="font-serif text-4xl text-brand-secondary">Wedding Kit</h2>
          <p className="mt-3 text-sm text-secondary">Ringkasan perencanaan kalian</p>
        </div>
        {sections && (
          <ol className="mt-6 grid gap-4 text-sm text-secondary">
            {sections.map((label, index) => (
              <li key={label} className="flex gap-4 border-b border-ux-border pb-3">
                <span className="font-mono text-xs">{String(index + 1).padStart(2, "0")}</span>
                {label}
              </li>
            ))}
          </ol>
        )}
        {description && (
          <p className="mt-6 text-sm leading-relaxed text-secondary">{description}</p>
        )}
        <p className="mt-auto pt-6 text-xs leading-relaxed text-secondary">{footer}</p>
      </div>
    </aside>
  );
}
