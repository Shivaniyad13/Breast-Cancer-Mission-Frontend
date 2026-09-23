"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Search,
  Download,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Tag,
  Eye,
  X,
  ExternalLink,
  User,
  CreditCard,
  MessageSquare,
  FileText,
  ImageOff,
} from "lucide-react";
import { updateDonationStatusAction } from "@/app/actions/donations";
import { DonationStatus } from "@prisma/client";

interface AdminDonationDashboardProps {
  initialDonations?: any[];
}

export default function AdminDonationDashboard({ initialDonations = [] }: AdminDonationDashboardProps) {
  const [donations, setDonations] = useState<any[]>(Array.isArray(initialDonations) ? initialDonations : []);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);

  // Filter donations dynamically
  const filteredDonations = donations.filter((donation) => {
    // Status filter
    if (statusFilter !== "ALL" && donation.status !== statusFilter) {
      return false;
    }

    // Type filter
    if (typeFilter === "GENERAL" && donation.campaignId !== null) {
      return false;
    }
    if (typeFilter === "CAMPAIGN" && donation.campaignId === null) {
      return false;
    }

    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const donorName = (donation.donorName || donation.donor?.name || "").toLowerCase();
      const donorEmail = (donation.donorEmail || donation.donor?.email || "").toLowerCase();
      const donorPhone = (donation.donorPhone || "").toLowerCase();
      const gatewayId = (donation.paymentGatewayId || "").toLowerCase();
      const campaignTitle = (donation.campaign?.title || "").toLowerCase();

      return (
        donorName.includes(q) ||
        donorEmail.includes(q) ||
        donorPhone.includes(q) ||
        gatewayId.includes(q) ||
        campaignTitle.includes(q)
      );
    }

    return true;
  });

  // Calculate Summary Stats
  const totalAmount = filteredDonations
    .filter((d) => d.status === "SUCCESSFUL" || d.status === "COMPLETED")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const generalDonationsCount = filteredDonations.filter((d) => d.campaignId === null).length;
  const campaignDonationsCount = filteredDonations.filter((d) => d.campaignId !== null).length;

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    setMessage(null);

    const res = await updateDonationStatusAction(id, newStatus as DonationStatus);
    setUpdatingId(null);

    if (res.success && res.donation) {
      setDonations((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: res.donation.status } : d))
      );
      if (selectedDonation && selectedDonation.id === id) {
        setSelectedDonation((prev: any) => (prev ? { ...prev, status: res.donation.status } : null));
      }
      setMessage({ type: "success", text: `Donation status updated to ${newStatus}` });
    } else {
      setMessage({ type: "error", text: res.error || "Failed to update donation status" });
    }
  };

  // CSV Export handler
  const handleExportCSV = () => {
    if (filteredDonations.length === 0) return;

    const headers = [
      "Donation ID",
      "Donor Name",
      "Donor Email",
      "Donor Phone",
      "Amount (INR)",
      "Payment ID",
      "Status",
      "Donation Type",
      "Campaign Name",
      "Is Anonymous",
      "Date",
    ];

    const rows = filteredDonations.map((d) => [
      `"${d.id}"`,
      `"${d.donorName || d.donor?.name || "Guest Donor"}"`,
      `"${d.donorEmail || d.donor?.email || "N/A"}"`,
      `"${d.donorPhone || "N/A"}"`,
      d.amount,
      `"${d.paymentGatewayId}"`,
      d.status,
      d.campaignId ? "Campaign Donation" : "General Donation",
      `"${d.campaign?.title || "General Donation"}"`,
      d.isAnonymous ? "Yes" : "No",
      `"${new Date(d.createdAt).toLocaleString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `donations_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESSFUL":
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold uppercase">
            <CheckCircle className="h-3 w-3" /> {status}
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold uppercase">
            <Clock className="h-3 w-3" /> PENDING
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-bold uppercase">
            <XCircle className="h-3 w-3" /> FAILED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Alert Messages */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex justify-between items-center ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-pink-100 bg-white p-5 space-y-2">
          <p className="text-[10px] text-pink-600 font-bold uppercase tracking-wider">Total Raised (Cleared)</p>
          <p className="text-2xl font-black text-slate-800">₹{totalAmount.toLocaleString()}</p>
          <p className="text-xs text-slate-400 font-medium">Successful &amp; Completed funds</p>
        </Card>

        <Card className="rounded-2xl border-slate-100 bg-white p-5 space-y-2">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Transactions</p>
          <p className="text-2xl font-black text-slate-800">{filteredDonations.length}</p>
          <p className="text-xs text-slate-400 font-medium">Matching search &amp; filter</p>
        </Card>

        <Card className="rounded-2xl border-purple-100 bg-purple-50/30 p-5 space-y-2">
          <p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">General Donations</p>
          <p className="text-2xl font-black text-purple-900">{generalDonationsCount}</p>
          <p className="text-xs text-purple-500 font-medium">Unlinked general awareness funds</p>
        </Card>

        <Card className="rounded-2xl border-cyan-100 bg-cyan-50/30 p-5 space-y-2">
          <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-wider">Campaign Donations</p>
          <p className="text-2xl font-black text-cyan-900">{campaignDonationsCount}</p>
          <p className="text-xs text-cyan-500 font-medium">Linked to specific campaigns</p>
        </Card>
      </div>

      {/* Controls Bar: Search, Filters, CSV Export */}
      <Card className="rounded-2xl border-slate-100 bg-white p-5 shadow-xs">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search donor name, email, phone, payment ID, or campaign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-pink-500"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-2 items-center">
            
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-500 text-[10px] uppercase font-bold">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="SUCCESSFUL">SUCCESSFUL</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold">
              <Tag className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-500 text-[10px] uppercase font-bold">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="GENERAL">General Donation</option>
                <option value="CAMPAIGN">Campaign Donation</option>
              </select>
            </div>

            {/* CSV Export Button */}
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="border-pink-200 text-pink-700 hover:bg-pink-50 rounded-xl text-xs font-bold py-2 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-4 w-4" /> Export CSV
            </Button>

          </div>

        </div>
      </Card>

      {/* Main Donations Table */}
      <Card className="rounded-2xl border-slate-100 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600 border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                <th className="py-3.5 px-4">Donor Name &amp; Contact</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment ID</th>
                <th className="py-3.5 px-4">Donation Type</th>
                <th className="py-3.5 px-4">Campaign Name</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No donation records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredDonations.map((donation) => {
                  const donorNameDisplay = donation.donorName || donation.donor?.name || "Guest Donor";
                  const donorEmailDisplay = donation.donorEmail || donation.donor?.email || "N/A";
                  const donorPhoneDisplay = donation.donorPhone || "N/A";
                  const campaignTitleDisplay = donation.campaignId ? donation.campaign?.title : "General Donation";

                  return (
                    <tr key={donation.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* Donor Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            {donorNameDisplay}
                            {donation.isAnonymous && (
                              <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">
                                Anonymous
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400">{donorEmailDisplay}</p>
                          {donation.donorPhone && (
                            <p className="text-[10px] text-slate-400">{donorPhoneDisplay}</p>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-slate-900 font-heading text-sm">
                          ₹{Number(donation.amount).toLocaleString()}
                        </span>
                      </td>

                      {/* Payment ID */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                          {donation.paymentGatewayId}
                        </span>
                      </td>

                      {/* Donation Type */}
                      <td className="py-3.5 px-4">
                        {donation.campaignId ? (
                          <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Campaign Donation
                          </span>
                        ) : (
                          <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            General Donation
                          </span>
                        )}
                      </td>

                      {/* Campaign Name */}
                      <td className="py-3.5 px-4">
                        <span className={`font-semibold ${donation.campaignId ? "text-slate-800" : "text-purple-700 italic"}`}>
                          {campaignTitleDisplay}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">{getStatusBadge(donation.status)}</td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(donation.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions: View & Update Status */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDonation(donation)}
                            className="h-8 border-pink-200 text-pink-700 hover:bg-pink-50 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </Button>

                          <select
                            disabled={updatingId === donation.id}
                            value={donation.status}
                            onChange={(e) => handleStatusChange(donation.id, e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 cursor-pointer focus:border-pink-500"
                          >
                            <option value="PENDING">Set PENDING</option>
                            <option value="SUCCESSFUL">Set SUCCESSFUL</option>
                            <option value="COMPLETED">Set COMPLETED</option>
                            <option value="FAILED">Set FAILED</option>
                          </select>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detailed View Modal */}
      <AnimatePresence>
        {selectedDonation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedDonation(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-pink-200 dark:border-pink-800 shadow-2xl my-8 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">
                    <Heart className="h-5 w-5 fill-pink-500 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      Donation Details
                      {getStatusBadge(selectedDonation.status)}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ID: <span className="font-mono text-slate-700 dark:text-slate-300">{selectedDonation.id}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDonation(null)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body - Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 max-h-[75vh] overflow-y-auto pr-1">
                
                {/* Left Column: Donor & Transaction Info */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Amount & Status Card */}
                  <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 dark:from-pink-950/40 dark:via-rose-950/40 dark:to-purple-950/40 rounded-2xl p-5 border border-pink-200 dark:border-pink-800/60 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
                          Amount Donated
                        </span>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white">
                          ₹{Number(selectedDonation.amount).toLocaleString('en-IN')}{" "}
                          <span className="text-sm font-semibold text-slate-500">{selectedDonation.currency || "INR"}</span>
                        </h4>
                      </div>

                      {/* Status Selector Inside Modal */}
                      <div className="space-y-1 text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Update Status
                        </span>
                        <select
                          disabled={updatingId === selectedDonation.id}
                          value={selectedDonation.status}
                          onChange={(e) => handleStatusChange(selectedDonation.id, e.target.value)}
                          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs focus:border-pink-500 cursor-pointer"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="SUCCESSFUL">SUCCESSFUL</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="FAILED">FAILED</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Donor Information */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <User className="h-4 w-4 text-pink-500" /> Donor Profile
                    </h4>

                    <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="text-slate-400 block text-[11px] font-medium">Full Name</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {selectedDonation.donorName || selectedDonation.donor?.name || "Guest Donor"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px] font-medium">Anonymous Status</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {selectedDonation.isAnonymous ? "Yes (Anonymous)" : "No (Public)"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px] font-medium">Email Address</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 break-all">
                          {selectedDonation.donorEmail || selectedDonation.donor?.email || "N/A"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px] font-medium">Phone Number</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {selectedDonation.donorPhone || "N/A"}
                        </span>
                      </div>

                      {selectedDonation.organization && (
                        <div className="col-span-2">
                          <span className="text-slate-400 block text-[11px] font-medium">Organization</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {selectedDonation.organization}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Transaction & Campaign Details */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-pink-500" /> Transaction &amp; Purpose
                    </h4>

                    <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="text-slate-400 block text-[11px] font-medium">Payment Ref / Txn ID</span>
                        <span className="font-mono font-bold text-pink-600 dark:text-pink-400 break-all">
                          {selectedDonation.paymentGatewayId || "N/A"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px] font-medium">Donation Type</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {selectedDonation.campaignId ? "Campaign Donation" : "General Donation"}
                        </span>
                      </div>

                      <div className="col-span-2">
                        <span className="text-slate-400 block text-[11px] font-medium">Campaign Title</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {selectedDonation.campaign?.title || selectedDonation.purpose || "General Breast Cancer Awareness"}
                        </span>
                      </div>

                      <div className="col-span-2">
                        <span className="text-slate-400 block text-[11px] font-medium">Date &amp; Time</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {new Date(selectedDonation.createdAt).toLocaleString("en-IN", {
                            dateStyle: "full",
                            timeStyle: "medium",
                          })}
                        </span>
                      </div>
                    </div>

                    {selectedDonation.message && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400 block text-[11px] font-medium flex items-center gap-1 mb-1">
                          <MessageSquare className="h-3.5 w-3.5 text-pink-500" /> Donor Message
                        </span>
                        <p className="text-xs italic text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                          &ldquo;{selectedDonation.message}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                </div>

                {/* Right Column: Payment Proof / Screenshot Preview */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 h-full flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between mb-3">
                        <span className="flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-pink-500" /> Payment Screenshot / Proof
                        </span>
                      </h4>

                      {(() => {
                        const proofUrl =
                          selectedDonation.screenshotUrl ||
                          selectedDonation.paymentProofUrl ||
                          selectedDonation.proofUrl ||
                          selectedDonation.attachmentUrl ||
                          selectedDonation.receiptUrl ||
                          selectedDonation.documentUrl ||
                          selectedDonation.fileUrl ||
                          selectedDonation.proof;

                        if (!proofUrl) {
                          return (
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center space-y-3 bg-white dark:bg-slate-900 my-auto">
                              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                                <ImageOff className="h-6 w-6" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                  No Proof Uploaded
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  Donor did not attach a payment screenshot during submission.
                                </p>
                              </div>
                            </div>
                          );
                        }

                        const isPdf = typeof proofUrl === "string" && proofUrl.toLowerCase().endsWith(".pdf");

                        return (
                          <div className="space-y-3">
                            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black/5 dark:bg-black/40 min-h-[220px] flex items-center justify-center">
                              {isPdf ? (
                                <div className="p-6 text-center space-y-3">
                                  <FileText className="h-12 w-12 text-pink-500 mx-auto" />
                                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                    PDF Document Proof
                                  </p>
                                  <a
                                    href={proofUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline"
                                  >
                                    Open PDF in New Tab <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                </div>
                              ) : (
                                <img
                                  src={proofUrl}
                                  alt="Payment Screenshot Proof"
                                  className="w-full max-h-[340px] object-contain rounded-xl"
                                />
                              )}
                            </div>

                            {/* Action links for proof file */}
                            <div className="flex gap-2 pt-2">
                              <a
                                href={proofUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              >
                                <ExternalLink className="h-3.5 w-3.5" /> Full Size
                              </a>
                              <a
                                href={proofUrl}
                                download={`donation_proof_${selectedDonation.id}`}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors"
                              >
                                <Download className="h-3.5 w-3.5" /> Download
                              </a>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                      <p className="text-[10px] text-slate-400 font-medium">
                        Verification Tip: Check amount &amp; reference ID against your bank statement.
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
