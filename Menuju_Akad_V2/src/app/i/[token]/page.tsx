import { GuestRsvpService } from "@/server/workspaces/guest-rsvp";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { GuestRsvp } from "@/features/customer-workspace/components/guest-rsvp";
import { UnavailableLinkScreen } from "@/features/public-invitation/components/unavailable-link-screen";
export const dynamic = "force-dynamic";
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const initial = new GuestRsvpService(getWorkspaceService().db).read(token);
  return initial ? <GuestRsvp token={token} initial={initial} /> : <UnavailableLinkScreen />;
}
