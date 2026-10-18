import { PreviewMicrosite } from "@/preview/components/preview-microsite";

export const dynamic = "force-dynamic";

// Editorial guest microsite (Batch 05): profile/story, guide, gallery,
// per-session RSVP, wishes, moments, inactive gifts — token-scoped, no workspace dock.
export default async function GuestMicrositePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  await params;
  return <PreviewMicrosite />;
}
