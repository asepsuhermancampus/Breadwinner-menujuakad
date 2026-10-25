import Link from "next/link";
const features = [
  ["unlimited-guests", "Daftar tamu", "/planner/guests"],
  ["unlimited-tasks", "Checklist & tugas", "/planner/tasks"],
  ["premium-templates", "Template undangan", "/planner/invitations"],
  ["studio", "Studio visual", "/planner/invitations/studio"],
  ["moodboard", "Moodboard", "/planner/moodboard"],
  ["pdf", "Ekspor rencana PDF", "/planner/wedding-kit"],
  ["multi-invitation", "Multi-undangan", "/planner/invitations"],
  ["custom-domain", "Custom domain", "/account?section=domain"],
  ["priority-support", "Prioritas bantuan", "/account?section=support"],
] as const;
export function CustomerFeatureLinks() {
  return (
    <nav
      aria-label="Fitur paket kalian"
      className="flex flex-wrap gap-x-5 gap-y-1 border-t border-ux-border pt-4"
    >
      {features.map(([id, title, href]) => (
        <Link
          key={id}
          id={`feature-${id}`}
          href={href}
          className="flex min-h-11 items-center rounded-control px-2 text-xs text-secondary hover:bg-subtle hover:text-primary"
        >
          {title} ↗
        </Link>
      ))}
    </nav>
  );
}
