import type { Metadata } from "next";
import { Noto_Sans_SC, Space_Grotesk } from "next/font/google";
import { COMPANY, PRODUCT } from "@/lib/brand";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSans = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: `${PRODUCT} · ${COMPANY}`,
  description:
    "Lunora BaZi — precision BaZi companion 小弦（Nox）. Confirm the chart, then ask with clarity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${spaceGrotesk.variable} ${notoSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
