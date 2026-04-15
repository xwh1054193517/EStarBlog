import Link from "next/link";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { getMockSiteData } from "@/lib/mock-api";
import { getTagsOverview } from "@/lib/tags-api";

const palette = [
  "#4d7c0f",
  "#0f766e",
  "#1d4ed8",
  "#7c3aed",
  "#b45309",
  "#be185d",
  "#047857",
  "#6d28d9"
];

export default async function TagsPage() {
  const [siteData, tagsOverview] = await Promise.all([getMockSiteData(), getTagsOverview()]);
  const chartTags = tagsOverview.tags.slice(0, 10);
  const maxCount = Math.max(...chartTags.map((tag) => tag.count), 1);

  return (
    <DefaultLayout
      siteData={siteData}
      pageType="page"
      showSidebar={false}
      headerVariant="page"
      headerTitle="标签"
      headerSubtitle={`共收录 ${tagsOverview.totalTags} 个标签，覆盖 ${tagsOverview.totalTaggedPosts} 次文章归档`}
    >
      <section className="tags-page">
        <div className="tags-page__panel">
          <div className="tags-page__intro">
            <div>
              <p className="tags-page__eyebrow">Tag Observatory</p>
              <h2>用标签把文章的脉络展开来看</h2>
              <p className="tags-page__description">
                这里保留了参考图里“统计图 + 标签云”的双层结构，并按当前博客数据计算热度、权重和展示大小。
              </p>
            </div>
            <div className="tags-page__summary">
              <div className="tags-page__summary-card">
                <span>标签总数</span>
                <strong>{tagsOverview.totalTags}</strong>
              </div>
              <div className="tags-page__summary-card">
                <span>归档次数</span>
                <strong>{tagsOverview.totalTaggedPosts}</strong>
              </div>
              <div className="tags-page__summary-card">
                <span>最热标签</span>
                <strong>{tagsOverview.hottestTag?.name ?? "暂无"}</strong>
              </div>
            </div>
          </div>

          <div className="tags-chart">
            <div className="tags-chart__frame">
              <div className="tags-chart__y-axis">
                <span>{maxCount}</span>
                <span>{Math.round((maxCount * 2) / 3)}</span>
                <span>{Math.round(maxCount / 3)}</span>
                <span>0</span>
              </div>
              <div className="tags-chart__bars">
                {chartTags.map((tag) => (
                  <div key={tag.id} className="tags-chart__item">
                    <div
                      className="tags-chart__bar"
                      style={{ height: `${(tag.count / maxCount) * 100}%` }}
                    >
                      <span className="tags-chart__value">{tag.count}</span>
                    </div>
                    <span className="tags-chart__label">{tag.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="tags-cloud">
            {tagsOverview.tags.map((tag, index) => (
              <Link
                key={tag.id}
                href={tag.url}
                className="tags-cloud__tag"
                style={{
                  color: palette[index % palette.length],
                  fontSize: `${0.98 + (tag.count / maxCount) * 0.92}rem`
                }}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
