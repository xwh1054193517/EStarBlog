import Link from "next/link";
import type { SiteData } from "@/lib/types";

export default function AuthorCard({ siteData }: { siteData: SiteData }) {
  return (
    <div className="card-widget card-info">
      <div className="author-avatar">
        {siteData.basicConfig.authorAvatar && (
          <img src={siteData.basicConfig.authorAvatar} alt="头像" />
        )}
      </div>
      <div className="author-name">{siteData.basicConfig.author}</div>
      <div className="author-desc">{siteData.basicConfig.authorDesc}</div>
      <div className="site-data">
        <Link href="/archive">
          <div className="headline">文章</div>
          <div className="num">{siteData.articleCount}</div>
        </Link>
        <Link href="/categories">
          <div className="headline">分类</div>
          <div className="num">{siteData.categories.length}</div>
        </Link>
        <Link href="/tags">
          <div className="headline">标签</div>
          <div className="num">{siteData.tags.length}</div>
        </Link>
      </div>
      <div className="card-info-icons">
        {siteData.blogConfig.sidebarSocial.map((contact) => (
          <a
            key={contact.name}
            href={contact.url}
            className="icon"
            target="_blank"
            rel="noreferrer"
          >
            <i className={`ri-${contact.icon}`} />
          </a>
        ))}
      </div>
    </div>
  );
}
