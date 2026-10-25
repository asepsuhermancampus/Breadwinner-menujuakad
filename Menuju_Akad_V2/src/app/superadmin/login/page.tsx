import { redirect } from "next/navigation";
export const runtime = "nodejs";
export default async function SuperadminLoginPage() {
  redirect("/login");
}
