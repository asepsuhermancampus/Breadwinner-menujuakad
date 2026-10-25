import type { ReactNode } from "react";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export function FeatureLock({
  title,
  plan = "Premium atau Lifetime",
  description,
  showPlans = true,
  children,
}: {
  title: string;
  plan?: string;
  description?: string | undefined;
  showPlans?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative isolate min-h-80 rounded-card border border-ux-border bg-surface">
      <div
        data-feature-content
        inert
        aria-hidden="true"
        className="pointer-events-none max-h-[40rem] min-h-80 select-none overflow-hidden rounded-card p-4 opacity-60 blur-[2px]"
      >
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-card bg-canvas/25 p-4">
        <section
          role="region"
          aria-label={`${title} terkunci`}
          className="w-full max-w-sm space-y-4 rounded-card border border-ux-border bg-surface p-6 text-center shadow-lg"
        >
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-subtle text-primary">
            <LockKeyhole aria-hidden="true" size={24} />
          </span>
          <h2 className="text-xl font-semibold">{title} terkunci</h2>
          <p className="text-sm text-secondary">
            {description ??
              `Berlangganan paket ${plan} untuk mengakses fitur ini pada akun kalian.`}
          </p>
          {showPlans && (
            <Link
              href="/account/plans"
              className="inline-flex rounded-control bg-primary px-5 py-3 text-sm font-semibold text-white"
            >
              Lihat paket
            </Link>
          )}
        </section>
      </div>
    </div>
  );
}
