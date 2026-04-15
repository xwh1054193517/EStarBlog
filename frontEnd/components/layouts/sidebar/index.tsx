import AnnouncementCard from "@/components/layouts/sidebar/AnnouncementCard";
import ArchivesCard from "@/components/layouts/sidebar/ArchivesCard";
import AuthorCard from "@/components/layouts/sidebar/AuthorCard";
import CategoriesCard from "@/components/layouts/sidebar/CategoriesCard";
import TagsCard from "@/components/layouts/sidebar/TagsCard";
import TocCard from "@/components/layouts/sidebar/TocCard";
import WebInfoCard from "@/components/layouts/sidebar/WebInfoCard";
import type { Article, SiteData } from "@/lib/types";

export default function Sidebar({
  siteData,
  isArticlePage
}: {
  siteData: SiteData;
  isArticlePage: boolean;
}) {
  return (
    <aside id="sidebar">
      <AuthorCard siteData={siteData} />
      <AnnouncementCard announcement={siteData.blogConfig.announcement} />
      <div className="sticky-sidebar">
        <>
          <CategoriesCard categories={siteData.categories} />
          <TagsCard tags={siteData.tags} />
          <ArchivesCard archives={siteData.archives} />
          <WebInfoCard stats={siteData.siteStats} established={siteData.blogConfig.established} />
        </>
      </div>
    </aside>
  );
}
