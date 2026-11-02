"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";

const SECTIONS = [
  { id: "pemeliharaan-global", label: "Pemeliharaan Global", icon: "settings", count: "13 Fitur" },
  { id: "ketersediaan-kelompok", label: "Ketersediaan Peran", icon: "users", count: "Multi-Peran" },
  { id: "rilis-bertahap", label: "Rilis Bertahap", icon: "panel-left-open", count: "Staged" },
  { id: "card-dashboard", label: "Kartu Dashboard", icon: "monitor", count: "Tampilan" },
] as const;

export function FeaturesNavBar() {
  const [active, setActive] = useState<string>("pemeliharaan-global");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setShowScrollTop(window.scrollY > 400);

      const positions = SECTIONS.map((sec) => {
        const el = document.getElementById(sec.id);
        if (!el) return { id: sec.id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id: sec.id, top: Math.abs(rect.top - 120) };
      });
      positions.sort((a, b) => a.top - b.top);
      if (positions[0] && positions[0].top < 600) {
        setActive(positions[0].id);
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
    }
  }

  return (
    <>
      <nav
        aria-label="Navigasi cepat bagian fitur"
        className="sticky top-[76px] z-10 -mx-4 -mt-2 flex flex-wrap items-center justify-between gap-2 border-b border-control-border bg-surface/90 px-4 py-2.5 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {SECTIONS.map((sec) => {
            const isCurrent = active === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  isCurrent
                    ? "bg-brand-secondary text-on-primary shadow-xs"
                    : "bg-surface border border-ux-border text-secondary hover:bg-subtle hover:text-foreground"
                }`}
              >
                <Icon name={sec.icon} size={13} />
                <span>{sec.label}</span>
                <span
                  className={`hidden sm:inline rounded-full px-1.5 py-0.2 text-[10px] ${
                    isCurrent ? "bg-white/20 text-white" : "bg-canvas text-secondary"
                  }`}
                >
                  {sec.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden text-[11px] text-muted md:flex items-center gap-1">
          <span>Superadmin Feature Control</span>
        </div>
      </nav>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Kembali ke atas"
          className="fixed bottom-6 right-6 z-30 flex size-10 items-center justify-center rounded-full border border-ux-border bg-surface text-brand-secondary shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <Icon name="panel-left-close" size={16} className="-rotate-90" />
        </button>
      )}
    </>
  );
}

