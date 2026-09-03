import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bowflex Workout Tracker",
  description: "Track an eight-week Bowflex Xceed and SOLE E95 workout plan.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
