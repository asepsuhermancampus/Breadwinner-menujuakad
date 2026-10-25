import { CustomerAuth } from "@/features/auth/components/customer-auth";
export const dynamic = "force-dynamic";
export default function LoginPage() {
  return <CustomerAuth mode="login" />;
}
