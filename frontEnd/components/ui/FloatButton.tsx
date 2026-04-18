"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function FloatButton() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const isArticlePage = pathname.startsWith("/posts/");

  useEffect(() => {
    const theme = document.documentElement.getAttribute("data-theme");
    setIsDark(theme === "dark");

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(currentScrollY > 100);

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableHeight = documentHeight - windowHeight;
      if (scrollableHeight > 0) {
        const progress = Math.round((currentScrollY / scrollableHeight) * 100);
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setReadingProgress(0);
      }
    };

    const handleThemeChange = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      setIsDark(theme === "dark");
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("themechange", handleThemeChange);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("themechange", handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.setAttribute("data-theme", nextDark ? "dark" : "light");
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    window.dispatchEvent(new Event("themechange"));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const toggleReadingMode = () => {
    const newMode = !isReadingMode;
    setIsReadingMode(newMode);
    document.documentElement.setAttribute("data-reading-mode", newMode ? "true" : "false");
  };

  return (
    <>
      <div
        className={`float-button-group ${visible ? "visible" : ""}`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(60px)"
        }}
      >
        <div className="float-button" onClick={toggleTheme} title="切换主题">
          <i className={isDark ? "ri-sun-line" : "ri-moon-line"}></i>
        </div>

        {isArticlePage && (
          <div className="float-button" onClick={toggleReadingMode} title="阅读模式">
            <i className="ri-book-open-line"></i>
          </div>
        )}

        <div
          className="float-button scroll-to-top"
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          title="回到顶部"
        >
          {isHovering ? (
            <i className="ri-arrow-up-line"></i>
          ) : (
            <span className="progress-text">{readingProgress}</span>
          )}
        </div>
      </div>

      {isReadingMode && (
        <div className="reading-exit" onClick={toggleReadingMode} title="退出阅读模式">
          <i className="ri-logout-box-r-line"></i>
        </div>
      )}
    </>
  );
}
