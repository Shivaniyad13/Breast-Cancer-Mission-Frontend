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
      {!isCampaignPage && navbar}
      <main className="flex-1 flex flex-col">{children}</main>
      {!isCampaignPage && footer}
    </>
  );
}
