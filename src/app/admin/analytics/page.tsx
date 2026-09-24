import { auth } from "@/auth";
import { Role } from "@/types/enums";
import { redirect } from "next/navigation";
import { getAnalyticsOverviewAction } from "@/app/actions/analytics";
import AdminAnalyticsDashboard from "@/components/admin/AdminAnalyticsDashboard";
import { BarChart3, ShieldCheck } from "lucide-react";
import { AdminNavTabs } from "@/components/admin/AdminNavTabs";

export const revalidate = 0; // Fresh database reads on every admin access

export default async function AdminAnalyticsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const analyticsData = await getAnalyticsOverviewAction();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 border-b border-pink-100 pb-6">
        <div className="space-y-1">
          <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <ShieldCheck className="h-2.5 w-2.5" /> Command Center
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" /> Analytics Overview
          </h1>
          <p className="text-muted-foreground text-sm">
            Operational dashboard tracking website visits, user registrations, webinar reach, content views, and fundraising impact.
          </p>
        </div>
      </div>

      {/* Admin tabs navigation */}
      <AdminNavTabs />

      {/* Main Analytics Dashboard */}
      <AdminAnalyticsDashboard data={analyticsData} />
    </div>
  );
}
