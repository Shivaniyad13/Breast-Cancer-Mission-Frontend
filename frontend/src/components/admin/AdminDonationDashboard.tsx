"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Heart,
  Search,
  Download,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Tag,
  Calendar,
  User,
  Mail,
  Phone,
  ArrowUpDown,
} from "lucide-react";
import { updateDonationStatusAction } from "@/app/actions/donations";
import { DonationStatus } from "@prisma/client";

interface AdminDonationDashboardProps {
  initialDonations: any[];
}

export default function AdminDonationDashboard({ initialDonations }: AdminDonationDashboardProps) {
  const [donations, setDonations] = useState<any[]>(initialDonations);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

                      {/* Actions: Update Status */}
                      <td className="py-3.5 px-4 text-right">
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
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
