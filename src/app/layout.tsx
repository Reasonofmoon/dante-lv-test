import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free IELTS Level Test | Get Your Lexile & CEFR Score",
  description: "Take a free 15-minute English proficiency test to get your estimated IELTS band, CEFR level, Lexile measure, and AR index.",
  keywords: ["IELTS", "CEFR", "Lexile", "English Test", "Placement Test", "ESL"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>{children}</body>
    </html>
  );
}
