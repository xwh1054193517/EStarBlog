import { useEffect, useState } from "react";
import Logo from "@/components/layouts/navbar/logo";
import Menu from "@/components/layouts/navbar/menu";
import type { SiteData } from "@/lib/types";
import Buttons from "./buttons";
import MobileDrawer from "./mobileDrawer";

export default function Navbar({
  siteData,
  showHeader
}: {
  siteData: SiteData;
  showHeader: boolean;
}) {
  const [isFixed, setIsFixed] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const windowY = window.scrollY;
      setIsFixed(windowY > 0);
      setIsScrollingDown(windowY > lastScrollY);
      lastScrollY = windowY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        id="navbar"
        className={`${isFixed ? "fixed" : ""} ${!showHeader ? "no-header" : ""}`.trim()}
      >
        <div className="nav-left">
          <Logo subtitle={siteData.blogConfig.subtitle} />
        </div>
        <Menu
          menus={siteData.navigationMenus}
          blogTitle={siteData.blogConfig.title}
          isScrollingDown={isScrollingDown}
          isFixed={isFixed}
        />
        <Buttons onToggleDrawer={() => setShowDrawer((value) => !value)}></Buttons>
      </nav>
      <MobileDrawer open={showDrawer} onClose={() => setShowDrawer(false)} siteData={siteData} />
    </>
  );
}
