"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layouts/footer";
import Header from "@/components/layouts/header";
import Navbar from "@/components/layouts/navbar";
import FloatButton from "@/components/ui/FloatButton";
import Sidebar from "./sidebar";
import type { SiteData, Article, TocItem, MomentItem } from "@/lib/types";

interface DefaultLayoutProps {
  children: React.ReactNode;
  siteData: SiteData;
  pageType?: "home" | "post" | "page";
  showSidebar?: boolean;
  headerVariant?: "home" | "page" | "post";
  headerTitle?: string;
  headerSubtitle?: string;
  article?: Article;
  toc?: TocItem[];
  moments?: MomentItem[];
}

export default function DefaultLayout({
  children,
  siteData,
  pageType = "page",
  showSidebar = true,
  headerVariant,
  headerTitle,
  headerSubtitle,
  article,
  toc,
  moments
}: DefaultLayoutProps) {
  const pathname = usePathname();
  const effectiveHeaderVariant =
    headerVariant ?? (pageType === "home" ? "home" : pageType === "post" ? "post" : "page");
  const showMomentWidget = pageType === "home" && moments && moments.length > 0;

  return (
    <div className="layout-wrapper">
      <div className="web_bg"></div>
      <Navbar siteData={siteData} showHeader={pageType !== "page"} />
      <Header
        siteData={siteData}
        variant={effectiveHeaderVariant}
        title={headerTitle}
        subtitle={headerSubtitle}
        article={article}
      />
      <main className="page-main">
        <div className="main-layout">
          <div className={`main-content${showSidebar ? "" : " full-width"}`}>{children}</div>
          {showSidebar ? (
            <Sidebar
              siteData={siteData}
              isArticlePage={pageType === "post"}
              toc={pageType === "post" ? toc : undefined}
            />
          ) : null}
        </div>
      </main>
      <Footer siteData={siteData} />
      <FloatButton />
    </div>
  );
}
