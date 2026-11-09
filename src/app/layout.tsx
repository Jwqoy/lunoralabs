import type { Metadata } from "next";
import { Ma_Shan_Zheng, Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import { COMPANY, PRODUCT } from "@/lib/brand";
import "./globals.css";

const notoSans = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSerif = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const maShan = Ma_Shan_Zheng({
  variable: "--font-ma-shan",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: `${PRODUCT} · ${COMPANY}`,
  description:
    "Lunora BaZi — 八字聊天宠物小弦（Nox）。先确认正确八字，再专属陪伴问答。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${notoSans.variable} ${notoSerif.variable} ${maShan.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
