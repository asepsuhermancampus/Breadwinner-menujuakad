import { requireDevelopmentAccess } from "@/server/services/development-access";
import { PreviewVendor } from "@/preview/components/preview-vendor";

export const dynamic = "force-dynamic";

export default function VendorDevelopmentPage() {
  requireDevelopmentAccess();
  return <PreviewVendor />;
}
