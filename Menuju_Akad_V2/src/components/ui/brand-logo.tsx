import Image from "next/image";

type Props = {
  variant?: "cypress" | "ivory" | "champagne" | "obsidian";
  className?: string;
  width?: number;
  height?: number;
};

const logoSources = {
  cypress: "/assets/images/brand/brand-palette/logo-cypress.png",
  ivory: "/assets/images/brand/brand-palette/logo-ivory.png",
  champagne: "/assets/images/brand/brand-palette/logo-champagne.png",
  obsidian: "/assets/images/brand/brand-palette/logo-obsidian.png",
};

export function BrandLogo({ variant = "cypress", className, width = 40, height = 19 }: Props) {
  return (
    <Image
      src={logoSources[variant]}
      alt="Menuju Akad"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
