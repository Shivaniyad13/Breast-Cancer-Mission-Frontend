"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  X,
  Eye,
  Trash2,
  RefreshCw,
  AlertCircle,
  Loader2,
  Clock,
  Mail,
  Phone,
  MapPin,
  Heart,
  Stethoscope,
  Check,
} from "lucide-react";
import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import {
  getIndividualMembersAdmin,
  updateIndividualMemberStatus,
  deleteIndividualMember,
} from "@/app/actions/individualMembers";

interface IndividualMemberData {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  category: string; // "volunteer" | "professional"
  whyJoin: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  remarks?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

function formatRelativeDate(dateInput: Date | string) {
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(date.getTime())) return "";
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminIndividualMembersPage() {
  const [members, setMembers] = useState<IndividualMemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "VERIFIED" | "REJECTED">("ALL");

  // Modal State
  const [selectedMember, setSelectedMember] = useState<IndividualMemberData | null>(null);
  const [modalRemarks, setModalRemarks] = useState("");
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  // Action loading & toast notifications
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getIndividualMembersAdmin();
      if (res.success && res.members) {
        setMembers(res.members as any);
      } else {
        setError(res.error || "Failed to fetch individual member applications.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Update Status Action
  const handleUpdateStatus = async (
    id: string,
    status: "PENDING" | "VERIFIED" | "REJECTED",
    remarks?: string
  ) => {
    setActionLoadingId(id);
    try {
      const res = await updateIndividualMemberStatus(id, status, remarks);
      if (res.success && res.member) {
        setMembers((prev) =>
          prev.map((item) => (item.id === id ? (res.member as any) : item))
        );
        if (selectedMember && selectedMember.id === id) {
          setSelectedMember(res.member as any);
        }
        showToast("success", `Application marked as ${status}.`);
      } else {
        showToast("error", res.error || "Failed to update member status.");
      }
    } catch (err: any) {
      showToast("error", "Error updating member status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Action
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete application from "${name}"?`)) return;

    setActionLoadingId(id);
    try {
      const res = await deleteIndividualMember(id);
      if (res.success) {
        setMembers((prev) => prev.filter((item) => item.id !== id));
        if (selectedMember?.id === id) setSelectedMember(null);
        showToast("success", "Member application deleted.");
      } else {
        showToast("error", res.error || "Failed to delete member.");
      }
    } catch (err) {
      showToast("error", "Error deleting member application.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openDetailsModal = (item: IndividualMemberData) => {
    setSelectedMember(item);
    setModalRemarks(item.remarks || "");
  };

  const handleSaveModalRemarks = async () => {
    if (!selectedMember) return;
    setIsSubmittingModal(true);
    try {
      const res = await updateIndividualMemberStatus(
        selectedMember.id,
        selectedMember.status,
        modalRemarks
      );
      if (res.success && res.member) {
        setMembers((prev) =>
          prev.map((item) => (item.id === selectedMember.id ? (res.member as any) : item))
        );
        setSelectedMember(res.member as any);
        showToast("success", "Remarks saved successfully.");
      } else {
        showToast("error", res.error || "Failed to save remarks.");
      }
    } catch (err) {
      showToast("error", "Error saving remarks.");
    } finally {
      setIsSubmittingModal(false);
    }
  };

  // Tab counters
  const allCount = members.length;
  const pendingCount = members.filter((m) => m.status === "PENDING").length;
  const verifiedCount = members.filter((m) => m.status === "VERIFIED").length;
  const rejectedCount = members.filter((m) => m.status === "REJECTED").length;

  // Filtered List
  const filteredMembers = members.filter((item) => {
    const matchesTab = activeTab === "ALL" || item.status === activeTab;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.fullName.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.mobile.toLowerCase().includes(query) ||
      item.city.toLowerCase().includes(query) ||
      item.state.toLowerCase().includes(query) ||
      item.whyJoin.toLowerCase().includes(query);
    return matchesTab && matchesSearch;
  });

  const getEmptyMessage = () => {
    switch (activeTab) {
      case "PENDING":
        return "No pending applications. All caught up!";
      case "VERIFIED":
        return "No verified individual members yet.";
      case "REJECTED":
        return "No rejected applications.";
      default:
        return "No individual member applications submitted yet.";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold flex items-center gap-2 transition-all ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {toast.text}
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 border-b border-pink-100 pb-6">
        <div className="space-y-1">
          <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <ShieldCheck className="h-2.5 w-2.5" /> Command Center
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" /> Individual Members Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Review, approve, or reject individual membership applications from supporters and professionals.
          </p>
        </div>
      </div>

      {/* Inline Nav Tabs */}
      <AdminNavTabs />

      {/* Filter Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-2 w-full sm:w-auto self-start border border-slate-200/60 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "ALL"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          ALL
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-extrabold">
            {allCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("PENDING")}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "PENDING"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          PENDING
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-extrabold">
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("VERIFIED")}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "VERIFIED"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          VERIFIED
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">
            {verifiedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("REJECTED")}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "REJECTED"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          REJECTED
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 font-extrabold">
            {rejectedCount}
          </span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, mobile, city, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-colors"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-1/3 bg-slate-200 rounded-lg" />
                <div className="h-4 w-1/4 bg-slate-100 rounded-full" />
              </div>
              <div className="h-4 w-1/2 bg-slate-100 rounded" />
              <div className="h-12 w-full bg-slate-100 rounded-xl" />
              <div className="h-8 w-full bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-16 text-center space-y-4 bg-rose-50 rounded-3xl border border-rose-200 p-6">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-rose-800">Error Loading Applications</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchMembers}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-2xl transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className="h-4 w-4" /> Retry Loading
          </button>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-slate-200 p-8">
          <Users className="h-14 w-14 text-slate-300 mx-auto" />
          <h3 className="font-heading text-xl font-extrabold text-slate-700">{getEmptyMessage()}</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Applications submitted via the Individual Member form on the membership page will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((item) => {
            const isProfessional = item.category === "professional";
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-pink-200 transition-all p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Header: Name + Category Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-heading font-extrabold text-slate-800 text-base leading-tight">
                        {item.fullName}
                      </h4>
                      <p className="text-xs text-slate-400 font-sans mt-0.5 flex items-center gap-1">
                        <Mail className="h-3 w-3 inline" /> {item.email}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 border ${
                        isProfessional
                          ? "bg-purple-50 text-purple-700 border-purple-100"
                          : "bg-pink-50 text-pink-700 border-pink-100"
                      }`}
                    >
                      {isProfessional ? "Healthcare Professional" : "Volunteer Member"}
                    </span>
                  </div>

                  {/* Contact Info & Location */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-slate-400" /> {item.mobile}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" /> {item.city}, {item.state}
                    </span>
                  </div>

                  {/* Status Badge & Date */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        item.status === "VERIFIED"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : item.status === "REJECTED"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {item.status}
                    </span>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatRelativeDate(item.createdAt)}
                    </span>
                  </div>

                  {/* Why Join Snippet */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Why Join:
                    </span>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans bg-slate-50 p-3 rounded-xl border border-slate-100">
                      "{item.whyJoin}"
                    </p>
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openDetailsModal(item)}
                    title="View Details"
                    className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                  >
                    <Eye className="h-3.5 w-3.5" /> Details
                  </button>

                  <div className="flex items-center gap-1.5">
                    {item.status !== "VERIFIED" && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, "VERIFIED")}
                        disabled={actionLoadingId === item.id}
                        title="Approve Member"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        {actionLoadingId === item.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        Approve
                      </button>
                    )}

                    {item.status !== "REJECTED" && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, "REJECTED")}
                        disabled={actionLoadingId === item.id}
                        title="Reject Member"
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        {actionLoadingId === item.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        Reject
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item.id, item.fullName)}
                      disabled={actionLoadingId === item.id}
                      title="Delete Application"
                      className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all cursor-pointer"
                    >
                      {actionLoadingId === item.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 font-heading">
                  Individual Member Application
                </span>
                <h3 className="font-heading text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  {selectedMember.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                    Category
                  </span>
                  <span className="font-extrabold text-slate-800 text-xs">
                    {selectedMember.category === "professional"
                      ? "Healthcare Professional"
                      : "Volunteer Member"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                    Status
                  </span>
                  <span
                    className={`font-extrabold uppercase ${
                      selectedMember.status === "VERIFIED"
                        ? "text-emerald-700"
                        : selectedMember.status === "REJECTED"
                        ? "text-rose-700"
                        : "text-amber-700"
                    }`}
                  >
                    {selectedMember.status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                    Email
                  </span>
                  <span className="font-semibold text-slate-700">{selectedMember.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                    Mobile
                  </span>
                  <span className="font-semibold text-slate-700">{selectedMember.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                    City & State
                  </span>
                  <span className="font-semibold text-slate-700">
                    {selectedMember.city}, {selectedMember.state}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                    Submitted At
                  </span>
                  <span className="font-semibold text-slate-700">
                    {new Date(selectedMember.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Complete Why Join Response */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Why They Want To Join
                </label>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 font-sans text-xs leading-relaxed whitespace-pre-wrap">
                  "{selectedMember.whyJoin}"
                </div>
              </div>

              {/* Admin Internal Remarks */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Admin Internal Notes / Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional internal notes or remarks..."
                  value={modalRemarks}
                  onChange={(e) => setModalRemarks(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-pink-500 font-sans"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSaveModalRemarks}
                disabled={isSubmittingModal}
                className="px-4 py-2.5 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1"
              >
                {isSubmittingModal && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Save Remarks
              </button>

              <div className="flex items-center gap-2">
                {selectedMember.status !== "VERIFIED" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedMember.id, "VERIFIED", modalRemarks)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                  </button>
                )}
                {selectedMember.status !== "REJECTED" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedMember.id, "REJECTED", modalRemarks)}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
