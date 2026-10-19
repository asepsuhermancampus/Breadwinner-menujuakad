import { requireDevelopmentAccess } from "@/server/services/development-access";
import { PreviewAmbassador } from "@/preview/components/preview-ambassador";
export const dynamic = "force-dynamic";
export default function AmbassadorDevelopmentPage() {
  requireDevelopmentAccess();
  return <PreviewAmbassador />;
}
