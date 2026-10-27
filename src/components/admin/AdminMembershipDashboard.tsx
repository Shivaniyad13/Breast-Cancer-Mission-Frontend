"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updateOrganizationApplicationStatusAction,
  updateCorporateApplicationStatusAction,
  updateOrganizationMemberAction,
  deleteOrganizationMemberAction,
  updateCorporatePartnerAction,
  deleteCorporatePartnerAction
} from "@/app/actions/institution";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar, Building2, Briefcase, Eye, Trash2, CheckCircle, HelpCircle,
  Download, ExternalLink, Loader2, Search, X, Check, FileText, Pencil
} from "lucide-react";

interface AdminMembershipDashboardProps {
  orgApplications: any[];
  corpApplications: any[];
}

export default function AdminMembershipDashboard({
  orgApplications,
  corpApplications
}: AdminMembershipDashboardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"NGO" | "CORPORATE">("NGO");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Local data state for real-time optimistic updates
  const [orgList, setOrgList] = useState(orgApplications);
  const [corpList, setCorpList] = useState(corpApplications);

  useEffect(() => {
    setOrgList(orgApplications);
  }, [orgApplications]);

  useEffect(() => {
    setCorpList(corpApplications);
  }, [corpApplications]);
  
  // Selected application for detail modal
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [remarks, setRemarks] = useState("");

  // State for edit modal
  const [editingApp, setEditingApp] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleReview = (app: any) => {
    setSelectedApp(app);
    setRemarks(app.remarks || "");
  };

  const handleCloseModal = () => {
    setSelectedApp(null);
    setRemarks("");
  };

  const handleStatusUpdate = async (status: "VERIFIED" | "REJECTED") => {
    if (!selectedApp) return;

    startTransition(async () => {
      let res;
      if (activeTab === "NGO") {
        res = await updateOrganizationApplicationStatusAction(selectedApp.id, status, remarks);
      } else {
        res = await updateCorporateApplicationStatusAction(selectedApp.id, status, remarks);
      }

      if (res && res.error) {
        alert(res.error);
      } else {
        if (activeTab === "NGO") {
          setOrgList((prev) =>
            prev.map((item) =>
              item.id === selectedApp.id ? { ...item, status, remarks } : item
            )
          );
        } else {
          setCorpList((prev) =>
            prev.map((item) =>
              item.id === selectedApp.id ? { ...item, status, remarks } : item
            )
          );
        }
        handleCloseModal();
        router.refresh();
      }
    });
  };

  // Open Edit Modal
  const handleOpenEdit = (app: any) => {
    setEditingApp(app);
    if (activeTab === "NGO") {
      setEditFormData({
        organizationName: app.organizationName || "",
        organizationType: app.organizationType || "",
        ngoRegistrationNumber: app.ngoRegistrationNumber || "",
        yearEstablished: app.yearEstablished ?? "",
        contactPersonName: app.contactPersonName || "",
        designation: app.designation || "",
        email: app.email || "",
        mobileNumber: app.mobileNumber || "",
        website: app.website || "",
        completeAddress: app.completeAddress || "",
        state: app.state || "",
        district: app.district || "",
        city: app.city || "",
        pincode: app.pincode || "",
        numberOfVolunteers: app.numberOfVolunteers ?? 0,
        areasOfWork: app.areasOfWork || "",
        previousExperience: app.previousExperience || "",
        expectedCollaboration: app.expectedCollaboration || "",
        status: app.status || "PENDING",
        remarks: app.remarks || "",
        ngoCertificateUrl: app.ngoCertificateUrl || "",
        organizationLogoUrl: app.organizationLogoUrl || "",
        supportingDocumentsUrl: app.supportingDocumentsUrl || "",
      });
    } else {
      setEditFormData({
        companyName: app.companyName || "",
        industry: app.industry || "",
        gstNumber: app.gstNumber || "",
        cinNumber: app.cinNumber || "",
        contactPersonName: app.contactPersonName || "",
        designation: app.designation || "",
        email: app.email || "",
        mobileNumber: app.mobileNumber || "",
        website: app.website || "",
        companyAddress: app.companyAddress || "",
        state: app.state || "",
        city: app.city || "",
        pincode: app.pincode || "",
        employeeStrength: app.employeeStrength ?? 0,
        csrBudgetCategory: app.csrBudgetCategory || "",
        collaborationInterest: app.collaborationInterest || "",
        status: app.status || "PENDING",
        remarks: app.remarks || "",
        companyLogoUrl: app.companyLogoUrl || "",
        csrPolicyUrl: app.csrPolicyUrl || "",
        supportingDocumentsUrl: app.supportingDocumentsUrl || "",
      });
    }
  };

  // Save Edit Handler
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    setIsSavingEdit(true);
    try {
      let res;
      if (activeTab === "NGO") {
        res = await updateOrganizationMemberAction(editingApp.id, editFormData);
      } else {
        res = await updateCorporatePartnerAction(editingApp.id, editFormData);
      }

      if (res && res.error) {
        alert(res.error);
      } else {
        const updated = res.data || { ...editingApp, ...editFormData };
        if (activeTab === "NGO") {
          setOrgList((prev) =>
            prev.map((item) => (item.id === editingApp.id ? updated : item))
          );
        } else {
          setCorpList((prev) =>
            prev.map((item) => (item.id === editingApp.id ? updated : item))
          );
        }
        if (selectedApp?.id === editingApp.id) {
          setSelectedApp(updated);
        }
        setEditingApp(null);
        router.refresh();
      }
    } catch (err: any) {
      alert(err?.message || "Error saving changes.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Delete Handler
  const handleDelete = async (app: any) => {
    const name = activeTab === "NGO" ? app.organizationName : app.companyName;
    if (
      !window.confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(app.id);
    try {
      let res;
      if (activeTab === "NGO") {
        res = await deleteOrganizationMemberAction(app.id);
      } else {
        res = await deleteCorporatePartnerAction(app.id);
      }

      if (res && res.error) {
        alert(res.error);
      } else {
        if (activeTab === "NGO") {
          setOrgList((prev) => prev.filter((item) => item.id !== app.id));
        } else {
          setCorpList((prev) => prev.filter((item) => item.id !== app.id));
        }
        if (selectedApp?.id === app.id) {
          setSelectedApp(null);
        }
        if (editingApp?.id === app.id) {
          setEditingApp(null);
        }
        router.refresh();
      }
    } catch (err: any) {
      alert(err?.message || "Error deleting entry.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter application list
  const currentList = activeTab === "NGO" ? orgList : corpList;
  const filteredList = currentList.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    
    const name = activeTab === "NGO" ? app.organizationName : app.companyName;
    const rep = app.contactPersonName;
    const email = app.email;
    const searchString = `${name} ${rep} ${email}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-slate-800">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === "NGO" ? "Search NGO or Contact..." : "Search Company or Contact..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary bg-white text-slate-800"
          />
        </div>

        {/* Tab switcher & Status filters */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold bg-white focus:outline-none focus:border-primary text-slate-800"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="VERIFIED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <Button
            onClick={() => { setActiveTab("NGO"); setStatusFilter("all"); setSearchQuery(""); }}
            variant={activeTab === "NGO" ? "default" : "outline"}
            className="rounded-xl text-xs font-bold py-2 cursor-pointer"
          >
            Organization Members ({orgList.length})
          </Button>

          <Button
            onClick={() => { setActiveTab("CORPORATE"); setStatusFilter("all"); setSearchQuery(""); }}
            variant={activeTab === "CORPORATE" ? "default" : "outline"}
            className="rounded-xl text-xs font-bold py-2 cursor-pointer"
          >
            Corporate Partners ({corpList.length})
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border-slate-100 rounded-2xl shadow-sm overflow-hidden bg-white text-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400">
                  <th className="p-4 pl-6">Institution Name</th>
                  <th className="p-4">Contact Representative</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((app) => {
                    const name = activeTab === "NGO" ? app.organizationName : app.companyName;
                    const subtitle = activeTab === "NGO" ? app.organizationType : app.industry;
                    const date = new Date(app.createdAt).toLocaleDateString("en-US");

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 text-sm">{name}</span>
                            <span className="text-[10px] text-slate-400 block uppercase font-semibold">{subtitle}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <span className="text-slate-700">{app.contactPersonName}</span>
                            <span className="text-[10px] text-slate-400 block">{app.email}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500">{date}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                            app.status === "VERIFIED"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : app.status === "REJECTED"
                                ? "bg-rose-50 text-rose-500 border border-rose-100"
                                : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}>
                            {app.status === "VERIFIED" ? "Approved" : app.status === "REJECTED" ? "Rejected" : "Pending"}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              onClick={() => handleReview(app)}
                              className="bg-primary hover:bg-primary/95 text-white rounded-xl text-[10px] uppercase font-bold py-1.5 h-auto px-3 cursor-pointer inline-flex items-center"
                              title="Review Application"
                            >
                              <Eye className="h-3 w-3 mr-1" /> Review
                            </Button>
                            <Button
                              onClick={() => handleOpenEdit(app)}
                              variant="outline"
                              className="border-slate-200 text-slate-700 hover:text-primary hover:border-primary/40 rounded-xl text-[10px] uppercase font-bold py-1.5 h-auto px-2.5 cursor-pointer inline-flex items-center"
                              title="Edit Application"
                            >
                              <Pencil className="h-3 w-3 mr-1" /> Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(app)}
                              variant="outline"
                              disabled={deletingId === app.id}
                              className="border-rose-200 bg-rose-50/50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-xl text-[10px] uppercase font-bold py-1.5 h-auto px-2.5 cursor-pointer inline-flex items-center"
                              title="Delete Application"
                            >
                              {deletingId === app.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Overlay Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-lg border border-slate-100 animate-in fade-in zoom-in-95 duration-200 text-slate-800">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                  {activeTab === "NGO" ? "NGO Application Review" : "Corporate Application Review"}
                </span>
                <h3 className="font-heading font-bold text-xl text-slate-800 mt-1">
                  {activeTab === "NGO" ? selectedApp.organizationName : selectedApp.companyName}
                </h3>
              </div>
              <button onClick={handleCloseModal} className="h-8 w-8 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              
              {/* Grid: Profile detail lists */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 pb-5">
                {activeTab === "NGO" ? (
                  <>
                    <div><span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">NGO Registration Number</span><strong>{selectedApp.ngoRegistrationNumber}</strong></div>
                    <div><span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Year Established</span><strong>{selectedApp.yearEstablished}</strong></div>
                    <div><span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Organization Type</span><strong>{selectedApp.organizationType}</strong></div>
                    <div><span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Volunteers count</span><strong>{selectedApp.numberOfVolunteers}</strong></div>
                    <div className="col-span-1 sm:col-span-2"><span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Areas of Work</span><strong>{selectedApp.areasOfWork}</strong></div>
                  </>
                ) : (
                  <>
                    <div><span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">GST Number</span><strong>{selectedApp.gstNumber}</strong></div>
                    <div><span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">CIN Number</span><strong>{selectedApp.cinNumber || "N/A"}</strong></div>
                    <div><span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Industry Type</span><strong>{selectedApp.industry}</strong></div>
                    <div><span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Employee Strength</span><strong>{selectedApp.employeeStrength}</strong></div>
                    <div><span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">CSR Budget Category</span><strong>{selectedApp.csrBudgetCategory}</strong></div>
                  </>
                )}
              </div>

              {/* Grid: Contact & Address details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 pb-5">
                <div><span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Contact Person</span><strong>{selectedApp.contactPersonName} ({selectedApp.designation})</strong></div>
                <div><span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Representative Email</span><strong>{selectedApp.email}</strong></div>
                <div><span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Mobile Number</span><strong>{selectedApp.mobileNumber}</strong></div>
                <div><span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Website</span><strong>{selectedApp.website ? <a href={selectedApp.website} target="_blank" className="text-primary hover:underline inline-flex items-center gap-0.5">{selectedApp.website} <ExternalLink className="h-3 w-3" /></a> : "None"}</strong></div>
                
                <div className="col-span-1 sm:col-span-2">
                  <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Physical Address</span>
                  <strong>
                    {activeTab === "NGO" 
                      ? `${selectedApp.completeAddress}, ${selectedApp.city}, ${selectedApp.district}, ${selectedApp.state} - ${selectedApp.pincode}`
                      : `${selectedApp.companyAddress}, ${selectedApp.city}, ${selectedApp.state} - ${selectedApp.pincode}`}
                  </strong>
                </div>
              </div>

              {/* Experiences & expected collaboration */}
              {activeTab === "NGO" ? (
                <div className="space-y-4 border-b border-slate-100 pb-5">
                  <div>
                    <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Previous Campaign Experience</span>
                    <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1 italic leading-relaxed text-xs">{selectedApp.previousExperience}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Expected Collaboration</span>
                    <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1 italic leading-relaxed text-xs">{selectedApp.expectedCollaboration}</p>
                  </div>
                </div>
              ) : (
                <div className="border-b border-slate-100 pb-5">
                  <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Collaboration Interest</span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {(selectedApp.collaborationInterest || "").split(", ").map((item: string) => (
                      <span key={item} className="bg-purple-50 text-purple-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-100">{item}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* UPLOADED CREDENTIAL DOCUMENTS */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="text-[10px] font-bold uppercase text-slate-700 tracking-wider">Uploaded Documents for Audit</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeTab === "NGO" ? (
                    <>
                      <a href={selectedApp.ngoCertificateUrl} target="_blank" className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 hover:border-primary/50 transition-colors">
                        <FileText className="h-4 w-4 text-rose-500 font-bold" />
                        <div className="truncate"><span className="text-[9px] text-slate-400 block">Registration Certificate</span><strong>View File</strong></div>
                      </a>
                      <a href={selectedApp.organizationLogoUrl} target="_blank" className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 hover:border-primary/50 transition-colors">
                        <Building2 className="h-4 w-4 text-pink-500 font-bold" />
                        <div className="truncate"><span className="text-[9px] text-slate-400 block">Organization Logo</span><strong>View File</strong></div>
                      </a>
                      <a href={selectedApp.supportingDocumentsUrl} target="_blank" className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 hover:border-primary/50 transition-colors">
                        <FileText className="h-4 w-4 text-slate-500 font-bold" />
                        <div className="truncate"><span className="text-[9px] text-slate-400 block">Supporting Docs</span><strong>View File</strong></div>
                      </a>
                    </>
                  ) : (
                    <>
                      <a href={selectedApp.companyLogoUrl} target="_blank" className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 hover:border-primary/50 transition-colors">
                        <Building2 className="h-4 w-4 text-purple-500 font-bold" />
                        <div className="truncate"><span className="text-[9px] text-slate-400 block">Company Logo</span><strong>View File</strong></div>
                      </a>
                      {selectedApp.csrPolicyUrl && (
                        <a href={selectedApp.csrPolicyUrl} target="_blank" className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 hover:border-primary/50 transition-colors">
                          <FileText className="h-4 w-4 text-blue-500 font-bold" />
                          <div className="truncate"><span className="text-[9px] text-slate-400 block">CSR Policy File</span><strong>View File</strong></div>
                        </a>
                      )}
                      <a href={selectedApp.supportingDocumentsUrl} target="_blank" className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 hover:border-primary/50 transition-colors">
                        <FileText className="h-4 w-4 text-slate-500 font-bold" />
                        <div className="truncate"><span className="text-[9px] text-slate-400 block">Supporting Docs</span><strong>View File</strong></div>
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* ADMINISTRATIVE REMARKS */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Administrative Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter application review details, approval constraints, or reasons for rejection..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none bg-white text-slate-800"
                />
              </div>

            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleDelete(selectedApp)}
                  variant="outline"
                  disabled={deletingId === selectedApp.id}
                  className="border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold px-4 py-2 flex items-center gap-1.5 cursor-pointer"
                >
                  {deletingId === selectedApp.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Delete Application
                </Button>
                <Button
                  onClick={() => handleOpenEdit(selectedApp)}
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:text-primary hover:border-primary/40 rounded-xl text-xs font-bold px-4 py-2 flex items-center gap-1.5 cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit Details
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCloseModal}
                  variant="outline"
                  className="rounded-xl text-xs font-bold px-5 py-2 cursor-pointer"
                >
                  Close
                </Button>
                
                {selectedApp.status === "PENDING" && (
                  <>
                    <Button
                      onClick={() => handleStatusUpdate("REJECTED")}
                      disabled={isPending}
                      variant="destructive"
                      className="rounded-xl text-xs font-bold px-5 py-2 flex items-center gap-1 cursor-pointer"
                    >
                      {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3.5 w-3.5" />} Reject Application
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate("VERIFIED")}
                      disabled={isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold px-5 py-2 flex items-center gap-1 cursor-pointer"
                    >
                      {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Approve & Create Account
                    </Button>
                  </>
                )}

                {selectedApp.status !== "PENDING" && (
                  <div className="text-xs text-slate-400 font-bold italic">
                    Reviewed on {new Date(selectedApp.updatedAt).toLocaleDateString("en-US")}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingApp && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-lg border border-slate-100 animate-in fade-in zoom-in-95 duration-200 text-slate-800">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                  {activeTab === "NGO" ? "Edit Organization Application" : "Edit Corporate Partner Application"}
                </span>
                <h3 className="font-heading font-bold text-xl text-slate-800 mt-1">
                  {activeTab === "NGO" ? editingApp.organizationName : editingApp.companyName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingApp(null)}
                className="h-8 w-8 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveEdit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
                
                {/* Section 1: Entity Information */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    {activeTab === "NGO" ? "Organization Details" : "Company Details"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeTab === "NGO" ? (
                      <>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Organization Name *</label>
                          <input
                            type="text"
                            required
                            value={editFormData.organizationName || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, organizationName: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Organization Type *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. NGO, Trust, Society, Foundation"
                            value={editFormData.organizationType || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, organizationType: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Registration Number *</label>
                          <input
                            type="text"
                            required
                            value={editFormData.ngoRegistrationNumber || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, ngoRegistrationNumber: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Year Established *</label>
                          <input
                            type="number"
                            required
                            value={editFormData.yearEstablished || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, yearEstablished: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Company Name *</label>
                          <input
                            type="text"
                            required
                            value={editFormData.companyName || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Industry *</label>
                          <input
                            type="text"
                            required
                            value={editFormData.industry || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, industry: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">GST Number *</label>
                          <input
                            type="text"
                            required
                            value={editFormData.gstNumber || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, gstNumber: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">CIN Number</label>
                          <input
                            type="text"
                            value={editFormData.cinNumber || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, cinNumber: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Section 2: Contact Representative */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Contact Representative
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Contact Person Name *</label>
                      <input
                        type="text"
                        required
                        value={editFormData.contactPersonName || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, contactPersonName: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Designation *</label>
                      <input
                        type="text"
                        required
                        value={editFormData.designation || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={editFormData.email || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Mobile Number *</label>
                      <input
                        type="text"
                        required
                        value={editFormData.mobileNumber || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, mobileNumber: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Website URL</label>
                      <input
                        type="url"
                        value={editFormData.website || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                        placeholder="https://example.org"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Address Details */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Address Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="col-span-1 sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        {activeTab === "NGO" ? "Complete Address *" : "Company Address *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={activeTab === "NGO" ? editFormData.completeAddress || "" : editFormData.companyAddress || ""}
                        onChange={(e) => {
                          if (activeTab === "NGO") {
                            setEditFormData({ ...editFormData, completeAddress: e.target.value });
                          } else {
                            setEditFormData({ ...editFormData, companyAddress: e.target.value });
                          }
                        }}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">City *</label>
                      <input
                        type="text"
                        required
                        value={editFormData.city || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                      />
                    </div>
                    {activeTab === "NGO" && (
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">District *</label>
                        <input
                          type="text"
                          required
                          value={editFormData.district || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">State *</label>
                      <input
                        type="text"
                        required
                        value={editFormData.state || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={editFormData.pincode || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, pincode: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Scale / Experience / Collaboration */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    {activeTab === "NGO" ? "Operational Details" : "Corporate Profile & Engagement"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeTab === "NGO" ? (
                      <>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Number of Volunteers *</label>
                          <input
                            type="number"
                            required
                            value={editFormData.numberOfVolunteers ?? ""}
                            onChange={(e) => setEditFormData({ ...editFormData, numberOfVolunteers: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Areas of Work *</label>
                          <input
                            type="text"
                            required
                            value={editFormData.areasOfWork || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, areasOfWork: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                        <div className="col-span-1 sm:col-span-2 space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Previous Campaign Experience</label>
                          <textarea
                            rows={2}
                            value={editFormData.previousExperience || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, previousExperience: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                        <div className="col-span-1 sm:col-span-2 space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Expected Collaboration</label>
                          <textarea
                            rows={2}
                            value={editFormData.expectedCollaboration || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, expectedCollaboration: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Employee Strength *</label>
                          <input
                            type="number"
                            required
                            value={editFormData.employeeStrength ?? ""}
                            onChange={(e) => setEditFormData({ ...editFormData, employeeStrength: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">CSR Budget Category *</label>
                          <input
                            type="text"
                            required
                            value={editFormData.csrBudgetCategory || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, csrBudgetCategory: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                        <div className="col-span-1 sm:col-span-2 space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Collaboration Interest *</label>
                          <input
                            type="text"
                            required
                            placeholder="Comma-separated e.g. Awareness Drives, Employee Volunteering, CSR Sponsorship"
                            value={editFormData.collaborationInterest || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, collaborationInterest: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Section 5: Status and Remarks */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Application Status & Remarks
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Verification Status</label>
                      <select
                        value={editFormData.status || "PENDING"}
                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800 font-medium"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="VERIFIED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                    <div className="col-span-1 sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Administrative Remarks</label>
                      <textarea
                        rows={2}
                        value={editFormData.remarks || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })}
                        placeholder="Admin notes or verification remarks..."
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 6: Document URLs */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Attached Document URLs
                  </h4>
                  <div className="space-y-3">
                    {activeTab === "NGO" ? (
                      <>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Registration Certificate URL</label>
                          <input
                            type="text"
                            value={editFormData.ngoCertificateUrl || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, ngoCertificateUrl: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Organization Logo URL</label>
                          <input
                            type="text"
                            value={editFormData.organizationLogoUrl || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, organizationLogoUrl: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Supporting Documents URL</label>
                          <input
                            type="text"
                            value={editFormData.supportingDocumentsUrl || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, supportingDocumentsUrl: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Company Logo URL</label>
                          <input
                            type="text"
                            value={editFormData.companyLogoUrl || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, companyLogoUrl: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">CSR Policy Document URL</label>
                          <input
                            type="text"
                            value={editFormData.csrPolicyUrl || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, csrPolicyUrl: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Supporting Documents URL</label>
                          <input
                            type="text"
                            value={editFormData.supportingDocumentsUrl || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, supportingDocumentsUrl: e.target.value })}
                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary bg-white text-slate-800"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>

              {/* Form Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold px-6 py-2 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSavingEdit}
                  className="bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold px-6 py-2 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingEdit ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
