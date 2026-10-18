import { PreviewMicrosite } from "@/preview/components/preview-microsite";
import { UnavailableLinkScreen } from "@/features/public-invitation/components/unavailable-link-screen";
import { hasMicrositeAccess } from "@/features/guest-experience/domain/microsite-access";

export const dynamic = "force-dynamic";

// Editorial guest microsite (Batch 05): profile/story, guide, gallery,
// per-session RSVP, wishes, moments, inactive gifts — token-scoped, no workspace dock.
export default async function GuestMicrositePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!hasMicrositeAccess(token)) return <UnavailableLinkScreen />;
  return <PreviewMicrosite />;
}
