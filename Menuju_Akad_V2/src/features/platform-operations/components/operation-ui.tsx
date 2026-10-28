import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { Select } from "@/components/ui/select";
import type { Scenario } from "../types/operations";
import { useOperationVisible } from "./operation-panel";

export function OperationHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-secondary">{description}</p>
      </div>
      {action}
    </header>
  );
}
export function OperationCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-card border border-ux-border bg-surface p-5">
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="mt-2 text-sm leading-relaxed text-secondary">{description}</p>}
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}
export function Inspector({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <aside className="min-w-0 self-start rounded-card bg-ux-dock p-5">
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="mt-2 text-xs leading-relaxed text-secondary">{description}</p>}
      <div className="mt-5 grid gap-4">{children}</div>
    </aside>
  );
}
export function OperationNote({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-control bg-ux-dock p-4 text-sm">
      <Icon name="shield" className="shrink-0 text-brand-secondary" />
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-secondary">{children}</p>
      </div>
    </div>
  );
}
export function OperationScenario({
  scenario,
  onChange,
}: {
  scenario: Scenario;
  onChange: (value: Scenario) => void;
}) {
  const visible = useOperationVisible();
  if (!visible) return null;
  return (
    <details className="text-xs text-secondary">
      <summary className="min-h-11 py-3">Simulasi state lokal</summary>
      <div className="max-w-sm">
        <Select
          label="Kondisi saat tindakan"
          value={scenario}
          onChange={(event) => onChange(event.target.value as Scenario)}
        >
          <option value="ready">Terhubung · siap</option>
          <option value="loading">Memuat data</option>
          <option value="empty">Data kosong</option>
          <option value="offline">Offline</option>
          <option value="revoked">Izin / sesi dicabut</option>
          <option value="stale">Versi berubah saat review</option>
          <option value="failure">Sinkronisasi gagal</option>
        </Select>
      </div>
    </details>
  );
}
export function CheckLine({
  children,
  checked,
  onChange,
}: {
  children: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 items-start gap-3 py-3 text-xs leading-relaxed">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 shrink-0"
      />
      {children}
    </label>
  );
}
export function Badge({ children, danger = false }: { children: ReactNode; danger?: boolean }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-[11px] font-medium ${danger ? "bg-danger-bg text-danger" : "bg-ux-dock text-brand-secondary"}`}
    >
      {children}
    </span>
  );
}
