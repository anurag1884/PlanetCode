// ============================================================
// PlanetCode — Root Layout
// File: apps/web/src/app/layout.tsx
// Status: PLACEHOLDER — not yet implemented
// ============================================================

// TODO: Implement root layout with:
// - ClerkProvider (when Clerk is integrated)
// - Global CSS import
// - Inter font from Google Fonts
// - Metadata (title, description, etc.)
// - ThemeProvider for dark mode

import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "PlanetCode — Collaborative Code Editor",
  description:
    "A secure, browser-based, real-time collaborative code editor. Create private coding rooms and edit together.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* TODO: Wrap with ClerkProvider */}
        {/* TODO: Wrap with ThemeProvider */}
        {children}
      </body>
    </html>
  );
}
