"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, CheckCircle, XCircle, Plus, Calendar, MapPin, Users, Loader2, Sparkles, AlertCircle } from "lucide-react";

export interface ApplicationItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  age: number;
  occupation: string;
  interest: string;
  availability: string;
  motivation: string;
  status: string;
  createdAt: string;
}

export interface FeedbackItem {
  id: string;
  volunteerName: string;
  city: string;
  rating: number;
  message: string;
  status: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  submittedBy: string;
  status: string;
  createdAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  slots: number;
  filledSlots: number;
  interestKey: string;
  isOpen: boolean;
}

interface VolunteersAdminClientProps {
  initialApplications: ApplicationItem[];
  initialFeedbacks: FeedbackItem[];
  initialGallery: GalleryItem[];
  initialEvents: EventItem[];
}

export default function VolunteersAdminClient({
  initialApplications,
  initialFeedbacks,
  initialGallery,
  initialEvents,
}: VolunteersAdminClientProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Event modal state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventSubmitting, setEventSubmitting] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    slots: 20,
    interestKey: "outreach",
    isOpen: true,
  });

  const renderStatusBadge = (status: string) => {
    if (status === "VERIFIED" || status === "APPROVED") {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
          <CheckCircle className="w-3 h-3" /> Verified
        </span>
      );
    }
    if (status === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
          <XCircle className="w-3 h-3" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
        <Sparkles className="w-3 h-3" /> Pending Review
      </span>
    );
  };

  // Application Verify/Reject
  const handleVerifyApplication = async (id: string, status: "VERIFIED" | "REJECTED", rejectionReason?: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/volunteers/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to update volunteer application");
      } else {
        router.refresh();
      }
    } catch (err: any) {
      alert(err.message || "Failed to submit decision");
    } finally {
      setLoadingId(null);
    }
  };

  // Feedback Approve/Reject
  const handleUpdateFeedbackStatus = async (id: string, status: "VERIFIED" | "REJECTED") => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/volunteers/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to update feedback status");
      } else {
        router.refresh();
      }
    } catch (err: any) {
      alert(err.message || "Failed to update feedback status");
    } finally {
      setLoadingId(null);
    }
  };

  // Gallery Approve/Reject
  const handleUpdateGalleryStatus = async (id: string, status: "VERIFIED" | "REJECTED") => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/volunteers/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to update gallery submission status");
      } else {
        router.refresh();
      }
    } catch (err: any) {
      alert(err.message || "Failed to update gallery status");
    } finally {
      setLoadingId(null);
    }
  };

  // Event Toggle Open/Close
  const handleToggleEventOpen = async (id: string, currentIsOpen: boolean) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/volunteers/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpen: !currentIsOpen }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to toggle event status");
      } else {
        router.refresh();
      }
    } catch (err: any) {
      alert(err.message || "Failed to toggle event status");
    } finally {
      setLoadingId(null);
    }
  };

  // Event Create Submit
  const handleCreateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventError(null);
    if (!eventForm.title || !eventForm.location || !eventForm.eventDate) {
      setEventError("Please fill out all required fields.");
      return;
    }
    setEventSubmitting(true);
    try {
      const res = await fetch("/api/volunteers/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setEventError(data.error || "Failed to create event");
      } else {
        setIsEventModalOpen(false);
        setEventForm({
          title: "",
          description: "",
          location: "",
          eventDate: "",
          slots: 20,
          interestKey: "outreach",
          isOpen: true,
        });
        router.refresh();
      }
    } catch (err: any) {
      setEventError(err.message || "Something went wrong creating event");
    } finally {
      setEventSubmitting(false);
    }
  };

  return (
    <Tabs defaultValue="applications" className="space-y-6">
      <TabsList className="bg-slate-100 p-1 rounded-xl flex border border-slate-200/60 max-w-xl">
        <TabsTrigger value="applications" className="rounded-lg font-semibold text-xs py-2">
          Applications ({initialApplications.length})
        </TabsTrigger>
        <TabsTrigger value="feedback" className="rounded-lg font-semibold text-xs py-2">
          Feedback ({initialFeedbacks.length})
        </TabsTrigger>
        <TabsTrigger value="gallery" className="rounded-lg font-semibold text-xs py-2">
          Gallery ({initialGallery.length})
        </TabsTrigger>
        <TabsTrigger value="events" className="rounded-lg font-semibold text-xs py-2">
          Events ({initialEvents.length})
        </TabsTrigger>
      </TabsList>

      {/* ================= TAB 1: APPLICATIONS ================= */}
      <TabsContent value="applications">
        <Card className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Volunteer Applications</h2>
              <p className="text-xs text-slate-500">Review and verify incoming volunteer registration requests.</p>
            </div>
          </div>

          {initialApplications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">No volunteer applications submitted yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/60">
                  <tr>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Interest</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {initialApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {app.fullName}
                        <span className="block text-[10px] text-slate-400 font-normal">Age: {app.age} · {app.occupation}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {app.email}
                        <span className="block text-[10px] text-slate-400">{app.phone}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{app.city}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px] uppercase">
                          {app.interest}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{renderStatusBadge(app.status)}</td>
                      <td className="py-3.5 px-4 text-right">
                        {app.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              disabled={loadingId === app.id}
                              onClick={() => handleVerifyApplication(app.id, "VERIFIED")}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold h-7 px-3 rounded-lg shadow-sm"
                            >
                              {loadingId === app.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Verify"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={loadingId === app.id}
                              onClick={() => {
                                const reason = window.prompt("Enter rejection reason (optional):");
                                if (reason !== null) {
                                  handleVerifyApplication(app.id, "REJECTED", reason);
                                }
                              }}
                              className="border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-semibold h-7 px-3 rounded-lg"
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No action needed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </TabsContent>

      {/* ================= TAB 2: FEEDBACK ================= */}
      <TabsContent value="feedback">
        <Card className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Community Feedback & Testimonials</h2>
              <p className="text-xs text-slate-500">Approve volunteer reviews to publish on the public testimonials board.</p>
            </div>
          </div>

          {initialFeedbacks.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">No volunteer feedback submitted yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/60">
                  <tr>
                    <th className="py-3 px-4">Volunteer</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Message</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {initialFeedbacks.map((fb) => (
                    <tr key={fb.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{fb.volunteerName}</td>
                      <td className="py-3.5 px-4 text-slate-700">{fb.city || "—"}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < fb.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">{fb.message}</td>
                      <td className="py-3.5 px-4">{renderStatusBadge(fb.status)}</td>
                      <td className="py-3.5 px-4 text-right">
                        {fb.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              disabled={loadingId === fb.id}
                              onClick={() => handleUpdateFeedbackStatus(fb.id, "VERIFIED")}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold h-7 px-3 rounded-lg shadow-sm"
                            >
                              {loadingId === fb.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Approve"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={loadingId === fb.id}
                              onClick={() => handleUpdateFeedbackStatus(fb.id, "REJECTED")}
                              className="border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-semibold h-7 px-3 rounded-lg"
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </TabsContent>

      {/* ================= TAB 3: GALLERY ================= */}
      <TabsContent value="gallery">
        <Card className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Gallery Media Submissions</h2>
              <p className="text-xs text-slate-500">Approve photo uploads from volunteers to display in the public archive gallery.</p>
            </div>
          </div>

          {initialGallery.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">No media uploaded to gallery yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialGallery.map((item) => (
                <Card key={item.id} className="border border-slate-200/60 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="h-40 w-full overflow-hidden bg-slate-100 relative">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{item.title}</h4>
                        {renderStatusBadge(item.status)}
                      </div>
                      <p className="text-xs text-slate-500">Submitted by <span className="font-semibold text-slate-700">{item.submittedBy}</span></p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2">
                    {item.status === "PENDING" ? (
                      <>
                        <Button
                          size="sm"
                          disabled={loadingId === item.id}
                          onClick={() => handleUpdateGalleryStatus(item.id, "VERIFIED")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold h-8 px-4 rounded-lg shadow-sm"
                        >
                          {loadingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={loadingId === item.id}
                          onClick={() => handleUpdateGalleryStatus(item.id, "REJECTED")}
                          className="border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-semibold h-8 px-3 rounded-lg"
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Reviewed</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </TabsContent>

      {/* ================= TAB 4: EVENTS ================= */}
      <TabsContent value="events">
        <Card className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Volunteer Events & Drives</h2>
              <p className="text-xs text-slate-500">Post upcoming volunteer opportunities and manage slot capacity.</p>
            </div>
            <Button
              onClick={() => setIsEventModalOpen(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl px-4 py-2.5 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Event
            </Button>
          </div>

          {initialEvents.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">No volunteer events created yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/60">
                  <tr>
                    <th className="py-3 px-4">Event Title</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Slots (Filled / Total)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {initialEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {evt.title}
                        <span className="block text-[10px] text-slate-400 font-normal">Category: {evt.interestKey}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {evt.location}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(evt.eventDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          <Users className="w-3 h-3 text-slate-500" /> {evt.filledSlots} / {evt.slots}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {evt.isOpen ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                            Open
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                            Closed
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={loadingId === evt.id}
                          onClick={() => handleToggleEventOpen(evt.id, evt.isOpen)}
                          className="border-slate-300 text-slate-700 hover:bg-slate-100 text-[11px] font-semibold h-7 px-3 rounded-lg"
                        >
                          {loadingId === evt.id ? <Loader2 className="w-3 h-3 animate-spin" /> : evt.isOpen ? "Close Registrations" : "Reopen Event"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </TabsContent>

      {/* ================= CREATE EVENT MODAL ================= */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Create Volunteer Event</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateEventSubmit} className="space-y-4 pt-2">
            {eventError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{eventError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Event Title *</Label>
              <Input
                required
                placeholder="e.g. Community Screening Camp - Mumbai"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                className="rounded-xl border-slate-200 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Location *</Label>
              <Input
                required
                placeholder="e.g. Bandra Community Center, Mumbai"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                className="rounded-xl border-slate-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Event Date & Time *</Label>
                <Input
                  required
                  type="datetime-local"
                  value={eventForm.eventDate}
                  onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                  className="rounded-xl border-slate-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Capacity (Slots) *</Label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={eventForm.slots}
                  onChange={(e) => setEventForm({ ...eventForm, slots: Number(e.target.value) })}
                  className="rounded-xl border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Category / Interest Key *</Label>
              <Select
                value={eventForm.interestKey}
                onValueChange={(val) => setEventForm({ ...eventForm, interestKey: val || "outreach" })}
              >
                <SelectTrigger className="rounded-xl border-slate-200 text-xs">
                  <SelectValue placeholder="Select interest" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-white border border-slate-200">
                  <SelectItem value="outreach">Outreach & Awareness</SelectItem>
                  <SelectItem value="camps">Checkup Camps</SelectItem>
                  <SelectItem value="counseling">Patient Support</SelectItem>
                  <SelectItem value="media">Media & Content</SelectItem>
                  <SelectItem value="general">General Volunteer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Description</Label>
              <Textarea
                rows={3}
                placeholder="Details about tasks, requirements, venue directions..."
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                className="rounded-xl border-slate-200 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEventModalOpen(false)}
                className="rounded-xl text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={eventSubmitting}
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl px-5"
              >
                {eventSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save & Post Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
