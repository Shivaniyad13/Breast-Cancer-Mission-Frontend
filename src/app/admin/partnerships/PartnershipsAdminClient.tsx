"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Handshake,
  Search,
  Mail,
  Phone,
  Globe,
  MapPin,
  Check,
  X,
  Trash2,
  Eye,
  Settings2,
  FileText,
  Info,
  Calendar,
  Building2,
  ExternalLink,
  Loader2,
  AlertCircle
} from "lucide-react";
import {
  updatePartnershipStatus,
  togglePartnershipPublishState,
  deletePartnershipRequest
} from "@/app/actions/partnerships";

interface RequestItem {
  id: string;
  organizationName: string;
  organizationType: string;
  contactPersonName: string;
  designation?: string | null;
  email: string;
  phone: string;
  website?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  logoUrl?: string | null;
  documentUrl?: string | null;
  category: string;
  description?: string | null;
  reason?: string | null;
  termsAccepted: boolean;
  status: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function PartnershipsAdminClient({
  initialRequests
}: {
  initialRequests: RequestItem[];
}) {
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Selection for details view modal
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [remarksText, setRemarksText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Helper to extract initials for fallback logo
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Status Badge Colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "REJECTED":
        return "bg-rose-50 border-rose-200 text-rose-700";
      default:
        return "bg-amber-50 border-amber-200 text-amber-700";
    }
  };

