import { PageSkeleton } from "@/components/ui/page-skeleton";

export function ResourceLoading({
  kind,
}: {
  kind: "guests" | "tasks" | "moodboard" | "documents" | "finance";
}) {
  return <PageSkeleton variant={kind === "moodboard" || kind === "finance" ? "cards" : "list"} />;
}
