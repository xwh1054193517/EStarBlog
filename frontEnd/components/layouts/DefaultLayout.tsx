"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layouts/footer";
import Header from "@/components/layouts/header";
import Navbar from "@/components/layouts/navbar";
import type { SiteData } from "@/lib/types";
import Sidebar from "./sidebar";

interface DefaultLayoutProps {
  children: React.ReactNode;
  siteData: SiteData;
  pageType?: "home" | "post" | "page";
  showSidebar?: boolean;
  headerVariant?: "home" | "page" | "none";
  headerTitle?: string;
  headerSubtitle?: string;
}

export default function DefaultLayout({
  children,
  siteData,
  pageType = "page",
  showSidebar = true,
  headerVariant = pageType === "home" ? "home" : "none",
  headerTitle,
  headerSubtitle
}: DefaultLayoutProps) {
  usePathname();

  return (
    <div className="layout-wrapper">
      <div className="web_bg"></div>
      <Navbar siteData={siteData} showHeader={pageType !== "page"} />
      <Header
        siteData={siteData}
        variant={headerVariant}
        title={headerTitle}
        subtitle={headerSubtitle}
      />
      <main className="page-main">
        <div className="main-layout">
          {showSidebar ? <Sidebar siteData={siteData} isArticlePage={pageType === "post"} /> : null}
          <div className={`main-content${showSidebar ? "" : " full-width"}`}>{children}</div>
        </div>
      </main>
      <Footer siteData={siteData} />
    </div>
  );
}
