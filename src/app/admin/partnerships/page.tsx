import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import PartnershipsAdminClient from "./PartnershipsAdminClient";
import { getPartnershipRequests } from "@/app/actions/partnerships";

export default async function AdminPartnershipsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const res = await getPartnershipRequests();
  const initialRequests = res.success && res.requests ? res.requests : [];

  return <PartnershipsAdminClient initialRequests={initialRequests} />;
}
