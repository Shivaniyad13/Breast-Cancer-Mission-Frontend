import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { getHomePageUpdates } from "@/app/actions/homePageUpdates";
import AdminHomePageUpdatesDashboard from "@/components/admin/AdminHomePageUpdatesDashboard";
import { Megaphone, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Fresh database reads on every admin access

export default async function AdminHomePageUpdatesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  // Fetch all updates from database
  const result = await getHomePageUpdates(false);
  const updates = result.success && result.updates ? result.updates : [];

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 border-b border-pink-100 pb-6">
        <div className="space-y-1">
          <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <ShieldCheck className="h-2.5 w-2.5" /> Command Center
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <Megaphone className="h-8 w-8 text-primary" /> Home Page Updates Hub
          </h1>
          <p className="text-muted-foreground text-sm">
            Control the dynamically sliding updates card loop in the right panel of the Hero Section. Add, edit, reorder, or toggle widgets.
          </p>
        </div>
      </div>

      {/* Admin tabs navigation */}
      <div className="flex gap-4 border-b border-slate-100 pb-4 text-sm font-semibold">
        <Link href="/admin/webinars" className="text-slate-500 hover:text-primary transition-colors">
          Webinar Management
        </Link>
        <Link href="/admin/memberships" className="text-slate-500 hover:text-primary transition-colors">
          Institution Memberships
        </Link>
        <Link href="/admin/success-stories" className="text-slate-500 hover:text-primary transition-colors">
          Patient Success Stories
        </Link>
        <Link href="/admin/homepage-updates" className="text-primary border-b-2 border-primary pb-4 -mb-[18px] transition-colors">
          Home Page Updates
        </Link>
      </div>

      {/* Main Admin Controller */}
      <AdminHomePageUpdatesDashboard initialUpdates={updates as any} />
    </div>
  );
}
