import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = { title: "Albert Sama — Développeur full-stack", description: "Portfolio d’Albert Sama, développeur web full-stack." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr" className={`${dmSans.variable} ${fraunces.variable}`}><body>{children}</body></html>;
}
