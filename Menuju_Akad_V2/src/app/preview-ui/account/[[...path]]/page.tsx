import { notFound } from "next/navigation";
import { PreviewAccount } from "@/preview/components/preview-account";

export default async function AccountPage({ params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  const key = path?.join("/") ?? "";
  const tab = key === "" ? "profile" : key;
  if (tab !== "profile" && tab !== "security" && tab !== "plans") notFound();
  return <PreviewAccount key={tab} tab={tab} />;
}
