"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveDoctorVerificationAction, rejectDoctorVerificationAction } from "@/app/actions/doctor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Stethoscope, ShieldCheck, Clock, CheckCircle2, XCircle, 
  Search, FileText, User, ExternalLink, Loader2, Sparkles
} from "lucide-react";

interface AdminDoctorsDashboardProps {
  doctors: any[];
}

export default function AdminDoctorsDashboard({ doctors }: AdminDoctorsDashboardProps) {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "VERIFIED" | "REJECTED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Review & Dialog states
  const [reviewingDoctor, setReviewingDoctor] = useState<any | null>(null);
  const [isVerifyConfirmOpen, setIsVerifyConfirmOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Counts
  const pendingCount = doctors.filter(d => d.verificationStatus === "PENDING").length;
  const verifiedCount = doctors.filter(d => d.verificationStatus === "VERIFIED").length;
  const rejectedCount = doctors.filter(d => d.verificationStatus === "REJECTED").length;

  // Filtered list
  const filteredDoctors = doctors.filter((doc) => {
    // Status filter
    if (filterStatus === "PENDING" && doc.verificationStatus !== "PENDING") return false;
    if (filterStatus === "VERIFIED" && doc.verificationStatus !== "VERIFIED") return false;
    if (filterStatus === "REJECTED" && doc.verificationStatus !== "REJECTED") return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const name = (doc.name || "").toLowerCase();
      const email = (doc.email || "").toLowerCase();
      const license = (doc.medicalLicenseNumber || "").toLowerCase();
      const specialty = (doc.specialty || "").toLowerCase();
      const hospital = (doc.hospitalAffiliation || "").toLowerCase();
      return name.includes(q) || email.includes(q) || license.includes(q) || specialty.includes(q) || hospital.includes(q);
    }

    return true;
  });

  const handleVerify = async (doctorId: string) => {
    setActionLoading(true);
    try {
      const res = await approveDoctorVerificationAction(doctorId);
      if (res.error) {
        alert(res.error);
      } else {
        setIsVerifyConfirmOpen(false);
        setReviewingDoctor(null);
        router.refresh();
      }
    } catch (e: any) {
      alert(e.message || "Failed to verify doctor.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (doctorId: string) => {
    if (!rejectionReasonInput.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await rejectDoctorVerificationAction(doctorId, rejectionReasonInput.trim());
      if (res.error) {
        alert(res.error);
      } else {
        setIsRejectModalOpen(false);
        setRejectionReasonInput("");
        setReviewingDoctor(null);
        router.refresh();
      }
    } catch (e: any) {
      alert(e.message || "Failed to reject doctor verification.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* FILTER TABS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
        
        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setFilterStatus("ALL")}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              filterStatus === "ALL"
                ? "bg-slate-800 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            All Doctors ({doctors.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus("PENDING")}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterStatus === "PENDING"
                ? "bg-amber-500 text-white shadow-xs ring-2 ring-amber-300"
                : pendingCount > 0
                ? "bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 font-extrabold"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Pending Verification</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${filterStatus === "PENDING" ? "bg-amber-700 text-white" : "bg-amber-200 text-amber-900"}`}>
              {pendingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus("VERIFIED")}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterStatus === "VERIFIED"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Verified ({verifiedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus("REJECTED")}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              filterStatus === "REJECTED"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <XCircle className="h-3.5 w-3.5 text-red-500" />
            <span>Rejected ({rejectedCount})</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, license, hospital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-primary text-slate-800 font-medium"
          />
        </div>
      </div>

      {/* DOCTORS GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length === 0 ? (
          <Card className="col-span-full rounded-3xl border border-pink-100/50 p-12 text-center text-slate-500">
            {filterStatus === "PENDING"
              ? "No doctor accounts currently pending verification."
              : filterStatus === "REJECTED"
              ? "No rejected doctor accounts found."
              : "No doctor records found."}
          </Card>
        ) : (
          filteredDoctors.map((doc) => {
            const isPending = doc.verificationStatus === "PENDING";
            const isVerified = doc.verificationStatus === "VERIFIED";

            return (
              <Card
                key={doc.id}
                className={`rounded-3xl border shadow-xs overflow-hidden bg-white transition-all flex flex-col justify-between ${
                  isPending ? "border-amber-300 ring-2 ring-amber-100" : "border-pink-50 hover:border-pink-200"
                }`}
              >
                <div className="p-5 space-y-4">
                  {/* Top Header & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-primary shrink-0">
                        <Stethoscope className="h-6 w-6 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-heading text-base font-black text-slate-800 line-clamp-1">{doc.name}</h3>
                        <p className="text-[11px] text-slate-500 font-mono">ID: {doc.doctorId}</p>
                      </div>
                    </div>

                    {isVerified ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" /> VERIFIED
                      </span>
                    ) : isPending ? (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1 shrink-0 animate-pulse">
                        <Clock className="h-3 w-3 text-amber-500" /> PENDING
                      </span>
                    ) : (
                      <span className="bg-red-50 text-red-700 border border-red-200 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1 shrink-0">
                        <XCircle className="h-3 w-3 text-red-500" /> REJECTED
                      </span>
                    )}
                  </div>

                  {/* Metadata fields */}
                  <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500">License No:</span>
                      <span className="font-mono font-bold text-slate-800">{doc.medicalLicenseNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500">Specialty:</span>
                      <span className="font-semibold text-slate-800">{doc.specialty}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500">Hospital:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">{doc.hospitalAffiliation}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-500">Email:</span>
                      <span className="text-slate-700 truncate max-w-[170px]">{doc.email}</span>
                    </div>
                  </div>

                  {/* Rejection reason box if rejected */}
                  {doc.verificationStatus === "REJECTED" && doc.rejectionReason && (
                    <div className="p-2.5 bg-red-50 border border-red-100 rounded-xl text-[11px] text-red-700 space-y-0.5">
                      <span className="font-bold uppercase text-[9px] text-red-500 block">Rejection Feedback:</span>
                      <p className="line-clamp-2">{doc.rejectionReason}</p>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
                  <Button
                    onClick={() => setReviewingDoctor(doc)}
                    size="sm"
                    className={`w-full rounded-xl text-xs font-bold py-2 cursor-pointer flex items-center justify-center gap-1 ${
                      isPending
                        ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                        : "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {isPending ? "Review Credentials" : "View Full Details"}
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* ----------------MODAL 1: ADMIN DOCTOR REVIEW MODAL---------------- */}
      <Dialog open={!!reviewingDoctor} onOpenChange={() => { setReviewingDoctor(null); setIsVerifyConfirmOpen(false); setIsRejectModalOpen(false); }}>
        <DialogContent className="w-[95vw] sm:w-full max-w-xl max-h-[92vh] bg-white rounded-3xl p-6 border border-purple-100 shadow-2xl flex flex-col gap-0 overflow-hidden">
          <DialogHeader className="pb-3 border-b border-purple-50 shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <DialogTitle className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary shrink-0" /> Doctor Credentials Inspection
              </DialogTitle>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                reviewingDoctor?.verificationStatus === "VERIFIED"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : reviewingDoctor?.verificationStatus === "PENDING"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}>
                {reviewingDoctor?.verificationStatus}
              </span>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs sm:text-sm custom-scrollbar pr-1">
            
            {/* DOCTOR PERSONAL & PROFESSIONAL DETAILS */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" /> Doctor Identity &amp; Info
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div><strong className="text-slate-700">Full Name:</strong> Dr. {reviewingDoctor?.name}</div>
                <div><strong className="text-slate-700">Doctor ID:</strong> <span className="font-mono">{reviewingDoctor?.doctorId}</span></div>
                <div><strong className="text-slate-700">Email Address:</strong> {reviewingDoctor?.email}</div>
                <div><strong className="text-slate-700">Registration Date:</strong> {reviewingDoctor?.createdAt ? new Date(reviewingDoctor.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}</div>
              </div>
            </div>

            {/* MEDICAL CREDENTIALS */}
            <div className="p-4 bg-pink-50/40 rounded-2xl border border-pink-100 space-y-3">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Professional Medical License
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div><strong className="text-slate-700">License / Reg Number:</strong> <span className="font-mono font-bold text-slate-800">{reviewingDoctor?.medicalLicenseNumber}</span></div>
                <div><strong className="text-slate-700">Specialty:</strong> {reviewingDoctor?.specialty}</div>
                <div className="sm:col-span-2"><strong className="text-slate-700">Hospital / Clinic Affiliation:</strong> {reviewingDoctor?.hospitalAffiliation}</div>
              </div>
            </div>

            {/* VERIFICATION DOCUMENT ATTACHMENT */}
            <div className="p-4 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-2">
              <h4 className="font-black text-xs uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-purple-600" /> Supporting Verification Document
              </h4>
              {reviewingDoctor?.verificationDocument ? (
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-purple-100 text-xs">
                  <span className="font-medium text-slate-700 truncate max-w-[280px]">
                    {reviewingDoctor.verificationDocument}
                  </span>
                  <a
                    href={reviewingDoctor.verificationDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-bold flex items-center gap-1 shrink-0 ml-2"
                  >
                    View Document <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic bg-white p-2.5 rounded-xl border border-purple-100">
                  No verification document attachment uploaded. Credentials can be verified via state medical registry records.
                </p>
              )}
            </div>

            {/* REJECTION HISTORY */}
            {reviewingDoctor?.rejectionReason && (
              <div className="p-3.5 bg-red-50 border border-red-100 rounded-2xl space-y-1 text-xs text-red-800">
                <p className="font-bold uppercase text-[10px] text-red-600">Previous Rejection Reason On File:</p>
                <p className="font-medium">{reviewingDoctor.rejectionReason}</p>
              </div>
            )}

          </div>

          <DialogFooter className="pt-3 border-t border-slate-100 shrink-0 flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-2">
            <Button variant="outline" onClick={() => setReviewingDoctor(null)} className="w-full sm:w-auto text-xs font-bold rounded-xl">
              Close
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                type="button"
                onClick={() => setIsRejectModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl px-4 py-2 flex items-center gap-1 justify-center cursor-pointer"
              >
                <XCircle className="h-4 w-4" /> Reject Verification
              </Button>
              <Button
                type="button"
                onClick={() => setIsVerifyConfirmOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl px-5 py-2 flex items-center gap-1 justify-center cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" /> Verify Doctor
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------MODAL 2: VERIFY CONFIRMATION DIALOG---------------- */}
      <Dialog open={isVerifyConfirmOpen} onOpenChange={setIsVerifyConfirmOpen}>
        <DialogContent className="max-w-md bg-white rounded-3xl p-6 border border-emerald-100 shadow-2xl space-y-4">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" /> Verify Doctor Credentials?
            </DialogTitle>
          </DialogHeader>

          <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-emerald-900 leading-relaxed space-y-2">
            <p className="font-bold text-sm">Are you sure you want to verify this doctor?</p>
            <p className="text-slate-600">Once verified, Dr. <strong>{reviewingDoctor?.name}</strong> will be granted full access to create, edit, and publish webinars for the platform.</p>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsVerifyConfirmOpen(false)} disabled={actionLoading} className="text-xs font-bold rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={() => handleVerify(reviewingDoctor.id)}
              disabled={actionLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl px-5 shadow-xs cursor-pointer"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yes, Verify Doctor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------MODAL 3: REJECT REASON DIALOG---------------- */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="max-w-md bg-white rounded-3xl p-6 border border-red-100 shadow-2xl space-y-4">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-600 shrink-0" /> Reject Doctor Verification
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Please state the reason for rejecting Dr. <strong>{reviewingDoctor?.name}</strong>'s verification request. The doctor will see this feedback in their dashboard to correct their details before resubmitting.
            </p>

            <div className="space-y-1">
              <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">
                Reason for rejection *
              </label>
              <textarea
                rows={4}
                placeholder="Explain what medical license or affiliation credential needs to be corrected..."
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                className="w-full p-3 border border-red-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-red-500 resize-none font-medium text-slate-800"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)} disabled={actionLoading} className="text-xs font-bold rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={() => handleReject(reviewingDoctor.id)}
              disabled={actionLoading || !rejectionReasonInput.trim()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl px-5 disabled:opacity-50 shadow-xs cursor-pointer"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