  // Handle Approve / Reject / Pending Status Updates
  const handleStatusUpdate = async (id: string, newStatus: "PENDING" | "APPROVED" | "REJECTED") => {
    setIsUpdating(true);
    setErrorMsg("");
    try {
      const res = await updatePartnershipStatus(id, newStatus, remarksText.trim() || undefined);
      if (res.success && res.request) {
        // Update local state
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...res.request } as RequestItem : r))
        );
        // Update currently viewed request
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest({ ...selectedRequest, ...res.request } as RequestItem);
        }
        setRemarksText("");
      } else {
        setErrorMsg(res.error || "Failed to update status.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Publish / Unpublish Toggle
  const handlePublishToggle = async (id: string, currentState: boolean) => {
    setIsUpdating(true);
    try {
      const res = await togglePartnershipPublishState(id, !currentState);
      if (res.success && res.request) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isPublished: res.request.isPublished } : r))
        );
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest({ ...selectedRequest, isPublished: res.request.isPublished });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Delete Request
  const handleDeleteRequest = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) return;
    setIsUpdating(true);
    try {
      const res = await deletePartnershipRequest(id);
      if (res.success) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        setSelectedRequest(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Client filtering
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.contactPersonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.city && req.city.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || req.status === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || req.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 border-b border-pink-100 pb-6">
        <div className="space-y-1">
          <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <ShieldCheck className="h-2.5 w-2.5" /> Command Center
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <Handshake className="h-8 w-8 text-primary" /> Partnerships Manager
          </h1>
          <p className="text-muted-foreground text-sm">
            Review and filter institutional partnership requests, approve/reject applications, and publish logos to the Awareness page.
          </p>
        </div>
      </div>

      {/* Admin tabs navigation */}
      <div className="flex gap-4 border-b border-slate-100 pb-4 text-sm font-semibold overflow-x-auto no-scrollbar whitespace-nowrap">
        <Link href="/admin/webinars" className="text-slate-500 hover:text-primary transition-colors pb-4 -mb-[18px]">
          Webinar Management
        </Link>
        <Link href="/admin/memberships" className="text-slate-500 hover:text-primary transition-colors pb-4 -mb-[18px]">
          Institution Memberships
        </Link>
        <Link href="/admin/success-stories" className="text-slate-500 hover:text-primary transition-colors pb-4 -mb-[18px]">
          Patient Success Stories
        </Link>
        <Link href="/admin/homepage-widgets" className="text-slate-500 hover:text-primary transition-colors pb-4 -mb-[18px]">
          Homepage Widgets
        </Link>
        <Link href="/admin/live-updates" className="text-slate-500 hover:text-primary transition-colors pb-4 -mb-[18px]">
          Home Page Live Updates
        </Link>
        <Link href="/admin/diagnosis" className="text-slate-500 hover:text-primary transition-colors pb-4 -mb-[18px]">
          Diagnosis & Collaboration
        </Link>
        <Link href="/admin/partnerships" className="text-primary border-b-2 border-primary pb-4 -mb-[18px] transition-colors font-extrabold">
          Partnership Requests
        </Link>
      </div>

      {/* Control Panel: Filters & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 border rounded-2xl p-4">
        
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by organization name, person, email or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-primary font-medium"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-primary font-bold text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Only</option>
            <option value="APPROVED">Approved Only</option>
            <option value="REJECTED">Rejected Only</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="md:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-primary font-bold text-slate-700"
          >
            <option value="ALL">All Categories</option>
            <option value="Medical Partner">Medical Partner</option>
            <option value="NGO Partner">NGO Partner</option>
            <option value="CSR Partner">CSR Partner</option>
            <option value="Technology Partner">Technology Partner</option>
            <option value="Research Partner">Research Partner</option>
            <option value="Awareness Partner">Awareness Partner</option>
            <option value="Community Partner">Community Partner</option>
          </select>
        </div>

      </div>

      {/* Main Request Grid */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border border-dashed rounded-3xl space-y-3">
          <Handshake className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-slate-800">No requests found</h3>
          <p className="text-xs text-slate-450 font-medium">Try widening your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => {
            const initials = getInitials(req.organizationName);

            return (
              <Card
                key={req.id}
                className="border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    {/* Logo initials fallback */}
                    {req.logoUrl ? (
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-pink-100 flex items-center justify-center shrink-0">
                        <Image src={req.logoUrl} alt={req.organizationName} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 text-white flex items-center justify-center font-heading font-black text-lg shadow-sm shrink-0">
                        {initials}
                      </div>
                    )}
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                      {req.isPublished && req.status === "APPROVED" && (
                        <span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                          Publicly Live
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest">
                      {req.category}
                    </span>
                    <h3 className="font-heading text-base font-extrabold text-slate-800 line-clamp-1">
                      {req.organizationName}
                    </h3>
                    <p className="text-slate-500 text-xs font-semibold flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0" /> {req.city || "Unknown City"}, {req.country || "India"}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2 pt-1">
                      {req.description || "No description provided."}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border-t p-4 flex justify-between items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedRequest(req)}
                    className="text-xs font-bold text-primary hover:bg-white flex items-center gap-1 rounded-xl cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" /> Details
                  </Button>

                  <div className="flex gap-2">
                    {req.status === "APPROVED" && (
                      <Button
                        size="sm"
                        variant={req.isPublished ? "default" : "outline"}
                        onClick={() => handlePublishToggle(req.id, req.isPublished)}
                        className={`text-[10px] font-bold rounded-xl cursor-pointer py-1 px-3 ${req.isPublished ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "border-slate-300 text-slate-600 hover:bg-white"}`}
                      >
                        {req.isPublished ? "Unpublish" : "Publish"}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteRequest(req.id)}
                      className="text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer p-2"
                      title="Delete request"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detailed Modal view */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto cursor-zoom-out"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl relative border border-slate-100 p-6 md:p-8 cursor-default max-h-[90vh] overflow-y-auto space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedRequest(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-55 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Title Section */}
              <div className="flex gap-4 items-start border-b pb-4">
                {selectedRequest.logoUrl ? (
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden border flex items-center justify-center bg-white shrink-0 shadow-xs">
                    <Image src={selectedRequest.logoUrl} alt={selectedRequest.organizationName} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 text-white flex items-center justify-center font-heading font-black text-xl shadow-md shrink-0">
                    {getInitials(selectedRequest.organizationName)}
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100/50">
                    {selectedRequest.category}
                  </span>
                  <h3 className="font-heading text-xl font-black text-slate-800 pt-1.5 leading-tight">
                    {selectedRequest.organizationName}
                  </h3>
                  <p className="text-slate-500 text-xs font-semibold flex items-center gap-1 pt-0.5">
                    {selectedRequest.organizationType} · <MapPin className="h-3 w-3" /> {selectedRequest.city || "Unknown City"}, {selectedRequest.state || "State"}, {selectedRequest.country || "India"}
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Data Fields Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                
                {/* Contact person */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Primary Contact</span>
                  <p className="font-extrabold text-slate-800">{selectedRequest.contactPersonName}</p>
                  <p className="text-xs text-slate-500 font-bold">{selectedRequest.designation || "No designation listed"}</p>
                </div>

                {/* Email and Phone */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Contact Information</span>
                  <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> {selectedRequest.email}
                  </p>
                  <p className="font-semibold text-slate-700 flex items-center gap-1.5 pt-0.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> {selectedRequest.phone}
                  </p>
                </div>

                {/* Website */}
                {selectedRequest.website && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Website URL</span>
                    <a
                      href={selectedRequest.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      {selectedRequest.website} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}

                {/* Documents URL */}
                {selectedRequest.documentUrl && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Application Documents</span>
                    <a
                      href={selectedRequest.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-700 hover:text-primary transition-colors flex items-center gap-1 border border-slate-200 rounded-xl px-4 py-2 w-fit bg-slate-50 shadow-xs"
                    >
                      <FileText className="h-4 w-4" /> View Supporting Documents <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </a>
                  </div>
                )}

                {/* Description */}
                {selectedRequest.description && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Organization Overview</span>
                    <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 border rounded-2xl">
                      {selectedRequest.description}
                    </p>
                  </div>
                )}

                {/* Motivation statement */}
                {selectedRequest.reason && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Collaboration Intent</span>
                    <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 border rounded-2xl">
                      {selectedRequest.reason}
                    </p>
                  </div>
                )}

                {/* Application timeline metadata */}
                <div className="space-y-1.5 sm:col-span-2 flex items-center gap-4 text-xs text-slate-400 border-t pt-4">
                  <span className="flex items-center gap-1 font-bold">
                    <Calendar className="h-3.5 w-3.5" /> Applied on: {new Date(selectedRequest.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1 font-bold">
                    <Info className="h-3.5 w-3.5" /> Application Status: <span className="font-extrabold text-slate-600">{selectedRequest.status}</span>
                  </span>
                </div>

              </div>

              {/* Status Update Remarks Input */}
              <div className="space-y-2 border-t pt-6">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Remarks / Notes (Sent to applicant via simulated email)
                </label>
                <textarea
                  rows={2}
                  value={remarksText}
                  onChange={(e) => setRemarksText(e.target.value)}
                  placeholder="e.g. Approved for mobile mammography collaborations. Or specify reasons for rejection..."
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-sm focus:outline-primary font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-6 flex flex-wrap justify-between items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleDeleteRequest(selectedRequest.id)}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl font-bold cursor-pointer"
                  disabled={isUpdating}
                >
                  <Trash2 className="h-4 w-4" /> Delete Request
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRequest(null)}
                    className="rounded-xl px-5 font-bold cursor-pointer"
                  >
                    Cancel
                  </Button>

                  {selectedRequest.status !== "PENDING" && (
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate(selectedRequest.id, "PENDING")}
                      className="border-amber-200 text-amber-600 hover:bg-amber-50 rounded-xl font-bold cursor-pointer"
                      disabled={isUpdating}
                    >
                      {isUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Mark Pending
                    </Button>
                  )}

                  {selectedRequest.status !== "REJECTED" && (
                    <Button
                      variant="outline"
                      onClick={() => handleStatusUpdate(selectedRequest.id, "REJECTED")}
                      className="border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-bold cursor-pointer"
                      disabled={isUpdating}
                    >
                      {isUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Reject Application
                    </Button>
                  )}

                  {selectedRequest.status !== "APPROVED" && (
                    <Button
                      onClick={() => handleStatusUpdate(selectedRequest.id, "APPROVED")}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 font-bold cursor-pointer"
                      disabled={isUpdating}
                    >
                      {isUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Approve & Publish
                    </Button>
                  )}
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
