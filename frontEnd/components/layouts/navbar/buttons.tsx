"use client";

import { useEffect, useState } from "react";
import SearchModal from "./searchModal";

export default function Buttons({ onToggleDrawer }: { onToggleDrawer: () => void }) {
  const [isDark, setIsDark] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    const theme = document.documentElement.getAttribute("data-theme");
    setIsDark(theme === "dark");
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.setAttribute("data-theme", nextDark ? "dark" : "light");
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <>
      <div className="nav-button">
        <button className="brighten" aria-label={"搜索"} onClick={() => setShowSearchModal(true)}>
          <i className="ri-search-line ri-xl" />
        </button>

        <button className="brighten" onClick={toggleTheme} aria-label={"切换主题"}>
          <i className={`ri-xl ${isDark ? "ri-sun-line" : "ri-moon-line"}`} />
        </button>

        <button className="button-menu brighten" onClick={onToggleDrawer} aria-label={"打开菜单"}>
          <i className="ri-menu-line ri-xl" />
        </button>
      </div>

      <SearchModal open={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </>
  );
}
