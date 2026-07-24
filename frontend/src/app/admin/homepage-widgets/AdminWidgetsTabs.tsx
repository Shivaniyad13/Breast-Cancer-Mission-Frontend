"use client";

import { useState } from "react";
import AdminSponsorsDashboard from "@/components/admin/AdminSponsorsDashboard";
import AdminCelebrityDashboard from "@/components/admin/AdminCelebrityDashboard";

interface AdminWidgetsTabsProps {
  banners: any[];
  testimonials: any[];
}

export default function AdminWidgetsTabs({ banners, testimonials }: AdminWidgetsTabsProps) {
  const [tab, setTab] = useState<"SPONSORS" | "CELEBRITIES">("SPONSORS");

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-slate-100 pb-2">
        <button
          onClick={() => setTab("SPONSORS")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            tab === "SPONSORS"
              ? "bg-pink-650 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Sponsor Spotlight Banners
        </button>
        <button
          onClick={() => setTab("CELEBRITIES")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            tab === "CELEBRITIES"
              ? "bg-pink-650 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Celebrity Testimonial Videos
        </button>
      </div>

      {tab === "SPONSORS" ? (
        <AdminSponsorsDashboard initialBanners={banners} />
      ) : (
        <AdminCelebrityDashboard initialTestimonials={testimonials} />
      )}
    </div>
  );
}
