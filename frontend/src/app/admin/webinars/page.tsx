import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import AdminWebinarDashboard from "@/components/admin/AdminWebinarDashboard";
import { Video, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Fresh database reads on every admin access

export default async function AdminWebinarsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  // Fetch all webinars with full registrations, attendance log and certificates relations
  const webinars = await db.webinar.findMany({
    orderBy: { date: "desc" },
    include: {
      registrations: {
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true }
          }
        }
      },
      attendance: {
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      },
      certificates: true
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 border-b border-pink-100 pb-6">
        <div className="space-y-1">
          <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <ShieldCheck className="h-2.5 w-2.5" /> Command Center
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <Video className="h-8 w-8 text-primary" /> Webinar Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Schedule events, audit registrations list, download CSV logs, upload materials, and publish live meeting coordinates.
          </p>
        </div>
      </div>

      {/* Admin tabs navigation */}
      <div className="flex gap-4 border-b border-slate-100 pb-4 text-sm font-semibold overflow-x-auto no-scrollbar whitespace-nowrap">
        <Link href="/admin/webinars" className="text-primary border-b-2 border-primary pb-4 -mb-[18px] transition-colors">
          Webinar Management
        </Link>
        <Link href="/admin/memberships" className="text-slate-500 hover:text-primary transition-colors">
          Institution Memberships
        </Link>
        <Link href="/admin/success-stories" className="text-slate-500 hover:text-primary transition-colors">
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

      {/* Main Admin Controller */}
      <AdminWebinarDashboard webinars={webinars} />
    </div>
  );
}
