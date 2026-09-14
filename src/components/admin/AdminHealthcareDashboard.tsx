"use client";

import { useState } from "react";
import {
  BookOpen,
  FileText,
  Users2,
  Check,
  X,
  Eye,
  Download,
  Loader2,
  Building2,
  Stethoscope,
  ExternalLink,
} from "lucide-react";
import {
  approveResearchArticle,
  rejectResearchArticle,
  approveResource,
  rejectResource,
  approveResearchPartnerRequest,
  rejectResearchPartnerRequest,
  approveVolunteerDoctorRequest,
  rejectVolunteerDoctorRequest,
} from "@/app/actions/healthcareProfessionals";

interface AdminDashboardProps {
  initialData?: {
    articles?: any[];
    resources?: any[];
    partnerRequests?: any[];
    volunteerRequests?: any[];
  } | null;
}

export default function AdminHealthcareDashboard({ initialData }: AdminDashboardProps) {
  const articles = initialData?.articles || [];
  const resources = initialData?.resources || [];
  const partnerRequests = initialData?.partnerRequests || [];
  const volunteerRequests = initialData?.volunteerRequests || [];

  // Active Tab: 0 = Article Submissions, 1 = Resource Submissions, 2 = Partner & Volunteer Requests
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);

  // Modal State
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Action Pending State
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Calculate pending counts
  const pendingArticles = articles.filter((a) => a.status === "PENDING").length;
  const pendingResources = resources.filter((r) => r.status === "PENDING").length;
  const pendingPartners = partnerRequests.filter((p) => p.status === "PENDING").length;
  const pendingVolunteers = volunteerRequests.filter((v) => v.status === "PENDING").length;
  const pendingRequestsTab3 = pendingPartners + pendingVolunteers;

  // Sorting: Pending items at top
  const sortedArticles = [...articles].sort((a, b) => (a.status === "PENDING" ? -1 : 1));
  const sortedResources = [...resources].sort((a, b) => (a.status === "PENDING" ? -1 : 1));
  const sortedPartners = [...partnerRequests].sort((a, b) => (a.status === "PENDING" ? -1 : 1));
  const sortedVolunteers = [...volunteerRequests].sort((a, b) => (a.status === "PENDING" ? -1 : 1));

  // Helper for status badge styling
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold inline-flex items-center gap-1">
            <Check className="w-3 h-3" /> APPROVED
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold inline-flex items-center gap-1">
            <X className="w-3 h-3" /> REJECTED
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> PENDING
          </span>
        );
    }
  };

  // Generic Approve Handler
  const handleApprove = async (id: string, type: "article" | "resource" | "partner" | "volunteer") => {
    setLoadingId(id);
    setToastMessage(null);
    let res: any;

    if (type === "article") res = await approveResearchArticle(id);
    else if (type === "resource") res = await approveResource(id);
    else if (type === "partner") res = await approveResearchPartnerRequest(id);
    else if (type === "volunteer") res = await approveVolunteerDoctorRequest(id);

    setLoadingId(null);
    if (res?.success) {
      setToastMessage({ type: "success", text: "Item approved and published successfully!" });
      setTimeout(() => window.location.reload(), 800);
    } else {
      setToastMessage({ type: "error", text: res?.error || "Approval failed." });
    }
  };

  // Generic Reject Handler
  const handleReject = async (id: string, type: "article" | "resource" | "partner" | "volunteer") => {
    setLoadingId(id);
    setToastMessage(null);
    let res: any;

    if (type === "article") res = await rejectResearchArticle(id);
    else if (type === "resource") res = await rejectResource(id);
    else if (type === "partner") res = await rejectResearchPartnerRequest(id);
    else if (type === "volunteer") res = await rejectVolunteerDoctorRequest(id);

    setLoadingId(null);
    if (res?.success) {
      setToastMessage({ type: "success", text: "Item rejected successfully." });
      setTimeout(() => window.location.reload(), 800);
    } else {
      setToastMessage({ type: "error", text: res?.error || "Rejection failed." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between border ${
            toastMessage.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-rose-50 text-rose-900 border-rose-200"
          }`}
        >
          <span>{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3 Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab(0)}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 0
              ? "bg-pink-600 text-white shadow-md shadow-pink-200"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Article Submissions</span>
          {pendingArticles > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-xs font-extrabold">
              {pendingArticles}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab(1)}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 1
              ? "bg-pink-600 text-white shadow-md shadow-pink-200"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resource Submissions</span>
          {pendingResources > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-xs font-extrabold">
              {pendingResources}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab(2)}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 2
              ? "bg-pink-600 text-white shadow-md shadow-pink-200"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Partner & Volunteer Requests</span>
          {pendingRequestsTab3 > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-xs font-extrabold">
              {pendingRequestsTab3}
            </span>
          )}
        </button>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 1: ARTICLE SUBMISSIONS */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-pink-600" />
              Article Submissions ({sortedArticles.length})
            </h2>
          </div>

          {sortedArticles.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No research articles submitted yet.</p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4">Institution</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">{art.title}</td>
                        <td className="py-3 px-4">{art.authors}</td>
                        <td className="py-3 px-4 text-slate-500">{art.institution || "N/A"}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
                            {art.category || "General"}
                          </span>
                        </td>
                        <td className="py-3 px-4">{renderStatusBadge(art.status)}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedItem({ type: "Article", data: art })}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>

                            {art.status === "PENDING" && (
                              <>
                                <button
                                  disabled={loadingId === art.id}
                                  onClick={() => handleApprove(art.id, "article")}
                                  className="p-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                >
                                  {loadingId === art.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <>
                                      <Check className="w-3.5 h-3.5" /> Approve
                                    </>
                                  )}
                                </button>
                                <button
                                  disabled={loadingId === art.id}
                                  onClick={() => handleReject(art.id, "article")}
                                  className="p-1.5 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                >
                                  <X className="w-3.5 h-3.5" /> Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="block md:hidden space-y-4">
                {sortedArticles.map((art) => (
                  <div key={art.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{art.title}</h3>
                      {renderStatusBadge(art.status)}
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p>
                        <strong className="text-slate-800">Author:</strong> {art.authors}
                      </p>
                      <p>
                        <strong className="text-slate-800">Institution:</strong> {art.institution || "N/A"}
                      </p>
                      <p>
                        <strong className="text-slate-800">Category:</strong> {art.category || "General"}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedItem({ type: "Article", data: art })}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      {art.status === "PENDING" && (
                        <>
                          <button
                            disabled={loadingId === art.id}
                            onClick={() => handleApprove(art.id, "article")}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            disabled={loadingId === art.id}
                            onClick={() => handleReject(art.id, "article")}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 2: RESOURCE SUBMISSIONS */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-pink-600" />
              Resource Submissions ({sortedResources.length})
            </h2>
          </div>

          {sortedResources.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No clinical resources submitted yet.</p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedResources.map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">{res.title}</td>
                        <td className="py-3 px-4">{res.author || "N/A"}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-xs">
                            {res.category || "General Resource"}
                          </span>
                        </td>
                        <td className="py-3 px-4">{renderStatusBadge(res.status)}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedItem({ type: "Resource", data: res })}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>

                            {res.status === "PENDING" && (
                              <>
                                <button
                                  disabled={loadingId === res.id}
                                  onClick={() => handleApprove(res.id, "resource")}
                                  className="p-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                >
                                  {loadingId === res.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <>
                                      <Check className="w-3.5 h-3.5" /> Approve
                                    </>
                                  )}
                                </button>
                                <button
                                  disabled={loadingId === res.id}
                                  onClick={() => handleReject(res.id, "resource")}
                                  className="p-1.5 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                >
                                  <X className="w-3.5 h-3.5" /> Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="block md:hidden space-y-4">
                {sortedResources.map((res) => (
                  <div key={res.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{res.title}</h3>
                      {renderStatusBadge(res.status)}
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p>
                        <strong className="text-slate-800">Author:</strong> {res.author || "N/A"}
                      </p>
                      <p>
                        <strong className="text-slate-800">Category:</strong> {res.category || "General Resource"}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedItem({ type: "Resource", data: res })}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      {res.status === "PENDING" && (
                        <>
                          <button
                            disabled={loadingId === res.id}
                            onClick={() => handleApprove(res.id, "resource")}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            disabled={loadingId === res.id}
                            onClick={() => handleReject(res.id, "resource")}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* TAB 3: PARTNER & VOLUNTEER REQUESTS */}
      {/* ---------------------------------------------------------------------- */}
      {activeTab === 2 && (
        <div className="space-y-8">
          {/* Section 1: Research Partner Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-pink-600" />
              Research Partner Requests ({sortedPartners.length})
            </h2>

            {sortedPartners.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No research partner requests received.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Applicant</th>
                      <th className="py-3 px-4">Institution</th>
                      <th className="py-3 px-4">Research Area</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedPartners.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">{p.applicantName}</td>
                        <td className="py-3 px-4">{p.institution}</td>
                        <td className="py-3 px-4 text-slate-600">{p.researchArea}</td>
                        <td className="py-3 px-4">{renderStatusBadge(p.status)}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedItem({ type: "Partner Request", data: p })}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>

                            {p.status === "PENDING" && (
                              <>
                                <button
                                  disabled={loadingId === p.id}
                                  onClick={() => handleApprove(p.id, "partner")}
                                  className="p-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                >
                                  <Check className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button
                                  disabled={loadingId === p.id}
                                  onClick={() => handleReject(p.id, "partner")}
                                  className="p-1.5 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                >
                                  <X className="w-3.5 h-3.5" /> Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 2: Volunteer Doctor Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-purple-600" />
              Volunteer Doctor Requests ({sortedVolunteers.length})
            </h2>

            {sortedVolunteers.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No volunteer doctor requests received.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Doctor Name</th>
                      <th className="py-3 px-4">Specialty</th>
                      <th className="py-3 px-4">Hospital</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedVolunteers.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">{v.name}</td>
                        <td className="py-3 px-4 text-slate-700">{v.specialty}</td>
                        <td className="py-3 px-4 text-slate-500">{v.hospital || "N/A"}</td>
                        <td className="py-3 px-4">{renderStatusBadge(v.status)}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedItem({ type: "Volunteer Request", data: v })}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>

                            {v.status === "PENDING" && (
                              <>
                                <button
                                  disabled={loadingId === v.id}
                                  onClick={() => handleApprove(v.id, "volunteer")}
                                  className="p-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                >
                                  <Check className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button
                                  disabled={loadingId === v.id}
                                  onClick={() => handleReject(v.id, "volunteer")}
                                  className="p-1.5 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                >
                                  <X className="w-3.5 h-3.5" /> Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* ITEM DETAIL MODAL */}
      {/* ---------------------------------------------------------------------- */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-200 my-8"
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-2.5 py-1 rounded bg-pink-100 text-pink-800 text-xs font-bold uppercase tracking-wider mb-2 inline-block">
              {selectedItem.type} Details
            </span>

            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {selectedItem.data.title || selectedItem.data.applicantName || selectedItem.data.name}
            </h3>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono overflow-x-auto max-h-96 space-y-2">
              {Object.entries(selectedItem.data).map(([key, val]) => (
                <div key={key} className="grid grid-cols-3 gap-2 border-b border-slate-200/60 pb-1">
                  <span className="font-semibold text-slate-600">{key}:</span>
                  <span className="col-span-2 text-slate-900 break-words">
                    {typeof val === "object" ? JSON.stringify(val) : String(val)}
                  </span>
                </div>
              ))}
            </div>

            {selectedItem.data.fileUrl || selectedItem.data.documentUrl ? (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <a
                  href={selectedItem.data.fileUrl || selectedItem.data.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" /> Download Attachment
                </a>
              </div>
            ) : null}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
