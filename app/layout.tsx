import type { Metadata } from "next";
import { Geist, Noto_Sans_JP, Noto_Sans_KR } from "next/font/google";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-jp",
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-kr",
});

export const metadata: Metadata = {
  title: "Tokyo Metro",
  description: "Tokyo Metro railway information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geist.variable} ${notoSansJP.variable} ${notoSansKR.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
