import { redirect } from "next/navigation";
export default function Home() {
  redirect("/preview-ui/auth/login");
}
