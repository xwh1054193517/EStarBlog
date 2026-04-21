import type { Metadata } from "next";
import Script from "next/script";

import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "恒星博客",
  description: "一个长期更新的技术博客，记录思考、技术、生活。"
};

const themeSetScrip = `
  (function () {
    try {
      var stored = localStorage.getItem('theme');
      var dark = stored ? stored === 'dark' : true;
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    } catch (error) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Remix Icon - 本地加载，避免CDN阻塞 */}
        <link rel="stylesheet" href="/fonts/remixicon.css" />
        <Script id="theme-init" strategy="beforeInteractive">
          {themeSetScrip}
        </Script>
      </head>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
