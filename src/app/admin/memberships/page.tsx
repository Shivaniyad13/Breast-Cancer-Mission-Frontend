import { auth } from "@/auth";
import { apiClient } from "@/lib/apiClient";
import { Role } from "@/types/enums";
import { redirect } from "next/navigation";
import AdminMembershipDashboard from "@/components/admin/AdminMembershipDashboard";
import { Building2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminMembershipsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  let orgApplications: any[] = [];
  let corpApplications: any[] = [];

  try {
    const [orgRes, corpRes] = await Promise.all([
      apiClient("/organizations"),
      apiClient("/partners"),
    ]);

    if (orgRes.ok) {
      const orgData = await orgRes.json();
      if (orgData.success) orgApplications = orgData.data || [];
    }

    if (corpRes.ok) {
      const corpData = await corpRes.json();
      if (corpData.success) corpApplications = corpData.data || [];
    }
  } catch (error) {
    console.error("Error fetching admin membership applications:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 border-b border-pink-100 pb-6">
        <div className="space-y-1">
          <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <ShieldCheck className="h-2.5 w-2.5" /> Command Center
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" /> Institution Partnerships Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Review NGO, Medical College, Trust, Foundation and Corporate partnership applications. Audit documents, add remarks, and confirm membership credentials.
          </p>
        </div>
      </div>

      {/* Admin tabs navigation */}
      <div className="flex gap-4 border-b border-slate-100 pb-4 text-sm font-semibold overflow-x-auto no-scrollbar whitespace-nowrap">
        <Link href="/admin/webinars" className="text-slate-500 hover:text-primary transition-colors">
          Webinar Management
        </Link>
        <Link href="/admin/memberships" className="text-primary border-b-2 border-primary pb-4 -mb-[18px] transition-colors">
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
        <Link href="/admin/healthcare-professionals" className="text-slate-500 hover:text-primary transition-colors">
          Healthcare Professionals
        </Link>
        <Link href="/admin/care-providers" className="text-slate-500 hover:text-primary transition-colors">
          Care Directory
        </Link>
      </div>

      {/* Main Admin Controller */}
      <AdminMembershipDashboard 
        orgApplications={orgApplications} 
        corpApplications={corpApplications} 
      />
    </div>
  );
}
