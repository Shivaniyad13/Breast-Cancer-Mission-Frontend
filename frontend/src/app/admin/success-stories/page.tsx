import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { getAdminSuccessStories } from "@/app/actions/successStories";
import AdminSuccessStoriesDashboard from "@/components/admin/AdminSuccessStoriesDashboard";
import { Heart, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Fresh database reads on every admin access

export default async function AdminSuccessStoriesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  // Fetch all success stories from database
  const result = await getAdminSuccessStories();
  const stories = result.success && result.stories ? result.stories : [];

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 border-b border-pink-100 pb-6">
        <div className="space-y-1">
          <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <ShieldCheck className="h-2.5 w-2.5" /> Command Center
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary fill-primary" /> Success Story Moderation
          </h1>
          <p className="text-muted-foreground text-sm">
            Verify submitted patient and family member journeys, edit details, approve for Home Page feature, or reject/delete.
          </p>
        </div>
      </div>

      {/* Admin tabs navigation */}
      <div className="flex gap-4 border-b border-slate-100 pb-4 text-sm font-semibold overflow-x-auto no-scrollbar whitespace-nowrap">
        <Link href="/admin/webinars" className="text-slate-500 hover:text-primary transition-colors">
          Webinar Management
        </Link>
        <Link href="/admin/memberships" className="text-slate-500 hover:text-primary transition-colors">
          Institution Memberships
        </Link>
        <Link href="/admin/success-stories" className="text-primary border-b-2 border-primary pb-4 -mb-[18px] transition-colors">
          Patient Success Stories
        </Link>
        <Link href="/admin/homepage-widgets" className="text-slate-500 hover:text-primary transition-colors">
          Homepage Widgets
        </Link>
        <Link href="/admin/live-updates" className="text-slate-500 hover:text-primary transition-colors">
          Home Page Live Updates
        </Link>
        <Link href="/admin/diagnosis" className="text-slate-500 hover:text-primary transition-colors">
          Diagnosis & Collaboration
        </Link>
      </div>

      {/* Main Admin Dashboard */}
      <AdminSuccessStoriesDashboard stories={stories as any} />
    </div>
  );
}
