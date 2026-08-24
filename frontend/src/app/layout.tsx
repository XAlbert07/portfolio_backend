import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-albert-sama.vercel.app";
const dmSans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = { metadataBase: new URL(siteUrl), title: { default: "Albert Sama — Développeur full-stack", template: "%s — Albert Sama" }, description: "Portfolio d’Albert Sama, développeur web full-stack à Ouagadougou.", alternates: { canonical: "/" }, openGraph: { type: "website", locale: "fr_FR", url: siteUrl, siteName: "Albert Sama", title: "Albert Sama — Développeur full-stack", description: "Portfolio d’Albert Sama, développeur web full-stack à Ouagadougou.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Portfolio d’Albert Sama, développeur web full-stack" }] }, twitter: { card: "summary_large_image", title: "Albert Sama — Développeur full-stack", description: "Portfolio d’Albert Sama, développeur web full-stack à Ouagadougou.", images: ["/opengraph-image"] }, robots: { index: true, follow: true } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr" className={`${dmSans.variable} ${fraunces.variable}`}><body>{children}</body></html>;
}
