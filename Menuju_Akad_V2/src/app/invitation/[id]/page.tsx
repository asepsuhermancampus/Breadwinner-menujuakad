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
  if (!/^[a-f0-9-]{36}$/.test(id) || !workspace || !/^[a-f0-9-]{36}$/.test(workspace)) notFound();
  const data = readPublishedInvitation(getWorkspaceService().db, workspace, id);
  if (!data) notFound();
  return (
    <main
      className={`grid min-h-screen place-content-center gap-6 p-8 text-center ${data.template === "premium" ? "bg-primary text-white" : "bg-canvas text-primary"}`}
    >
      <p className="text-xs uppercase tracking-widest">Undangan pernikahan</p>
      <h1 className="font-serif text-5xl">
        {data.groom || "Nama pertama"} &amp; {data.bride || "Nama pasangan"}
      </h1>
      <h2 className="text-xl">{data.title}</h2>
      <p>{data.date}</p>
      <p>{data.venue}</p>
      <p className="mt-6 text-sm">
        Dengan bahagia kami mengundang Anda merayakan hari istimewa kami.
      </p>
    </main>
  );
}
