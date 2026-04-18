import ArchivesCard from "@/components/layouts/sidebar/ArchivesCard";
import AuthorCard from "@/components/layouts/sidebar/AuthorCard";
import CategoriesCard from "@/components/layouts/sidebar/CategoriesCard";
import TagsCard from "@/components/layouts/sidebar/TagsCard";
import TocCard from "@/components/layouts/sidebar/TocCard";
import WebInfoCard from "@/components/layouts/sidebar/WebInfoCard";
import type { Article, SiteData, TocItem } from "@/lib/types";

interface SidebarProps {
  siteData: SiteData;
  isArticlePage?: boolean;
  toc?: TocItem[];
}

export default function Sidebar({ siteData, isArticlePage = false, toc = [] }: SidebarProps) {
  return (
    <aside id="sidebar">
      <AuthorCard siteData={siteData} />
      <div className="sticky-sidebar">
        {isArticlePage ? (
          <TocCard toc={toc} />
        ) : (
          <>
            <CategoriesCard categories={siteData.categories} />
            <TagsCard tags={siteData.tags} />
            <ArchivesCard archives={siteData.archives} />
            <WebInfoCard stats={siteData.siteStats} established={siteData.blogConfig.established} />
          </>
        )}
      </div>
    </aside>
  );
}
