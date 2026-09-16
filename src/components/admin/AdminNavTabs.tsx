"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminTabs = [
  { label: "Analytics Overview", href: "/admin/analytics" },
  { label: "Volunteer Applications", href: "/admin/volunteers" },
  { label: "Webinar Management", href: "/admin/webinars" },
  { label: "Donation Management", href: "/admin/donations" },
  { label: "Institution Memberships", href: "/admin/memberships" },
  { label: "Individual Members", href: "/admin/individual-members" },
  { label: "Partnerships", href: "/admin/partnerships" },
  { label: "Care Providers", href: "/admin/care-providers" },
  { label: "Patient Success Stories", href: "/admin/success-stories" },
  { label: "Community Feedback", href: "/admin/feedback" },
  { label: "Event Gallery", href: "/admin/gallery" },
  { label: "Video Stories", href: "/admin/video-stories" },
  { label: "Homepage Widgets", href: "/admin/homepage-widgets" },
  { label: "Live Updates", href: "/admin/live-updates" },
  { label: "Diagnosis & Collaboration", href: "/admin/diagnosis" },
  { label: "Healthcare Professionals", href: "/admin/healthcare-professionals" },
  { label: "Articles", href: "/admin/articles" },


];

export function AdminNavTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-4 border-b border-slate-100 pb-4 text-sm font-semibold overflow-x-auto no-scrollbar whitespace-nowrap">
      {adminTabs.map((tab) => {
        const isActive =
          pathname === tab.href || (tab.href === "/admin/analytics" && pathname === "/admin");

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              isActive
                ? "text-primary border-b-2 border-primary pb-4 -mb-[18px] transition-colors"
                : "text-slate-500 hover:text-primary transition-colors"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
