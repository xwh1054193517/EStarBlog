import type { Metadata } from "next";
import Script from "next/script";
import "./admin.css";

export const metadata: Metadata = {
  title: "管理后台 - ESBlog Admin",
  description: "ESBlog 管理后台",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✨</text></svg>"
  }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script id="admin-theme" strategy="beforeInteractive">
        {`document.documentElement.setAttribute('data-theme', 'light'); document.documentElement.classList.remove('dark');`}
      </Script>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css"
      />
      {children}
    </>
  );
}
