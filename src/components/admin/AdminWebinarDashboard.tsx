"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createWebinarAction, editWebinarAction, deleteWebinarAction,
  updateWebinarStatusAction, uploadRecordingAction, uploadMaterialsAction,
  sendReminderAction, adjustAttendanceAction, generateCertificateForUser,
  approveWebinarAction, rejectWebinarAction
} from "@/app/actions/webinars";
import { formatDurationHumanReadable } from "@/lib/webinarPricing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Calendar, Clock, MapPin, Users, Award, ShieldCheck, Video,
  Trash2, Edit, Plus, FileText, CheckCircle, HelpCircle, Download, 
  ExternalLink, Loader2, Upload, BookOpen, Languages, ShieldAlert,
  Tag, AlertCircle, Sparkles, CheckCircle2, XCircle, Info, User, Building2
} from "lucide-react";

interface AdminWebinarDashboardProps {
  webinars: any[];
}

export default function AdminWebinarDashboard({ webinars }: AdminWebinarDashboardProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [showAttendeesId, setShowAttendeesId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fullContent, setFullContent] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [speakerName, setSpeakerName] = useState("");
  const [speakerImage, setSpeakerImage] = useState("");
  const [speakerBio, setSpeakerBio] = useState("");
  const [speakerQualification, setSpeakerQualification] = useState("");
  const [speakerSpecialization, setSpeakerSpecialization] = useState("");
  const [speakerHospital, setSpeakerHospital] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [webinarMode, setWebinarMode] = useState("Online");
  const [meetingLink, setMeetingLink] = useState("");
  const [maxSeats, setMaxSeats] = useState("100");
  const [category, setCategory] = useState("General");
  const [status, setStatus] = useState("DRAFT");
  const [language, setLanguage] = useState("English");
  const [meetingPlatform, setMeetingPlatform] = useState("Zoom");
  const [learningOutcomes, setLearningOutcomes] = useState("");
  const [eligibility, setEligibility] = useState("");

  // Modals / Selected Items State
  const [selectedWebinar, setSelectedWebinar] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [inputUrl, setInputUrl] = useState("");

  // Phase 2: Approval Status Filters & Review Modal State
  const [filterApprovalStatus, setFilterApprovalStatus] = useState<"ALL" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED">("ALL");
  const [reviewingWebinar, setReviewingWebinar] = useState<any | null>(null);
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Counts
  const pendingCount = webinars.filter(w => w.approvalStatus === "PENDING_APPROVAL").length;
  const approvedCount = webinars.filter(w => w.approvalStatus === "APPROVED" || !w.approvalStatus).length;
  const rejectedCount = webinars.filter(w => w.approvalStatus === "REJECTED").length;

  // Filtered list
  const filteredWebinars = webinars.filter(w => {
    if (filterApprovalStatus === "PENDING_APPROVAL") return w.approvalStatus === "PENDING_APPROVAL";
    if (filterApprovalStatus === "APPROVED") return w.approvalStatus === "APPROVED" || !w.approvalStatus;
    if (filterApprovalStatus === "REJECTED") return w.approvalStatus === "REJECTED";
    return true;
  });

  const handleApproveWebinar = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await approveWebinarAction(id);
      if (res.error) {
        alert(res.error);
      } else {
        setIsApproveConfirmOpen(false);
        setReviewingWebinar(null);
        router.refresh();
      }
    } catch (e: any) {
      alert(e.message || "Failed to approve webinar.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectWebinar = async (id: string) => {
    if (!rejectionReasonInput.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await rejectWebinarAction(id, rejectionReasonInput.trim());
      if (res.error) {
        alert(res.error);
      } else {
        setIsRejectModalOpen(false);
        setRejectionReasonInput("");
        setReviewingWebinar(null);
        router.refresh();
      }
    } catch (e: any) {
      alert(e.message || "Failed to reject webinar.");
    } finally {
      setActionLoading(false);
    }
  };

  // Manual Attendance State per attendee
  const [manualMinutes, setManualMinutes] = useState<{ [key: string]: string }>({});

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !speakerName || !date || !startTime || !endTime) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      title, description, fullContent, bannerImage, speakerName,
      speakerImage, speakerBio, date, startTime: `${date}T${startTime}`,
      endTime: `${date}T${endTime}`, venue, city, state, country,
      webinarMode, meetingLink, maxSeats, category, status,
      speakerQualification, speakerSpecialization, speakerHospital,
      language, meetingPlatform, learningOutcomes, eligibility
    };

    setIsPending(true);
    try {
      const res = await createWebinarAction(payload);
      if (res.success) {
        resetForm();
        setActiveTab("list");
        router.refresh();
      }
    } catch (e: any) {
      alert(e.message || "Failed to create webinar.");
    } finally {
      setIsPending(false);
    }
  };

  const handleEditSetup = (webinar: any) => {
    setSelectedWebinar(webinar);
    setIsEditMode(true);
    setTitle(webinar.title);
    setDescription(webinar.description);
    setFullContent(webinar.fullContent || "");
    setBannerImage(webinar.bannerImage || "");
    setSpeakerName(webinar.speakerName);
    setSpeakerImage(webinar.speakerImage || "");
    setSpeakerBio(webinar.speakerBio || "");
    setSpeakerQualification(webinar.speakerQualification || "");
    setSpeakerSpecialization(webinar.speakerSpecialization || "");
    setSpeakerHospital(webinar.speakerHospital || "");

    // Format Date string: yyyy-MM-dd
    const dateObj = new Date(webinar.date);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    setDate(`${yyyy}-${mm}-${dd}`);

    // Format times: HH:mm
    const formatTime = (dStr: string) => {
      const d = new Date(dStr);
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    };
    setStartTime(formatTime(webinar.startTime));
    setEndTime(formatTime(webinar.endTime));

    setVenue(webinar.venue || "");
    setCity(webinar.city || "");
    setState(webinar.state || "");
    setCountry(webinar.country || "");
    setWebinarMode(webinar.webinarMode);
    setMeetingLink(webinar.meetingLink);
    setMaxSeats(webinar.maxSeats.toString());
    setCategory(webinar.category);
    setStatus(webinar.status);
    setLanguage(webinar.language || "English");
    setMeetingPlatform(webinar.meetingPlatform || "Zoom");
    setLearningOutcomes(webinar.learningOutcomes || "");
    setEligibility(webinar.eligibility || "");

    setActiveTab("create");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWebinar) return;

    const payload = {
      title, description, fullContent, bannerImage, speakerName,
      speakerImage, speakerBio, date, startTime: `${date}T${startTime}`,
      endTime: `${date}T${endTime}`, venue, city, state, country,
      webinarMode, meetingLink, maxSeats, category, status,
      speakerQualification, speakerSpecialization, speakerHospital,
      language, meetingPlatform, learningOutcomes, eligibility
    };

    setIsPending(true);
    try {
      const res = await editWebinarAction(selectedWebinar.id, payload);
      if (res.success) {
        resetForm();
        setIsEditMode(false);
        setSelectedWebinar(null);
        setActiveTab("list");
        router.refresh();
      }
    } catch (e: any) {
      alert(e.message || "Failed to update webinar.");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this webinar? This will delete registrations and attendance history!")) return;
    try {
      await deleteWebinarAction(id);
      router.refresh();
    } catch (e: any) {
      alert(e.message || "Could not delete.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateWebinarStatusAction(id, newStatus);
      router.refresh();
    } catch (e: any) {
      alert(e.message || "Could not update status.");
    }
  };

  const handleRecordingUpload = async () => {
    if (!selectedWebinar) return;
    try {
      await uploadRecordingAction(selectedWebinar.id, inputUrl);
      setShowRecordingModal(false);
      setInputUrl("");
      router.refresh();
    } catch (e: any) {
      alert(e.message || "Failed to save.");
    }
  };

  const handleMaterialsUpload = async () => {
    if (!selectedWebinar) return;
    try {
      await uploadMaterialsAction(selectedWebinar.id, inputUrl);
      setShowMaterialsModal(false);
      setInputUrl("");
      router.refresh();
    } catch (e: any) {
      alert(e.message || "Failed to save.");
    }
  };

  const handleSendReminder = async (webinarId: string) => {
    setIsPending(true);
    try {
      const res = await sendReminderAction(webinarId);
      if (res.success) {
        alert(res.message);
      }
    } catch (e: any) {
      alert(e.message || "Failed to send reminder.");
    } finally {
      setIsPending(false);
    }
  };

  const handleAdjustAttendance = async (userId: string, webinarId: string) => {
    const minutes = manualMinutes[userId];
    if (!minutes || isNaN(parseFloat(minutes))) {
      alert("Please enter a valid number of stay minutes.");
      return;
    }

    setIsPending(true);
    try {
      const res = await adjustAttendanceAction(userId, webinarId, parseFloat(minutes));
      if (res.success) {
        alert("Attendance stay updated successfully!");
        router.refresh();
      }
    } catch (e: any) {
      alert(e.message || "Could not adjust attendance.");
    } finally {
      setIsPending(false);
    }
  };

  const handleTriggerCertificate = async (userId: string, webinarId: string) => {
    if (!confirm("Are you sure you want to manually trigger certificate generation for this user? This overrides standard percentage validations!")) return;
    
    setIsPending(true);
    try {
      const res = await generateCertificateForUser(userId, webinarId);
      if (res.success) {
        alert(`Certificate successfully created! ID: ${res.certificateNumber}`);
        router.refresh();
      } else {
        alert("Error: " + res.error);
      }
    } catch (e: any) {
      alert(e.message || "Certificate trigger failed.");
    } finally {
      setIsPending(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFullContent("");
    setBannerImage("");
    setSpeakerName("");
    setSpeakerImage("");
    setSpeakerBio("");
    setSpeakerQualification("");
    setSpeakerSpecialization("");
    setSpeakerHospital("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setVenue("");
    setCity("");
    setState("");
    setCountry("");
    setWebinarMode("Online");
    setMeetingLink("");
    setMaxSeats("100");
    setCategory("General");
    setStatus("DRAFT");
    setLanguage("English");
    setMeetingPlatform("Zoom");
    setLearningOutcomes("");
    setEligibility("");
    setIsEditMode(false);
    setSelectedWebinar(null);
  };

  // CSV Export registrations
  const handleExportCSV = (webinar: any) => {
    if (!webinar.registrations || webinar.registrations.length === 0) {
      alert("No registrations to export.");
      return;
    }

    const headers = ["Attendee Name", "Attendee Email", "Phone", "Gender", "Age", "City", "State", "Occupation", "Registration Date"];
    const rows = webinar.registrations.map((r: any) => [
      `"${r.name || r.user.name || 'Participant'}"`,
      `"${r.email || r.user.email}"`,
      `"${r.phone || 'N/A'}"`,
      `"${r.gender || 'N/A'}"`,
      `"${r.age || 'N/A'}"`,
      `"${r.city || 'N/A'}"`,
      `"${r.state || 'N/A'}"`,
      `"${r.occupation || 'N/A'}"`,
      `"${new Date(r.registeredAt).toLocaleString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map((e: any) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${webinar.title.replace(/\s+/g, "_")}_RSVP.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); if (val === "create" && !isEditMode) resetForm(); }} className="space-y-6">
        <TabsList className="bg-pink-50/50 border border-pink-100/50 p-1 rounded-xl">
          <TabsTrigger value="list" className="font-bold text-xs uppercase py-2 cursor-pointer">
            Webinars List
          </TabsTrigger>
          <TabsTrigger value="create" className="font-bold text-xs uppercase py-2 flex items-center gap-1 cursor-pointer">
            {isEditMode ? <Edit className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {isEditMode ? "Edit Webinar" : "Create Webinar"}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Webinars List */}
        <TabsContent value="list" className="space-y-6">
          {/* Phase 2: Approval Status Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-pink-50/40 p-3.5 rounded-2xl border border-pink-100">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFilterApprovalStatus("ALL")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  filterApprovalStatus === "ALL"
                    ? "bg-slate-800 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                All Webinars ({webinars.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterApprovalStatus("PENDING_APPROVAL")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterApprovalStatus === "PENDING_APPROVAL"
                    ? "bg-amber-500 text-white shadow-xs ring-2 ring-amber-300"
                    : pendingCount > 0
                    ? "bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 font-extrabold"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Pending Approval</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${filterApprovalStatus === "PENDING_APPROVAL" ? "bg-amber-700 text-white" : "bg-amber-200 text-amber-900"}`}>
                  {pendingCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterApprovalStatus("APPROVED")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterApprovalStatus === "APPROVED"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Approved ({approvedCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterApprovalStatus("REJECTED")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterApprovalStatus === "REJECTED"
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <XCircle className="h-3.5 w-3.5 text-red-500" />
                <span>Rejected ({rejectedCount})</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredWebinars.length === 0 ? (
              <Card className="rounded-3xl border border-pink-100/50 p-12 text-center text-slate-500">
                {filterApprovalStatus === "PENDING_APPROVAL"
                  ? "No paid webinars currently pending approval."
                  : filterApprovalStatus === "REJECTED"
                  ? "No webinars currently rejected."
                  : "No webinars found."}
              </Card>
            ) : (
              filteredWebinars.map((webinar) => {
                const totalRegistrations = webinar.registrations?.length || 0;
                const totalAttendance = webinar.attendance?.length || 0;
                const isPendingApproval = webinar.approvalStatus === "PENDING_APPROVAL";
                const doctorName = webinar.doctor?.user?.name || webinar.speakerName;
                const doctorSpecialty = webinar.speakerSpecialization || webinar.doctor?.specialty || "Specialist";
                const doctorHospital = webinar.speakerHospital || webinar.doctor?.hospitalAffiliation || "Medical Center";

                return (
                  <Card key={webinar.id} className={`rounded-3xl border shadow-sm overflow-hidden bg-white transition-all ${
                    isPendingApproval ? "border-amber-300 ring-2 ring-amber-100" : "border-pink-50 hover:border-pink-200/50"
                  }`}>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-start text-xs font-semibold text-slate-655">
                      
                      {/* Left: Metadata */}
                      <div className="md:col-span-2 space-y-3">
                        <div className="flex flex-wrap gap-2 items-center">
                          {/* Approval Status Badge */}
                          {webinar.approvalStatus === "APPROVED" || !webinar.approvalStatus ? (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" /> APPROVED
                            </span>
                          ) : webinar.approvalStatus === "PENDING_APPROVAL" ? (
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                              <Clock className="h-3 w-3 text-amber-500" /> PENDING APPROVAL
                            </span>
                          ) : (
                            <span className="bg-red-50 text-red-700 border border-red-200 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                              <XCircle className="h-3 w-3 text-red-500" /> REJECTED
                            </span>
                          )}

                          {/* Access Type Badge */}
                          {webinar.webinarType === "PAID" ? (
                            <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                              <Tag className="h-3 w-3 text-purple-600" /> PAID • ₹{webinar.registrationPrice}
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                              FREE
                            </span>
                          )}

                          {/* Lifecycle Status Badge */}
                          <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider border ${
                            webinar.status === "PUBLISHED"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : webinar.status === "COMPLETED"
                                ? "bg-slate-100 text-slate-500 border-slate-200"
                                : "bg-amber-50 text-amber-500 border-amber-100"
                          }`}>
                            {webinar.status}
                          </span>
                        </div>

                        <h3 className="font-heading text-lg font-black text-slate-800">{webinar.title}</h3>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">{webinar.description}</p>

                        {/* Doctor info line */}
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700 flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>
                            <strong>Dr. {doctorName}</strong> ({doctorSpecialty}) • <span className="text-slate-500">{doctorHospital}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-1 text-[11px] text-slate-550">
                          <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary shrink-0" /> {new Date(webinar.date).toLocaleDateString("en-US")}</div>
                          <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary shrink-0" /> {new Date(webinar.startTime).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}</div>
                          <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary shrink-0" /> {webinar.city || "Online"}</div>
                          <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary shrink-0" /> {totalRegistrations} Registered</div>
                        </div>
                      </div>

                      {/* Middle: Stats & Metrics */}
                      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-3">
                        <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">RSVPs & Analytics</h4>
                        <div className="space-y-1.5 font-medium text-slate-600">
                          <div className="flex justify-between">
                            <span>Max Seats:</span>
                            <span className="font-bold text-slate-800">{webinar.maxSeats}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Registrations:</span>
                            <span className="font-bold text-slate-800">{totalRegistrations}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Attendance Logs:</span>
                            <span className="font-bold text-emerald-600">{totalAttendance} logs</span>
                          </div>
                        </div>

                        {/* CSV trigger */}
                        <Button
                          onClick={() => handleExportCSV(webinar)}
                          disabled={totalRegistrations === 0}
                          size="sm"
                          variant="outline"
                          className="w-full border-pink-200 hover:bg-pink-50 rounded-xl text-[10px] uppercase font-bold flex items-center justify-center gap-1 h-8 cursor-pointer"
                        >
                          <Download className="h-3 w-3" /> Export RSVPs CSV
                        </Button>

                        <Button
                          onClick={() => setShowAttendeesId(showAttendeesId === webinar.id ? null : webinar.id)}
                          disabled={totalRegistrations === 0}
                          size="sm"
                          variant="outline"
                          className="w-full border-pink-200 hover:bg-pink-50 rounded-xl text-[10px] uppercase font-bold flex items-center justify-center gap-1 h-8 mt-1 cursor-pointer"
                        >
                          <Users className="h-3.5 w-3.5" /> {showAttendeesId === webinar.id ? "Hide Attendees" : "Manage Attendance"}
                        </Button>
                      </div>

                      {/* Right: Actions Buttons Grid */}
                      <div className="flex flex-col gap-2 justify-end h-full">
                        {/* Admin Review & Approve Button */}
                        <Button
                          onClick={() => setReviewingWebinar(webinar)}
                          className={`w-full rounded-xl text-[10px] uppercase font-bold py-2 h-auto cursor-pointer flex items-center justify-center gap-1 ${
                            isPendingApproval
                              ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                              : "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
                          }`}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          {isPendingApproval ? "Review & Approve" : "Review Details"}
                        </Button>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditSetup(webinar)}
                            variant="outline"
                            className="flex-1 border-pink-200 hover:bg-pink-50 rounded-xl text-[10px] uppercase font-bold py-2 h-auto cursor-pointer"
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(webinar.id)}
                            variant="outline"
                            className="border-red-200 hover:bg-red-50 text-red-500 rounded-xl text-[10px] uppercase font-bold py-2 h-auto cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {/* Status updates triggers */}
                        {webinar.status === "DRAFT" && (
                          <Button
                            onClick={() => handleStatusChange(webinar.id, "PUBLISHED")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] uppercase font-bold py-2 h-auto shadow-xs cursor-pointer"
                          >
                            Publish Webinar
                          </Button>
                        )}

                        {webinar.status === "PUBLISHED" && (
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleStatusChange(webinar.id, "COMPLETED")}
                                className="flex-1 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-[10px] uppercase font-bold py-2 h-auto cursor-pointer"
                              >
                                Complete
                              </Button>
                              <Button
                                onClick={() => handleStatusChange(webinar.id, "CANCELLED")}
                                variant="outline"
                                className="border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-[10px] uppercase font-bold py-2 h-auto cursor-pointer"
                              >
                                Cancel
                              </Button>
                            </div>
                            <Button
                              onClick={() => handleSendReminder(webinar.id)}
                              disabled={totalRegistrations === 0}
                              className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-[10px] uppercase font-bold py-2 h-auto cursor-pointer"
                            >
                              Send Reminder
                            </Button>
                          </div>
                        )}

                        {/* Media Upload triggers */}
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <Button
                            onClick={() => { setSelectedWebinar(webinar); setInputUrl(webinar.recordingUrl || ""); setShowRecordingModal(true); }}
                            variant="outline"
                            className="border-pink-200 rounded-xl text-[8px] uppercase font-extrabold p-1.5 h-auto text-slate-750 hover:bg-pink-50 cursor-pointer"
                          >
                            Upload Video
                          </Button>
                          <Button
                            onClick={() => { setSelectedWebinar(webinar); setInputUrl(webinar.materialsUrl || ""); setShowMaterialsModal(true); }}
                            variant="outline"
                            className="border-pink-200 rounded-xl text-[8px] uppercase font-extrabold p-1.5 h-auto text-slate-750 hover:bg-pink-50 cursor-pointer"
                          >
                            Upload Resource
                          </Button>
                        </div>

                      </div>

                    </div>

                    {/* Attendees & Attendance Management Panel */}
                    {showAttendeesId === webinar.id && webinar.registrations && (
                      <div className="px-6 pb-6 border-t border-slate-100 pt-5 animate-in slide-in-from-top-4 duration-200 text-slate-700 bg-slate-50/20">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Manage Attendance & Certificate Generation</h4>
                        <div className="overflow-x-auto rounded-xl border border-slate-100 max-h-[30rem] overflow-y-auto">
                          <table className="w-full text-left border-collapse text-[11px] text-slate-600 font-medium">
                            <thead>
                              <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black border-b border-slate-100">
                                <th className="p-3">Attendee Name</th>
                                <th className="p-3">Email Address</th>
                                <th className="p-3">Logged Stay</th>
                                <th className="p-3">Credits %</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3">Manual Override (Mins)</th>
                                <th className="p-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 bg-white">
                              {webinar.registrations.map((reg: any) => {
                                // Locate existing attendance log
                                const att = webinar.attendance?.find((a: any) => a.userId === reg.userId);
                                const stayedMins = att ? att.durationMinutes.toFixed(1) : "0.0";
                                const percent = att ? att.attendancePercentage.toFixed(0) : "0";
                                const isEligible = att ? att.certificateEligible : false;

                                return (
                                  <tr key={reg.id} className="hover:bg-slate-50/50">
                                    <td className="p-3 font-bold text-slate-800">{reg.name || reg.user.name || "Participant"}</td>
                                    <td className="p-3 font-mono text-slate-500">{reg.email || reg.user.email}</td>
                                    <td className="p-3 font-mono">{stayedMins} mins</td>
                                    <td className="p-3 font-mono font-bold text-slate-700">{percent}%</td>
                                    <td className="p-3 text-center">
                                      {isEligible ? (
                                        <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full text-[9px] font-black uppercase">
                                          Eligible
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-0.5 bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase">
                                          Ineligible
                                        </span>
                                      )}
                                    </td>
                                    <td className="p-2">
                                      <div className="flex gap-1.5 max-w-[120px]">
                                        <input
                                          type="number"
                                          placeholder="e.g. 45"
                                          value={manualMinutes[reg.userId] || ""}
                                          onChange={(e) => setManualMinutes(prev => ({ ...prev, [reg.userId]: e.target.value }))}
                                          className="w-16 bg-slate-50 border border-border rounded-lg px-1.5 py-1 text-center font-mono text-slate-800"
                                        />
                                        <Button 
                                          size="sm" 
                                          onClick={() => handleAdjustAttendance(reg.userId, webinar.id)}
                                          className="bg-primary text-white hover:bg-primary/95 text-[9px] h-7 rounded-lg"
                                        >
                                          Save
                                        </Button>
                                      </div>
                                    </td>
                                    <td className="p-2 text-right">
                                      <Button
                                        onClick={() => handleTriggerCertificate(reg.userId, webinar.id)}
                                        className="bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-[9px] font-bold h-7 px-3 py-1 cursor-pointer"
                                      >
                                        Issue Cert
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Tab 2: Create / Edit Form Wizard */}
        <TabsContent value="create">
          <Card className="rounded-3xl border border-pink-50 shadow-sm max-w-4xl mx-auto">
            <CardHeader className="border-b border-pink-50 pb-5">
              <CardTitle>{isEditMode ? "Edit Webinar Details" : "Create New Webinar"}</CardTitle>
              <CardDescription>Enter metadata details, speaker parameters, dates, and locations.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={isEditMode ? handleUpdate : handleCreate} className="space-y-6 text-sm text-slate-700">

                {/* Section: Main Meta */}
                <div className="space-y-4">
                  <h4 className="font-bold text-primary uppercase text-xs tracking-wider border-b border-pink-50 pb-1.5">General Parameters</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Webinar Title *</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Breast Cancer Screening Guidelines"
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Category *</label>
                      <input
                        type="text"
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Oncology, Volunteerism"
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-655">Short Description *</label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief 1-2 sentence overview shown in browse cards..."
                      rows={2}
                      className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-655">Full Content / Full Description</label>
                    <textarea
                      value={fullContent}
                      onChange={(e) => setFullContent(e.target.value)}
                      placeholder="Full outline, topics, and complete details of the program..."
                      rows={4}
                      className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Banner Image URL / File Upload</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={bannerImage.startsWith("data:") ? "Base64 Image Loaded" : bannerImage}
                          onChange={(e) => setBannerImage(e.target.value)}
                          placeholder="https://example.com/banner.jpg"
                          className="flex-1 bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            id="banner-file"
                            className="hidden"
                            onChange={(e) => handleImageFileChange(e, setBannerImage)}
                          />
                          <label htmlFor="banner-file" className="cursor-pointer bg-slate-100 hover:bg-pink-50 text-slate-700 hover:text-primary px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold flex items-center gap-1">
                            <Upload className="h-3.5 w-3.5" /> Upload
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Max Seats Available *</label>
                      <input
                        type="number"
                        required
                        value={maxSeats}
                        onChange={(e) => setMaxSeats(e.target.value)}
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Learning Outcomes and Eligibility textareas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Learning Outcomes (One outcome per line)</label>
                      <textarea
                        value={learningOutcomes}
                        onChange={(e) => setLearningOutcomes(e.target.value)}
                        placeholder="Understand early symptoms of cancer&#10;Perform breast checks correctly"
                        rows={3}
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Webinar Eligibility Rules</label>
                      <textarea
                        value={eligibility}
                        onChange={(e) => setEligibility(e.target.value)}
                        placeholder="Open to all medical professionals and student volunteers..."
                        rows={3}
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Speaker */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-primary uppercase text-xs tracking-wider border-b border-pink-50 pb-1.5">Speaker Parameters</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Speaker Name *</label>
                      <input
                        type="text"
                        required
                        value={speakerName}
                        onChange={(e) => setSpeakerName(e.target.value)}
                        placeholder="Dr. Shikha Yaduvanshi"
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Speaker Photo URL / File Upload</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={speakerImage.startsWith("data:") ? "Base64 Image Loaded" : speakerImage}
                          onChange={(e) => setSpeakerImage(e.target.value)}
                          placeholder="https://example.com/speaker.jpg"
                          className="flex-1 bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            id="speaker-file"
                            className="hidden"
                            onChange={(e) => handleImageFileChange(e, setSpeakerImage)}
                          />
                          <label htmlFor="speaker-file" className="cursor-pointer bg-slate-100 hover:bg-pink-50 text-slate-700 hover:text-primary px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold flex items-center gap-1">
                            <Upload className="h-3.5 w-3.5" /> Upload
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Speaker Qualification</label>
                      <input
                        type="text"
                        value={speakerQualification}
                        onChange={(e) => setSpeakerQualification(e.target.value)}
                        placeholder="MD Oncology, MBBS"
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Speaker Specialization</label>
                      <input
                        type="text"
                        value={speakerSpecialization}
                        onChange={(e) => setSpeakerSpecialization(e.target.value)}
                        placeholder="Breast Cancer Specialist"
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Speaker Hospital / Association</label>
                      <input
                        type="text"
                        value={speakerHospital}
                        onChange={(e) => setSpeakerHospital(e.target.value)}
                        placeholder="All India Institute of Medical Sciences"
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-655">Speaker Bio</label>
                    <textarea
                      value={speakerBio}
                      onChange={(e) => setSpeakerBio(e.target.value)}
                      placeholder="Degrees, affiliations, and professional backgrounds..."
                      rows={2}
                      className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                    />
                  </div>
                </div>

                {/* Section: Dates & Timing */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-primary uppercase text-xs tracking-wider border-b border-pink-50 pb-1.5">Timing & Schedule</h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Webinar Date *</label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Start Time *</label>
                      <input
                        type="time"
                        required
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">End Time *</label>
                      <input
                        type="time"
                        required
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Mode & Location details */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-primary uppercase text-xs tracking-wider border-b border-pink-50 pb-1.5">Venue & Mode Details</h4>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Webinar Mode *</label>
                      <select
                        value={webinarMode}
                        onChange={(e) => setWebinarMode(e.target.value)}
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800 text-sm"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Language *</label>
                      <input
                        type="text"
                        required
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Meeting Platform *</label>
                      <select
                        value={meetingPlatform}
                        onChange={(e) => setMeetingPlatform(e.target.value)}
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800 text-sm"
                      >
                        <option value="Zoom">Zoom</option>
                        <option value="Google Meet">Google Meet</option>
                        <option value="YouTube Live">YouTube Live</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Meeting Room Link *</label>
                      <input
                        type="text"
                        required
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        placeholder="https://zoom.us/j/meeting_id"
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Venue (Address)</label>
                      <input
                        type="text"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="e.g. Zoom Server / AIIMS Seminar Hall"
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="New Delhi"
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">State</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Delhi"
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-655">Country</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="India"
                        className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Status selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-655">Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800 text-sm"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="border-pink-200 rounded-xl px-6"
                  >
                    Reset Form
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-primary hover:bg-primary/95 text-white font-bold rounded-xl px-8 shadow-md cursor-pointer"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                      </span>
                    ) : (
                      isEditMode ? "Update Webinar" : "Create Webinar"
                    )}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Recording URL Modal */}
      {showRecordingModal && selectedWebinar && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-pink-100 p-6 max-w-md w-full space-y-4 text-slate-800 shadow-2xl">
            <h3 className="font-heading text-lg font-black text-slate-800">Upload Webinar Recording</h3>
            <p className="text-xs text-muted-foreground">Provide the public recording address (e.g. YouTube/Vimeo link) for attendees.</p>

            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full text-xs bg-slate-50 border border-border/80 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary/50 text-slate-800"
            />

            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => { setShowRecordingModal(false); setInputUrl(""); }} className="rounded-xl">Cancel</Button>
              <Button size="sm" onClick={handleRecordingUpload} className="bg-primary hover:bg-primary/95 text-white rounded-xl font-bold px-4">Save Recording</Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Materials URL Modal */}
      {showMaterialsModal && selectedWebinar && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-pink-100 p-6 max-w-md w-full space-y-4 text-slate-800 shadow-2xl">
            <h3 className="font-heading text-lg font-black text-slate-800">Upload Webinar Materials</h3>
            <p className="text-xs text-muted-foreground">Provide resource download folder, slides, or PDF worksheet document link.</p>

            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://drive.google.com/drive/..."
              className="w-full text-xs bg-slate-50 border border-border/80 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary/50 text-slate-800"
            />

            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => { setShowMaterialsModal(false); setInputUrl(""); }} className="rounded-xl">Cancel</Button>
              <Button size="sm" onClick={handleMaterialsUpload} className="bg-primary hover:bg-primary/95 text-white rounded-xl font-bold px-4">Save Materials</Button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------PHASE 2: ADMIN REVIEW & APPROVAL MODAL---------------- */}
      <Dialog open={!!reviewingWebinar} onOpenChange={() => { setReviewingWebinar(null); setIsApproveConfirmOpen(false); setIsRejectModalOpen(false); }}>
        <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-purple-100 shadow-2xl flex flex-col gap-0 overflow-hidden">
          <DialogHeader className="pb-3 border-b border-purple-50 shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <DialogTitle className="font-heading text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600 shrink-0" /> Admin Webinar Review
              </DialogTitle>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                  reviewingWebinar?.webinarType === "PAID"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }`}>
                  {reviewingWebinar?.webinarType === "PAID" ? `PAID • ₹${reviewingWebinar.registrationPrice}` : "FREE"}
                </span>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                  reviewingWebinar?.approvalStatus === "APPROVED" || !reviewingWebinar?.approvalStatus
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : reviewingWebinar?.approvalStatus === "PENDING_APPROVAL"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}>
                  {reviewingWebinar?.approvalStatus || "APPROVED"}
                </span>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs sm:text-sm custom-scrollbar pr-1">
            {/* SECTION 1: WEBINAR INFORMATION */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5 text-primary" /> Webinar Information
              </h4>
              <div className="space-y-1.5">
                <p className="font-bold text-base text-slate-800">{reviewingWebinar?.title}</p>
                <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                  {reviewingWebinar?.description || "No overview provided."}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div><strong className="text-slate-700">Category:</strong> {reviewingWebinar?.category}</div>
                <div><strong className="text-slate-700">Max Attendees:</strong> {reviewingWebinar?.maxSeats} Seats</div>
                <div><strong className="text-slate-700">Scheduled Date:</strong> {reviewingWebinar?.date ? new Date(reviewingWebinar.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}</div>
                <div><strong className="text-slate-700">Timing:</strong> {reviewingWebinar?.startTime ? new Date(reviewingWebinar.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "N/A"} - {reviewingWebinar?.endTime ? new Date(reviewingWebinar.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "N/A"}</div>
                <div><strong className="text-slate-700">Duration:</strong> {formatDurationHumanReadable(reviewingWebinar?.durationMinutes || 60)}</div>
                <div><strong className="text-slate-700">Platform / Link:</strong> {reviewingWebinar?.meetingPlatform || "Zoom"}</div>
              </div>
            </div>

            {/* SECTION 2: DOCTOR INFORMATION */}
            <div className="p-3.5 bg-pink-50/40 rounded-2xl border border-pink-100 space-y-2">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" /> Doctor Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div><strong className="text-slate-700">Doctor Name:</strong> Dr. {reviewingWebinar?.doctor?.user?.name || reviewingWebinar?.speakerName || "Medical Specialist"}</div>
                <div><strong className="text-slate-700">Doctor ID:</strong> <span className="font-mono">{reviewingWebinar?.doctor?.doctorId || reviewingWebinar?.doctorId || "DOC-VERIFIED"}</span></div>
                <div><strong className="text-slate-700">Specialty:</strong> {reviewingWebinar?.speakerSpecialization || reviewingWebinar?.doctor?.specialty || "Oncology Specialist"}</div>
                <div><strong className="text-slate-700">Hospital / Org:</strong> {reviewingWebinar?.speakerHospital || reviewingWebinar?.doctor?.hospitalAffiliation || "Specialist Care Hospital"}</div>
              </div>
            </div>

            {/* SECTION 3: PRICING INFORMATION */}
            <div className="p-3.5 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
              <h4 className="font-black text-xs uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-purple-600" /> Pricing Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-purple-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Webinar Access Type</p>
                  <p className="font-black text-slate-800 text-sm mt-0.5">{reviewingWebinar?.webinarType || "FREE"}</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-purple-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Registration Price</p>
                  <p className="font-black text-purple-700 text-sm mt-0.5">₹{reviewingWebinar?.registrationPrice || 0}</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-purple-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Platform Policy Minimum</p>
                  <p className="font-black text-purple-900 text-sm mt-0.5">₹{reviewingWebinar?.minimumAllowedPrice || 0}</p>
                </div>
              </div>
            </div>

            {/* SECTION 4: APPROVAL INFORMATION */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Approval Status &amp; History
              </h4>
              <p className="text-xs text-slate-700">
                Current Status: <strong className="uppercase font-extrabold text-slate-800">{reviewingWebinar?.approvalStatus || "APPROVED"}</strong>
              </p>
              {reviewingWebinar?.approvalRejectionReason && (
                <div className="p-2.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 space-y-1 mt-1">
                  <p className="font-bold uppercase text-[10px] text-red-500">Rejection Reason On Record:</p>
                  <p>{reviewingWebinar.approvalRejectionReason}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer with Approve & Reject Actions */}
          <DialogFooter className="pt-3 border-t border-slate-100 shrink-0 flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-2">
            <Button variant="outline" onClick={() => setReviewingWebinar(null)} className="w-full sm:w-auto text-xs font-bold rounded-xl">
              Close
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                type="button"
                onClick={() => setIsRejectModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl px-4 py-2 flex items-center gap-1 justify-center cursor-pointer"
              >
                <XCircle className="h-4 w-4" /> Reject Webinar
              </Button>
              <Button
                type="button"
                onClick={() => setIsApproveConfirmOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl px-5 py-2 flex items-center gap-1 justify-center cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" /> Approve Webinar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* APPROVAL CONFIRMATION DIALOG */}
      <Dialog open={isApproveConfirmOpen} onOpenChange={setIsApproveConfirmOpen}>
        <DialogContent className="max-w-md bg-white rounded-3xl p-6 border border-emerald-100 shadow-2xl space-y-4">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" /> Approve Paid Webinar?
            </DialogTitle>
          </DialogHeader>

          <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-emerald-900 leading-relaxed space-y-2">
            <p className="font-bold text-sm">Once approved, this webinar will become publicly visible and users will be able to register.</p>
            <div className="pt-1 space-y-0.5 text-slate-700">
              <p>Webinar: <strong>"{reviewingWebinar?.title}"</strong></p>
              <p>Price: <strong>₹{reviewingWebinar?.registrationPrice}</strong></p>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsApproveConfirmOpen(false)} disabled={actionLoading} className="text-xs font-bold rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={() => handleApproveWebinar(reviewingWebinar.id)}
              disabled={actionLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl px-5 shadow-xs cursor-pointer"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yes, Approve Webinar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REJECTION REASON DIALOG */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="max-w-md bg-white rounded-3xl p-6 border border-red-100 shadow-2xl space-y-4">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-black text-slate-800 flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-600 shrink-0" /> Reject Paid Webinar
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Please state the reason for rejecting <strong>"{reviewingWebinar?.title}"</strong>. The doctor will see this feedback in their dashboard and can correct the details before resubmitting.
            </p>

            <div className="space-y-1">
              <label className="font-black uppercase text-[10px] text-slate-500 tracking-wider">
                Reason for rejection *
              </label>
              <textarea
                rows={4}
                placeholder="Explain what needs to be corrected before this webinar can be approved..."
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
              onClick={() => handleRejectWebinar(reviewingWebinar.id)}
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
