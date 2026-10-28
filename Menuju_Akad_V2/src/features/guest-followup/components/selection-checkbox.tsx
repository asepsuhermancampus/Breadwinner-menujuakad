import { Icon } from "@/components/ui/icon";

export function SelectionCheckbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean | "mixed";
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="grid size-11 shrink-0 place-items-center rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span
        aria-hidden="true"
        className={`grid size-5 place-items-center rounded border ${
          checked
            ? "border-primary bg-primary text-on-primary"
            : "border-ux-control-border bg-surface"
        }`}
      >
        {checked === "mixed" ? (
          <span className="h-0.5 w-2.5 bg-current" />
        ) : checked ? (
          <Icon name="check" size={12} />
        ) : null}
      </span>
    </button>
  );
}
