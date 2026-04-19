import { getMockSiteData } from "@/lib/mock-api";
import CategoryPageClient from "./CategoryPageClient";

export default async function CategoriesDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const siteData = await getMockSiteData();

  const category = siteData.categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="page-not-found">
        <h1>分类不存在</h1>
        <p>抱歉，您访问的分类页面不存在。</p>
      </div>
    );
  }

  return <CategoryPageClient slug={slug} category={category} siteData={siteData} />;
}
