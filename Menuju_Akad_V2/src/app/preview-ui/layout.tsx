import { notFound } from "next/navigation";
import { canViewPreview } from "@/preview/queries/preview-access";

export const dynamic = "force-dynamic";
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  if (!canViewPreview()) notFound();
  return <>{children}</>;
}
