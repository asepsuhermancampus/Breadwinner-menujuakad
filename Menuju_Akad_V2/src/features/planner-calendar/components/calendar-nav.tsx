type Props = {
  weekIndex: number;
  totalWeeks: number;
  rangeLabel: string;
  onPrev: () => void;
  onNext: () => void;
};

export function CalendarNav({ weekIndex, totalWeeks, rangeLabel, onPrev, onNext }: Props) {
  return (
    <div className="flex items-center gap-2" aria-label="Navigasi minggu">
      <button
        type="button"
        onClick={onPrev}
        disabled={weekIndex <= 0}
        aria-label="Minggu sebelumnya"
        className="customer-control rounded border border-ux-border px-2 py-0.5 text-xs text-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        ←
      </button>
      <span className="font-mono text-xs text-secondary">{rangeLabel}</span>
      <button
        type="button"
        onClick={onNext}
        disabled={weekIndex >= totalWeeks - 1}
        aria-label="Minggu berikutnya"
        className="customer-control rounded border border-ux-border px-2 py-0.5 text-xs text-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        →
      </button>
    </div>
  );
}
