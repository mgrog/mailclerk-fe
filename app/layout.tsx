import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";

export const metadata: Metadata = {
  title: "Next.js SaaS Starter",
  description: "Get started quickly with Next.js, Postgres, and Stripe.",
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`bg-base-100 text-black ${manrope.variable}`}>
      <body className="min-h-[100dvh] bg-base-100">{children}</body>
    </html>
  );
}
