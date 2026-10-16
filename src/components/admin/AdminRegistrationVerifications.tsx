"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock3, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { reviewRegistrationVerificationAction } from "@/app/actions/registration-verification";

type RegistrationDocument = {
  id: string;
  documentType: string;
  createdAt: string;
};

type RegistrationRequest = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  profile: {
    phoneNumber: string | null;
    verificationStatus: string;
    rejectionReason: string | null;
    medicalLicenseNumber: string | null;
    hospitalAffiliation: string | null;
    specialty: string | null;
    ngoRegistrationNumber: string | null;
    documents: RegistrationDocument[];
  } | null;
};

const documentLabels: Record<string, string> = {
  AADHAAR_CARD: "Aadhaar Card",
  PAN_CARD: "PAN Card",
  DEGREE_CERTIFICATE: "Degree / Certification",
  ORGANIZATION_PROOF: "Organization Proof",
};

export default function AdminRegistrationVerifications({ registrations }: { registrations: RegistrationRequest[] }) {
  const router = useRouter();
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const review = async (request: RegistrationRequest, status: "VERIFIED" | "REJECTED") => {
    const rejectionReason = status === "REJECTED"
      ? window.prompt("Reason for rejecting this registration:")?.trim()
      : undefined;
    if (status === "REJECTED" && !rejectionReason) return;

    setWorkingId(request.id);
    setError(null);
    try {
      const result = await reviewRegistrationVerificationAction(request.id, status, rejectionReason);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : "Unable to review registration.");
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <section className="space-y-4">
      {error && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      {registrations.length === 0 ? (
        <Card className="rounded-lg p-8 text-center text-sm text-muted-foreground">No registration requests are waiting for review.</Card>
      ) : registrations.map((request) => (
        <Card key={request.id} className="rounded-lg border-border p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-slate-900">{request.name || "Unnamed applicant"}</h2>
                <span className="rounded border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  {request.profile?.verificationStatus || "PENDING"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{request.email} · {request.role.replaceAll("_", " ")}</p>
              <p className="text-xs text-muted-foreground">Submitted {new Date(request.createdAt).toLocaleString()}</p>
              {request.profile?.phoneNumber && <p className="text-sm">Phone: {request.profile.phoneNumber}</p>}
              {request.profile?.medicalLicenseNumber && <p className="text-sm">License: {request.profile.medicalLicenseNumber}</p>}
              {request.profile?.hospitalAffiliation && <p className="text-sm">Affiliation: {request.profile.hospitalAffiliation}</p>}
              {request.profile?.specialty && <p className="text-sm">Specialty: {request.profile.specialty}</p>}
              {request.profile?.ngoRegistrationNumber && <p className="text-sm">NGO registration: {request.profile.ngoRegistrationNumber}</p>}
              {request.profile?.rejectionReason && <p className="text-sm text-destructive">Previous rejection: {request.profile.rejectionReason}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" disabled={workingId === request.id} onClick={() => review(request, "VERIFIED")}>
                <Check className="mr-1 h-4 w-4" /> Approve
              </Button>
              <Button size="sm" variant="outline" disabled={workingId === request.id} onClick={() => review(request, "REJECTED")}>
                <X className="mr-1 h-4 w-4" /> Reject
              </Button>
            </div>
          </div>
          <div className="mt-4 border-t pt-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold"><Clock3 className="h-4 w-4" /> Submitted documents</h3>
            {request.profile?.documents.length ? (
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {request.profile.documents.map((document) => (
                  <li key={document.id}>
                    <a className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline" href={`/api/admin/registration-documents/${encodeURIComponent(document.id)}`} target="_blank" rel="noreferrer">
                      {documentLabels[document.documentType] || document.documentType.replaceAll("_", " ")}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">No document files attached.</p>}
          </div>
        </Card>
      ))}
    </section>
  );
}
