import { PreviewInvitationStudio } from "@/preview/components/preview-guests";

export const dynamic = "force-dynamic";

export default async function PlannerInvitationStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string; view?: string }>;
}) {
  const { project, view } = await searchParams;
  const projectId =
    typeof project === "string" && /^[a-zA-Z0-9-]{1,120}$/.test(project)
      ? project
      : "inv-wedding-main";
  return (
    <PreviewInvitationStudio
      key={projectId}
      projectId={projectId}
      previewActive={view === "active"}
    />
  );
}
