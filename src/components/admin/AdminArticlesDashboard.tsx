"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  approveDoctorArticleAction, 
  rejectDoctorArticleAction, 
  deleteDoctorArticleAction 
} from "@/app/actions/articles";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  BookOpen, ShieldCheck, Clock, CheckCircle2, XCircle, 
  Search, FileText, User, ExternalLink, Loader2, Trash2, Eye, Download, Stethoscope
} from "lucide-react";

interface AdminArticlesDashboardProps {
  articles: any[];
}

export default function AdminArticlesDashboard({ articles }: AdminArticlesDashboardProps) {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Review & Dialog states
  const [viewingArticle, setViewingArticle] = useState<any | null>(null);
  const [approveConfirmArticle, setApproveConfirmArticle] = useState<any | null>(null);
  const [rejectArticle, setRejectArticle] = useState<any | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Counts
  const pendingCount = articles.filter(a => a.status === "PENDING").length;
  const approvedCount = articles.filter(a => a.status === "APPROVED" || a.status === "PUBLISHED").length;
  const rejectedCount = articles.filter(a => a.status === "REJECTED").length;

  // Filtered list
  const filteredArticles = articles.filter((art) => {
    // Status filter
    if (filterStatus === "PENDING" && art.status !== "PENDING") return false;
    if (filterStatus === "APPROVED" && (art.status !== "APPROVED" && art.status !== "PUBLISHED")) return false;
    if (filterStatus === "REJECTED" && art.status !== "REJECTED") return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const title = (art.title || "").toLowerCase();
      const doctor = (art.doctorName || "").toLowerCase();
      const specialty = (art.specialty || "").toLowerCase();
      const category = (art.category || "").toLowerCase();
      return title.includes(q) || doctor.includes(q) || specialty.includes(q) || category.includes(q);
    }

    return true;
  });

  const handleApprove = async (articleId: string) => {
    setActionLoading(true);
    try {
      const res = await approveDoctorArticleAction(articleId);
      if (res.error) {
        alert(res.error);
      } else {
        setApproveConfirmArticle(null);
        setViewingArticle(null);
        router.refresh();
      }
    } catch (e: any) {
      alert(e.message || "Failed to approve article.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (articleId: string) => {
    if (!rejectionReasonInput.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await rejectDoctorArticleAction(articleId, rejectionReasonInput.trim());
      if (res.error) {
        alert(res.error);
      } else {
        setRejectArticle(null);
        setRejectionReasonInput("");
        setViewingArticle(null);
        router.refresh();
      }
    } catch (e: any) {
      alert(e.message || "Failed to reject article.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm("Are you sure you want to permanently delete this doctor article?")) return;

    setActionLoading(true);
    try {
      const res = await deleteDoctorArticleAction(articleId);
      if (res.error) {
        alert(res.error);
      } else {
        setViewingArticle(null);
        router.refresh();
      }
    } catch (e: any) {
      alert(e.message || "Failed to delete article.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 rounded-3xl bg-white border border-pink-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Submissions</p>
            <p className="text-3xl font-heading font-black text-slate-800">{articles.length}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-pink-50 text-primary flex items-center justify-center">
            <BookOpen className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-5 rounded-3xl bg-white border border-amber-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-amber-600 font-bold">Pending Review</p>
            <p className="text-3xl font-heading font-black text-amber-600">{pendingCount}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-5 rounded-3xl bg-white border border-emerald-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600 font-bold">Approved & Live</p>
            <p className="text-3xl font-heading font-black text-emerald-600">{approvedCount}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-5 rounded-3xl bg-white border border-red-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-red-500 font-bold">Rejected</p>
            <p className="text-3xl font-heading font-black text-red-500">{rejectedCount}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
            <XCircle className="h-6 w-6" />
          </div>
        </Card>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === "ALL"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Articles ({articles.length})
          </button>
          <button
            onClick={() => setFilterStatus("PENDING")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === "PENDING"
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus("APPROVED")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === "APPROVED"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilterStatus("REJECTED")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === "REJECTED"
                ? "bg-red-600 text-white shadow-sm"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            <XCircle className="h-3.5 w-3.5" />
            Rejected ({rejectedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, doctor, specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Main Table */}
      <Card className="rounded-3xl border border-pink-100 shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">No doctor articles match your criteria.</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try switching status filters or clearing your search term.
              </p>
            </div>
          ) : (
            <table className="w-full text-xs text-left text-slate-600 border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase text-slate-400 font-black bg-slate-50/80">
                  <th className="p-4">Article Title &amp; Category</th>
                  <th className="p-4">Doctor / Author</th>
                  <th className="p-4">Specialty</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4">Submitted Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Title */}
                    <td className="p-4 max-w-xs">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800 line-clamp-1">{art.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="bg-pink-50 text-primary border border-pink-100 text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                            {art.category}
                          </span>
                          {art.fileUrl && (
                            <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase flex items-center gap-1">
                              <FileText className="h-3 w-3" /> PDF File
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-slate-800 flex items-center gap-1.5">
                          <Stethoscope className="h-3.5 w-3.5 text-pink-500 shrink-0" />
                          {art.doctorName}
                        </p>
                        <p className="text-[10px] text-slate-400">{art.doctorEmail}</p>
                      </div>
                    </td>

                    {/* Specialty */}
                    <td className="p-4 font-semibold text-slate-700">
                      {art.specialty || "Oncology Specialist"}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 text-center">
                      {art.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="h-3 w-3" /> PENDING
                        </span>
                      )}
                      {(art.status === "APPROVED" || art.status === "PUBLISHED") && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" /> APPROVED
                        </span>
                      )}
                      {art.status === "REJECTED" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="h-3 w-3" /> REJECTED
                        </span>
                      )}
                      {art.status === "DRAFT" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-200">
                          DRAFT
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-slate-500 font-medium whitespace-nowrap">
                      {new Date(art.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* View Button */}
                        <Button
                          onClick={() => setViewingArticle(art)}
                          size="sm"
                          variant="outline"
                          className="h-8 px-2.5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>

                        {/* Approve Button */}
                        {art.status !== "APPROVED" && (
                          <Button
                            onClick={() => setApproveConfirmArticle(art)}
                            size="sm"
                            className="h-8 px-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1 shadow-2xs"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                          </Button>
                        )}

                        {/* Reject Button */}
                        {art.status !== "REJECTED" && (
                          <Button
                            onClick={() => {
                              setRejectArticle(art);
                              setRejectionReasonInput("");
                            }}
                            size="sm"
                            variant="outline"
                            className="h-8 px-2.5 text-xs font-bold border-red-200 text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-1"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </Button>
                        )}

                        {/* Delete Button */}
                        <Button
                          onClick={() => handleDelete(art.id)}
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* ----------------MODAL 1: VIEW ARTICLE DETAILS---------------- */}
      <Dialog open={!!viewingArticle} onOpenChange={() => setViewingArticle(null)}>
        <DialogContent className="max-w-2xl bg-white rounded-3xl p-6 border border-pink-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Review Doctor Article
            </DialogTitle>
          </DialogHeader>

          {viewingArticle && (
            <div className="space-y-4 text-xs">

              {/* Status Header */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase text-slate-400">Current Approval Status</p>
                  <p className="font-bold text-slate-800">{viewingArticle.status}</p>
                </div>
                <div>
                  {viewingArticle.status === "PENDING" && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 uppercase">
                      Pending Review
                    </span>
                  )}
                  {(viewingArticle.status === "APPROVED" || viewingArticle.status === "PUBLISHED") && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 uppercase">
                      Approved
                    </span>
                  )}
                  {viewingArticle.status === "REJECTED" && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 uppercase">
                      Rejected
                    </span>
                  )}
                </div>
              </div>

              {/* Article Meta */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <span className="inline-block px-2.5 py-0.5 rounded bg-pink-50 text-pink-600 text-[10px] font-bold uppercase tracking-wider">
                  {viewingArticle.category}
                </span>
                <h3 className="font-heading text-xl font-extrabold text-slate-900 leading-tight">
                  {viewingArticle.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium text-xs pt-1">
                  <span>Author: <strong>{viewingArticle.doctorName}</strong></span>
                  <span>Specialty: <strong>{viewingArticle.specialty}</strong></span>
                  <span>License: <strong>{viewingArticle.doctorLicense || "N/A"}</strong></span>
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Short Summary / Excerpt</h4>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-700 font-sans leading-relaxed border border-slate-100">
                  {viewingArticle.excerpt}
                </p>
              </div>

              {/* PDF Document File */}
              {viewingArticle.fileUrl ? (
                <div className="p-4 bg-pink-50/50 border border-pink-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-pink-500 text-white">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Attached Resource Document (PDF)</p>
                      <p className="text-[10px] text-slate-500">Available for public download on Care Provider page once approved.</p>
                    </div>
                  </div>
                  <a
                    href={viewingArticle.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button className="bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl px-4 flex items-center gap-1.5 cursor-pointer">
                      <Download className="h-4 w-4" /> Download File
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-slate-500 italic text-[11px]">
                  No external PDF file attached. (Text article format)
                </div>
              )}

              {/* Content */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Full Content</h4>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 font-sans leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {viewingArticle.content}
                </div>
              </div>

              {/* Rejection Reason if any */}
              {viewingArticle.rejectionReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-1">
                  <p className="font-bold text-[10px] uppercase">Rejection Reason</p>
                  <p className="text-xs">{viewingArticle.rejectionReason}</p>
                </div>
              )}

            </div>
          )}

          <DialogFooter className="flex justify-between items-center pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setViewingArticle(null)}
              className="rounded-xl border-slate-200 text-slate-700 font-bold text-xs"
            >
              Close
            </Button>
            {viewingArticle && viewingArticle.status !== "APPROVED" && (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setRejectArticle(viewingArticle);
                    setRejectionReasonInput("");
                  }}
                  variant="outline"
                  className="rounded-xl border-red-200 text-red-600 font-bold text-xs"
                >
                  Reject Article
                </Button>
                <Button
                  onClick={() => handleApprove(viewingArticle.id)}
                  disabled={actionLoading}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve Article"}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------MODAL 2: APPROVE CONFIRMATION---------------- */}
      <Dialog open={!!approveConfirmArticle} onOpenChange={() => setApproveConfirmArticle(null)}>
        <DialogContent className="max-w-md bg-white rounded-3xl p-6 border border-pink-100 shadow-2xl space-y-4">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Approve Doctor Article
            </DialogTitle>
          </DialogHeader>

          {approveConfirmArticle && (
            <div className="space-y-3 text-xs text-slate-600 font-sans">
              <p>
                Are you sure you want to approve <strong>"{approveConfirmArticle.title}"</strong> submitted by <strong>{approveConfirmArticle.doctorName}</strong>?
              </p>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
                <p className="font-bold">Public Availability:</p>
                <p className="text-[11px] mt-0.5">
                  Once approved, this article and its attached document will immediately be published on the Care Provider page under <strong>"Doctor Articles &amp; Resources"</strong>.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setApproveConfirmArticle(null)}
              className="rounded-xl border-slate-200 text-slate-700 font-bold text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleApprove(approveConfirmArticle.id)}
              disabled={actionLoading}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------MODAL 3: REJECT WITH REASON---------------- */}
      <Dialog open={!!rejectArticle} onOpenChange={() => setRejectArticle(null)}>
        <DialogContent className="max-w-md bg-white rounded-3xl p-6 border border-pink-100 shadow-2xl space-y-4">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-slate-800 flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5 text-red-600" /> Reject Doctor Article
            </DialogTitle>
          </DialogHeader>

          {rejectArticle && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Rejecting article <strong>"{rejectArticle.title}"</strong> by <strong>{rejectArticle.doctorName}</strong>.
              </p>

              <div className="space-y-1">
                <label className="font-bold uppercase text-[10px] text-slate-500">Rejection Reason *</label>
                <textarea
                  rows={3}
                  placeholder="Explain why this article is being rejected (e.g. invalid medical citations, incomplete PDF document)..."
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-red-500 resize-none bg-slate-50"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setRejectArticle(null)}
              className="rounded-xl border-slate-200 text-slate-700 font-bold text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleReject(rejectArticle.id)}
              disabled={actionLoading}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
