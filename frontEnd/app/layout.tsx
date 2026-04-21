import type { Metadata } from "next";

import { QueryProvider } from "@/components/providers/QueryProvider";
import ThemeScript from "@/components/providers/ThemeScript";
import TrackerScript from "@/components/providers/TrackerScript";
import "./globals.css";

export const metadata: Metadata = {
  title: "恒星博客",
  description: "一个长期更新的技术博客，记录思考、技术、生活。"
};

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
      </head>
      <body>
        <ThemeScript />
        <TrackerScript />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
