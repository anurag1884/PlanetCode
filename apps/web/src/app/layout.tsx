// ============================================================
// PlanetCode — Root Layout
// File: apps/web/src/app/layout.tsx
// ============================================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PlanetCode — Collaborative Code Editor",
  description:
    "A secure, browser-based, real-time collaborative code editor. Create private coding rooms and edit together.",
  keywords: ["collaborative", "code editor", "real-time", "websocket"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <body className="min-h-screen bg-background text-foreground antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

