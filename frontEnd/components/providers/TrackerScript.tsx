"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { startHeartbeat, stopHeartbeat, trackPageView } from "@/lib/tracker";

export default function TrackerScript() {
  const pathname = usePathname();

  useEffect(() => {
    startHeartbeat();

    return () => {
      stopHeartbeat();
    };
  }, []);

  useEffect(() => {
    if (!pathname) return;
    void trackPageView(pathname);
  }, [pathname]);

  return null;
}
