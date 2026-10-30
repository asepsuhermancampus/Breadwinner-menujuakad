import Link from "next/link";
import { useFeatureAvailability } from "./feature-availability-context";
const features = [
  ["unlimited-guests", "Daftar tamu", "/planner/guests"],
  ["unlimited-tasks", "Checklist & tugas", "/planner/tasks"],
  ["premium-templates", "Template undangan", "/planner/invitations"],
  ["studio", "Studio visual", "/planner/invitations/studio"],
  ["moodboard", "Moodboard", "/planner/moodboard"],
  ["pdf", "Ekspor rencana PDF", "/planner/wedding-kit"],
  ["multi-invitation", "Multi-undangan", "/planner/invitations"],
  ["custom-domain", "Custom domain", "/account/domain"],
  ["priority-support", "Prioritas bantuan", "/account/support"],
] as const;
export function CustomerFeatureLinks({
  tasksAvailable = true,
  moodboardAvailable = true,
  pdfAvailable = true,
  invitationsAvailable = true,
  studioAvailable = true,
  guestsAvailable = true,
}: {
  tasksAvailable?: boolean;
  moodboardAvailable?: boolean;
  pdfAvailable?: boolean;
  invitationsAvailable?: boolean;
  studioAvailable?: boolean;
  guestsAvailable?: boolean;
}) {
  const supportAvailable = useFeatureAvailability()?.support === true;
  const domainAvailable = useFeatureAvailability()?.domain === true;
  return (
    <nav
      aria-label="Fitur paket kalian"
      className="flex flex-wrap gap-x-5 gap-y-1 border-t border-ux-border pt-4"
    >
      {features
        .filter(
          ([id]) =>
            (guestsAvailable || id !== "unlimited-guests") &&
            (supportAvailable || id !== "priority-support") &&
            (domainAvailable || id !== "custom-domain") &&
            (tasksAvailable || id !== "unlimited-tasks") &&
            (moodboardAvailable || id !== "moodboard") &&
            (pdfAvailable || id !== "pdf") &&
            (invitationsAvailable || (id !== "premium-templates" && id !== "multi-invitation")) &&
            (studioAvailable || id !== "studio"),
        )
        .map(([id, title, href]) => (
          <Link
            key={id}
            id={`feature-${id}`}
            href={href}
            className="flex min-h-11 items-center rounded-control px-2 text-xs text-secondary hover:bg-subtle hover:text-brand-secondary"
          >
            {title} ↗
          </Link>
        ))}
    </nav>
  );
}
