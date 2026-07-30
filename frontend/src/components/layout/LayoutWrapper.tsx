"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function LayoutWrapper({
  children,
  navbar,
  footer,
}: {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  // Safely check if we are on the campaign detail page
  const isCampaignPage = pathname?.startsWith("/campaigns/breast-cancer");

  return (
    <>
      {navbar}
      <main className={`flex-1 flex flex-col ${isCampaignPage ? "pt-0" : "pt-20"}`}>
        {children}
      </main>
      {!isCampaignPage && footer}
    </>
  );
}
