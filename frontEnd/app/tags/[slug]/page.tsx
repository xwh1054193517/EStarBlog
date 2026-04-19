import { getMockSiteData } from "@/lib/mock-api";
import TagsDetailPageClient from "./TagsDetailPageClient";

export default async function TagsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const siteData = await getMockSiteData();

  const tag = siteData.tags.find((t) => t.slug === slug);

  if (!tag) {
    return (
      <div className="page-not-found">
        <h1>标签不存在</h1>
        <p>抱歉，您访问的标签页面不存在。</p>
      </div>
    );
  }

  return <TagsDetailPageClient slug={slug} tag={tag} siteData={siteData} />;
}
