import { notFound } from "next/navigation";
import { PreviewAuth } from "@/preview/components/preview-auth";

export default async function AuthPage({ params }: { params: Promise<{ mode: string }> }) {
  const { mode } = await params;
  if (mode !== "login" && mode !== "register" && mode !== "recovery") notFound();
  return <PreviewAuth mode={mode} />;
}
