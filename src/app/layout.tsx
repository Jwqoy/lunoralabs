import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import { COMPANY, PRODUCT } from "@/lib/brand";
import "./globals.css";

const notoSans = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${PRODUCT} · ${COMPANY}`,
  description: "Lunora BaZi — 小弦。先确认正确八字，再看见画面如何变化。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${notoSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
