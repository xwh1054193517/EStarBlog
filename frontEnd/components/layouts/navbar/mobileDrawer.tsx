"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { MenuItem, SiteData } from "@/lib/types";

export default function MobileDrawer({
  open,
  onClose,
  siteData
}: {
  open: boolean;
  onClose: () => void;
  siteData: SiteData;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedMenus, setExpandedMenus] = useState<number[]>([]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggleSubmenu = (menuId: number) => {
    setExpandedMenus((current) =>
      current.includes(menuId) ? current.filter((id) => id !== menuId) : [...current, menuId]
    );
  };

  return (
    <div className={`drawer-overlay${open ? " open" : ""}`} onClick={onClose}>
      <div className="drawer-container" onClick={(event) => event.stopPropagation()}>
        <div className="avatar-img">
          <img
            src={siteData.basicConfig.authorAvatar || "/avatar.webp"}
            alt="avatar"
            loading="lazy"
          />
        </div>

        <div className="site-data">
          <Link href="/archive" onClick={onClose}>
            <div className="headline">文章</div>
            <div className="length-num">{siteData.articleCount}</div>
          </Link>
          <Link href="/tags" onClick={onClose}>
            <div className="headline">标签</div>
            <div className="length-num">{siteData.tags.length}</div>
          </Link>
          <Link href="/categories" onClick={onClose}>
            <div className="headline">分类</div>
            <div className="length-num">{siteData.categories.length}</div>
          </Link>
        </div>

        <div className="sidebar-menu">
          <div className="slide-wrapper">
            <div className="slide-box" style={{ transform: `translateX(-${currentSlide * 50}%)` }}>
              <div className="menus-wrapper">
                {siteData.navigationMenus.map((menu: MenuItem) =>
                  menu.children?.length ? (
                    <div key={menu.id}>
                      <div className="nav-item parent-item" onClick={() => toggleSubmenu(menu.id)}>
                        {menu.icon ? <i className={menu.icon} /> : null}
                        <span>{menu.title}</span>
                        <i
                          className={`ri-arrow-right-s-line${expandedMenus.includes(menu.id) ? " rotate" : ""}`}
                        />
                      </div>
                      <div
                        className={`submenu${expandedMenus.includes(menu.id) ? " submenu-open" : ""}`}
                      >
                        {menu.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.url}
                            className="nav-item"
                            onClick={onClose}
                          >
                            <span>{child.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link key={menu.id} href={menu.url} className="nav-item" onClick={onClose}>
                      {menu.icon ? <i className={menu.icon} /> : null}
                      <span>{menu.title}</span>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
