import ArtHeader from "@/components/layouts/header/art-header";
import HomeHeader from "@/components/layouts/header/home-header";
import type { SiteData } from "@/lib/types";

interface HeaderProps {
  siteData: SiteData;
  variant?: "home" | "page" | "none";
  title?: string;
  subtitle?: string;
}

export default function Header({
  siteData,
  variant = "home",
  title,
  subtitle
}: HeaderProps) {
  if (variant === "none") return null;
  if (variant === "page") {
    return <ArtHeader title={title ?? siteData.blogConfig.title} subtitle={subtitle} />;
  }

  return <HomeHeader systemConfig={siteData.blogConfig} />;
}
