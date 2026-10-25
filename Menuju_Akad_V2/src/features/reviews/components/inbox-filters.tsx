import { Field } from "@/components/ui/field";

type FilterValues = { status: string; rating: string; search: string };
export function InboxFilters({
  values,
  disabled,
  onChange,
}: {
  values: FilterValues;
  disabled: boolean;
  onChange: (key: keyof FilterValues, value: string) => void;
}) {
  const selectClass =
    "min-h-11 w-full rounded-control border border-ux-border bg-surface px-3 text-sm";
  return (
    <fieldset
      disabled={disabled}
      className="mt-8 grid gap-4 rounded-card border border-ux-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]"
    >
      <legend className="sr-only">Filter ulasan</legend>
      <Field
        label="Cari ulasan"
        type="search"
        value={values.search}
        maxLength={80}
        placeholder="Nama atau isi komentar"
        onChange={(event) => onChange("search", event.target.value)}
      />
      <label className="grid gap-2 text-sm font-medium">
        Status
        <select
          value={values.status}
          className={selectClass}
          onChange={(event) => onChange("status", event.target.value)}
        >
          <option value="">Semua status</option>
          <option value="pending">Menunggu</option>
          <option value="published">Ditampilkan</option>
          <option value="hidden">Disembunyikan</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Bintang
        <select
          value={values.rating}
          className={selectClass}
          onChange={(event) => onChange("rating", event.target.value)}
        >
          <option value="">Semua bintang</option>
          {[5, 4, 3, 2, 1].map((value) => (
            <option value={value} key={value}>
              {value} bintang
            </option>
          ))}
        </select>
      </label>
    </fieldset>
  );
}
