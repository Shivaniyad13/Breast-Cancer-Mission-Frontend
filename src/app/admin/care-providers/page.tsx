import { auth } from "@/auth";
import { Role } from "@/types/enums";
import { redirect } from "next/navigation";
import { getAllCareProvidersAdmin } from "@/app/actions/careProviders";
import AdminCareProvidersDashboard from "@/components/admin/AdminCareProvidersDashboard";
import { Building2, ShieldCheck } from "lucide-react";
import { AdminNavTabs } from "@/components/admin/AdminNavTabs";

export const revalidate = 0; // Fresh database reads on every access

export default async function AdminCareProvidersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const res = await getAllCareProvidersAdmin();
  const items = res.success && res.data ? res.data : [];

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 border-b border-pink-100 pb-6">
        <div className="space-y-1">
          <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <ShieldCheck className="h-2.5 w-2.5" /> Command Center
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" /> Verified Care Providers Directory
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage real hospitals, diagnostic centers, chemotherapy units, screening clinics, and palliative care facilities published on the public care directory.
          </p>
        </div>
      </div>

      {/* Admin tabs navigation */}
      <AdminNavTabs />

      {/* Main Admin Dashboard */}
      <AdminCareProvidersDashboard initialData={items as any} />
    </div>
  );
}
