"use client";
import { Icon } from "@/components/ui/icon";
import styles from "./budget-column-controls.module.css";
type Option = { value: string; label: string; tone?: "high" | "normal" | "low" };
function displayLabel(label: string) {
  return label.replace(/\S+/gu, (word, offset: number) => {
    if (
      offset > 0 &&
      ["di", "ke", "dari", "dan", "atau", "untuk"].includes(word.toLocaleLowerCase("id-ID"))
    )
      return word.toLocaleLowerCase("id-ID");
    return word.charAt(0).toLocaleUpperCase("id-ID") + word.slice(1);
  });
}
export function BudgetFilterChoices({
  label,
  value,
  options,
  change,
}: {
  label: string;
  value: string;
  options: readonly Option[];
  change: (value: string) => void;
}) {
  const selected = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  return (
    <div role="radiogroup" aria-label={label} className={styles.choices}>
      {options.map((option, index) => (
        <button
          type="button"
          role="radio"
          aria-checked={value === option.value}
          tabIndex={index === selected ? 0 : -1}
          key={option.value}
          onClick={() => change(option.value)}
          onKeyDown={(event) => {
            let next = index;
            if (event.key === "ArrowDown" || event.key === "ArrowRight")
              next = (index + 1) % options.length;
            else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
              next = (index - 1 + options.length) % options.length;
            else if (event.key === "Home") next = 0;
            else if (event.key === "End") next = options.length - 1;
            else return;
            event.preventDefault();
            event.currentTarget.parentElement
              ?.querySelectorAll<HTMLButtonElement>("button")
              [next]?.focus();
            change(options[next]!.value);
          }}
        >
          {option.tone && (
            <span aria-hidden="true" className={styles.priorityDot} data-tone={option.tone} />
          )}
          <span className={styles.optionLabel}>{displayLabel(option.label)}</span>
          {value === option.value && <Icon name="check" size={15} />}
        </button>
      ))}
    </div>
  );
}
