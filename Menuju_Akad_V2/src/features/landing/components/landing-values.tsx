import { Icon } from "@/components/ui/icon";

const values = [
  {
    icon: "users" as const,
    title: "Satu ruang untuk berdua",
    description: "Bukan lagi catatan yang terpencar.",
  },
  {
    icon: "check" as const,
    title: "Rencana yang terasa ringan",
    description: "Tahu apa yang perlu dikerjakan.",
  },
  {
    icon: "info" as const,
    title: "Undangan yang personal",
    description: "Bagikan kabar, sambut orang terdekat.",
  },
];

export function LandingValues() {
  return (
    <section id="tentang" className="border-b border-ux-border bg-surface py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="flex items-center gap-4 rounded-control border border-ux-border bg-ux-dock/50 p-4 transition hover:bg-ux-dock"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-control bg-primary/10 text-brand-secondary">
                <Icon name={v.icon} size={20} />
              </div>
              <div>
                <h3 className="font-sans text-sm font-semibold text-brand-secondary">{v.title}</h3>
                <p className="mt-0.5 text-xs text-secondary">{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
