"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { MomentItem } from "@/lib/types";
import { getMomentContentTypes } from "@/lib/utils";

export default function MomentWidget({ moments }: { moments: MomentItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (moments.length <= 1) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((value) => (value + 1) % moments.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [moments]);

  if (!moments.length) return null;

  const currentMoment = moments[currentIndex];

  return (
    <div className="moment-widget">
      <Link href="/moment" className="moment-container">
        <div className="widget-icon">
          <i className="ri-send-ins-line" />
        </div>
        <div className="widget-center">
          <div className="moment-content-wrapper">
            <span className="moment-content">{currentMoment.content.text}</span>
            <span className="content-icons">
              {getMomentContentTypes(currentMoment).map((type) => (
                <i
                  key={type}
                  className={
                    type === "image"
                      ? "ri-image-fill"
                      : type === "video"
                        ? "ri-video-fill"
                        : type === "link"
                          ? "ri-link"
                          : "ri-music-2-fill"
                  }
                />
              ))}
            </span>
          </div>
        </div>
        <div className="widget-icon">
          <i className="ri-arrow-right-s-line" />
        </div>
      </Link>
    </div>
  );
}
