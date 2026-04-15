"use client";

import { BlogConfig } from "@/lib/types";
import { useEffect, useState } from "react";

export default function HomeHeader({ systemConfig }: { systemConfig: BlogConfig }) {
  const [showText, setShowText] = useState("");

  useEffect(() => {
    const text = systemConfig.typingTexts;

    let textIdx = 0;
    let curAt = 0;
    let isDeleting = false;
    let timer: any = null;

    const animateAction = () => {
      const curText = text[textIdx];
      if (!curText) return;

      if (!isDeleting) {
        if (curAt < curText.length) {
          setShowText(curText.slice(0, curAt + 1));
          curAt += 1;
          timer = window.setTimeout(animateAction, 150);
        } else {
          isDeleting = true;
          timer = window.setTimeout(animateAction, 2500);
        }
      } else if (curAt > 0) {
        setShowText(curText.slice(0, curAt - 1));
        curAt -= 1;
        timer = window.setTimeout(animateAction, 150);
      } else {
        isDeleting = false;
        // 循环
        textIdx = (textIdx + 1) % text.length;
        timer = window.setTimeout(animateAction, 150);
      }
    };
    timer = window.setTimeout(animateAction, 500);
    return () => window.clearTimeout(timer);
  }, [systemConfig]);

  return (
    <header className="home-header">
      <div className="site-info">
        <h1>{systemConfig.title}</h1>
        <div className="site-subtitle">
          <span id="subtitle">{showText}</span>
          <span className="cursor">|</span>
        </div>
      </div>
      <div
        className="scroll-indicator"
        onClick={() => window.scrollTo({ top: window.innerHeight - 64, behavior: "smooth" })}
      >
        <i className="ri-arrow-down-s-line ri-2x" />
      </div>
    </header>
  );
}
