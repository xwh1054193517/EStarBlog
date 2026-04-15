import Navigation from "@/components/layouts/footer/navigation";
import type { SiteData } from "@/lib/types";

export default function Footer({ siteData }: { siteData: SiteData }) {
  return (
    <footer id="footer">
      <Navigation footerMenus={siteData.footerMenus} friends={siteData.friends} />
    </footer>
  );
}
