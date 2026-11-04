import { notFound } from "next/navigation";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readPublishedInvitation } from "@/server/workspaces/public-invitation";

export const dynamic = "force-dynamic";

export default async function PublicCustomerInvitation({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ workspace?: string }>;
}) {
  const { id } = await params;
  const { workspace } = await searchParams;
  if (!/^[a-f0-9-]{36}$/.test(id) || !workspace || !/^[a-f0-9-]{36}$/.test(workspace)) {
    notFound();
  }

  const data = readPublishedInvitation(getWorkspaceService().db, workspace, id);
  if (!data) notFound();

  // Extract theme number if set (e.g. "Tema 167" -> 167) or fallback to 167 / 1
  const match = data.template?.match(/\d+/);
  const themeId = match ? Math.max(1, Math.min(167, parseInt(match[0], 10))) : 167;

  const query = new URLSearchParams({
    groom: data.groom || "Nama Mempelai Pria",
    bride: data.bride || "Nama Mempelai Wanita",
    date: data.date || "Minggu, 14 Februari 2027",
    venue: data.venue || "Hotel Shangri-La Jakarta",
    title: data.title || "The Wedding",
  });

  const previewSrc = `/api/templates/preview/${themeId}?${query.toString()}`;

  return (
    <iframe
      src={previewSrc}
      title={data.title}
      className="fixed inset-0 h-full w-full border-0 bg-white"
      allow="autoplay; fullscreen"
    />
  );
}
