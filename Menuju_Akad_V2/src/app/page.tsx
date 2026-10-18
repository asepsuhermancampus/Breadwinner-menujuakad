import type { Metadata } from "next";
import { LandingScreen } from "@/features/landing/components/landing-screen";

export const metadata: Metadata = {
  title: "Menuju Akad — Wedding Planner & Undangan Digital",
  description:
    "Dari checklist pertama hingga undangan yang berkesan. Menuju Akad membantu kalian merencanakan hari istimewa—lebih rapi, lebih tenang, bersama.",
};

export default function Home() {
  return <LandingScreen />;
}
