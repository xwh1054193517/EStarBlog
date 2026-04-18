import ArtHeader from "@/components/layouts/header/art-header";
import HomeHeader from "@/components/layouts/header/home-header";
import PostHeader from "@/components/layouts/header/post-header";
import type { SiteData } from "@/lib/types";
import type { Article } from "@/lib/types";

interface HeaderProps {
  siteData: SiteData;
  variant?: "home" | "page" | "post" | "none";
  title?: string;
  subtitle?: string;
  article?: Article;
}

export default function Header({
  siteData,
  variant = "home",
  title,
  subtitle,
  article
}: HeaderProps) {
  if (variant === "none" || variant === "page") return null;

  if (variant === "post" && article) {
    return <PostHeader article={article} />;
  }

  return <HomeHeader systemConfig={siteData.blogConfig} />;
}
