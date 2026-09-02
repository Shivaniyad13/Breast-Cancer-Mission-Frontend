"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { recordPageViewAction } from "@/app/actions/analytics";

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // Do not track admin routes or API calls
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Avoid duplicate track for same path in short session
    if (lastTrackedPath.current === pathname) {
      return;
    }

    lastTrackedPath.current = pathname;

    // Non-blocking fire and forget pageview logging
    recordPageViewAction(pathname).catch(() => {});
  }, [pathname]);

  return null;
}
