import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const jakarta = localFont({
  src: "../../public/assets/fonts/plus-jakarta-sans/latin-variable.woff2",
  variable: "--font-jakarta",
  display: "swap",
  weight: "200 800",
});
const instrument = localFont({
  src: "../../public/assets/fonts/instrument-serif/latin-regular.woff2",
  variable: "--font-instrument",
  display: "swap",
  weight: "400",
});
const geist = localFont({
  src: "../../public/assets/fonts/geist-mono/latin-variable.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});
export const metadata: Metadata = {
  title: { default: "Menuju Akad — Ruang rencana kalian", template: "%s | Menuju Akad" },
  description: "Satu ruang untuk setiap langkah menuju akad.",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${instrument.variable} ${geist.variable}`}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-surface focus:p-3"
        >
          Lewati ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
