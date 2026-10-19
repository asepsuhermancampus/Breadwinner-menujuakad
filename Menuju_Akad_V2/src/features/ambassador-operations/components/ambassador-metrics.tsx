import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";

export function AmbassadorMetrics({
  items,
}: {
  items: { label: string; value: string | number; hint: string }[];
}) {
  return (
    <div className="grid gap-8 border-b border-border pb-5 md:grid-cols-3">
      {items.map((item) => (
        <section key={item.label} className="py-2">
          <h2 className="text-[13px] text-secondary">{item.label}</h2>
          <p className="mt-3 font-mono text-[28px]">
            {typeof item.value === "number" ? formatIdr(item.value) : item.value}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-secondary">{item.hint}</p>
        </section>
      ))}
    </div>
  );
}
