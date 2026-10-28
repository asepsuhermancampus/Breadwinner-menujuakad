"use client";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Icon } from "@/components/ui/icon";
import type { OperationsNavItem } from "../types/navigation";
type Props = {
  roleLabel: string;
  identity: string;
  description: string;
  account: string;
  active: string;
  items: OperationsNavItem[];
  compact?: boolean;
  onNavigate: (view: string) => void;
  onUnavailable: (label: string) => void;
  onToggle: () => void;
  live?: boolean;
};
export function OperationsDock({
  roleLabel,
  identity,
  description,
  account,
  active,
  items,
  compact,
  onNavigate,
  onUnavailable,
  onToggle,
  live,
}: Props) {
  const first = items.find(
    (item) => item.view === active || item.children?.some((child) => child.view === active),
  );
  return (
    <div className="flex h-full min-h-[600px] min-w-0 flex-col gap-[18px] rounded-[10px] border border-control-border bg-ux-dock lg:rounded-r-none p-3">
      <div className="flex min-h-10 items-center gap-2">
        {!compact && (
          <>
            <BrandLogo width={32} height={16} className="h-auto shrink-0" />
            <span className="flex-1 text-sm font-semibold text-brand-secondary">menuju akad</span>
          </>
        )}
        <button
          className="grid size-11 shrink-0 place-items-center rounded-control hover:bg-subtle"
          aria-label={compact ? "Perluas navigasi operasi" : "Ringkas navigasi operasi"}
          onClick={onToggle}
        >
          <Icon name={compact ? "panel-left-open" : "panel-left-close"} />
        </button>
      </div>
      {!compact && (
        <div className="grid gap-3 rounded-control bg-ux-soft p-3.5 text-foreground">
          <p className="text-[10px] font-semibold tracking-wider">{roleLabel}</p>
          <p className="text-base font-semibold">{identity}</p>
          <p className="text-xs text-secondary">{description}</p>
        </div>
      )}
      <nav aria-label={`Navigasi ${roleLabel}`} className="grid content-start gap-1">
        {items.map((item) => {
          const chosen = item === first;
          const main = (
            <span
              className={`flex min-h-11 items-center gap-2.5 rounded-control px-3 text-xs ${chosen ? "bg-nav-active text-foreground" : "text-secondary hover:bg-subtle"}`}
            >
              <Icon name={item.icon} size={17} />
              {!compact && item.label}
            </span>
          );
          return item.children && !compact ? (
            <details key={item.label} open={chosen}>
              <summary className="list-none cursor-pointer" aria-label={item.label}>
                {main}
              </summary>
              <div className="ml-4 mt-1 grid border-l border-ux-border pl-2">
                {item.children.map((child) => (
                  <button
                    key={child.view}
                    aria-current={active === child.view ? "page" : undefined}
                    className={`min-h-11 rounded-control px-3 text-left text-xs ${active === child.view ? "font-semibold text-brand-secondary" : "text-secondary hover:bg-subtle"}`}
                    onClick={() => onNavigate(child.view)}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            </details>
          ) : (
            <button
              key={item.label}
              title={compact ? item.label : undefined}
              aria-label={compact ? item.label : undefined}
              aria-current={chosen ? "page" : undefined}
              onClick={() =>
                item.view || item.children?.[0]?.view
                  ? onNavigate(item.view ?? item.children![0]!.view)
                  : onUnavailable(item.label)
              }
            >
              {main}
            </button>
          );
        })}
      </nav>
      <div className="flex-1" />
      {!compact && (
        <div className="grid gap-2 rounded-control border border-ux-border bg-canvas p-3 text-xs">
          <p className="font-medium text-brand-secondary">
            {live ? "Lingkup operasional" : "Sandbox · Preset 3"}
          </p>
          <p className="text-secondary">
            {live ? "Akses terbatas · tim internal" : "Pratinjau, bukan rilis produksi"}
          </p>
        </div>
      )}
      <button
        className="flex min-h-12 items-center gap-3 rounded-control border border-ux-border bg-surface p-2.5 text-left"
        aria-label={`Akses ${account}`}
        onClick={() => onUnavailable(`Akses ${account}`)}
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-subtle text-xs">
          {account[0]}
        </span>
        {!compact && (
          <>
            <span className="min-w-0 flex-1 text-xs">
              <strong className="block truncate font-medium" title={account}>
                {account}
              </strong>
              <span className="mt-1 block text-secondary">
                {roleLabel === "BRAND AMBASSADOR" ? "Kreator & afiliasi" : roleLabel}
              </span>
            </span>
            <Icon name="settings" size={16} />
          </>
        )}
      </button>
    </div>
  );
}
