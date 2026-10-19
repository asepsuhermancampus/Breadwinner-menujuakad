import { requireDevelopmentAccess } from "@/server/services/development-access";
import { PreviewAdmin } from "@/preview/components/preview-admin";
export const dynamic = "force-dynamic";
export default function AdminDevelopmentPage() {
  requireDevelopmentAccess();
  return <PreviewAdmin />;
}
