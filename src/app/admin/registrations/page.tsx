import { auth } from "@/auth";
import { Role } from "@/types/enums";
import { redirect } from "next/navigation";
import { getRegistrationVerificationsAction } from "@/app/actions/registration-verification";
import AdminRegistrationVerifications from "@/components/admin/AdminRegistrationVerifications";
import { ShieldCheck } from "lucide-react";
import { AdminNavTabs } from "@/components/admin/AdminNavTabs";

export const revalidate = 0;

export default async function AdminRegistrationVerificationsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) redirect("/");

  const registrations = await getRegistrationVerificationsAction();

  return (
    <div className="container mx-auto min-h-screen space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2 border-b border-pink-100 pb-6">
        <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary">
          <ShieldCheck className="h-3 w-3" /> Admin Review
        </span>
        <h1 className="font-heading text-3xl font-bold text-slate-800">Account Verifications</h1>
        <p className="text-sm text-muted-foreground">Review submitted identity, professional, and organization proofs before enabling account access.</p>
      </header>
      <AdminNavTabs />
      <AdminRegistrationVerifications registrations={registrations} />
    </div>
  );
}
