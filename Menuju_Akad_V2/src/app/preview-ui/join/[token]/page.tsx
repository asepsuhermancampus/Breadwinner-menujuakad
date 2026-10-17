import { notFound } from "next/navigation";
import { PreviewJoin } from "@/preview/components/preview-onboarding";

export default async function JoinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) notFound();
  return <PreviewJoin token={token} />;
}
