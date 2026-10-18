import { PreviewPublicInvitation } from "@/preview/components/preview-invitation";

export const dynamic = "force-dynamic";

export default async function PublicInvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <PreviewPublicInvitation token={token} />;
}
