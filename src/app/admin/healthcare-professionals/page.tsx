import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { getAllHealthcareAdminData } from "@/app/actions/healthcareProfessionals";
import AdminHealthcareDashboard from "@/components/admin/AdminHealthcareDashboard";
import { Stethoscope, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Fresh database reads on every access

export default async function AdminHealthcareProfessionalsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const res = await getAllHealthcareAdminData();
  const adminData = res.success && res.data ? res.data : null;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 border-b border-pink-100 pb-6">
        <div className="space-y-1">
          <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <ShieldCheck className="h-2.5 w-2.5" /> Command Center
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-primary" /> Healthcare Professionals Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage evidence-based clinical guidelines, research articles, CME courses, decision algorithms, resources, research partner requests, and accreditation FAQs.
          </p>
        </div>
      </div>

      {/* Admin tabs navigation */}
      <div className="flex gap-4 border-b border-slate-100 pb-4 text-sm font-semibold overflow-x-auto no-scrollbar whitespace-nowrap">
        <Link href="/admin/analytics" className="text-slate-500 hover:text-primary transition-colors">
          Analytics Overview
        </Link>
        <Link href="/admin/webinars" className="text-slate-500 hover:text-primary transition-colors">
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
        <Link href="/admin/healthcare-professionals" className="text-primary border-b-2 border-primary pb-4 -mb-[18px] transition-colors">
          Healthcare Professionals
        </Link>
      </div>

      {/* Main Admin Controller */}
      <AdminHealthcareDashboard initialData={adminData} />
    </div>
  );
}
