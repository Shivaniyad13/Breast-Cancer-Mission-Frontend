"use client";

import { useState } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Video,
  FileImage,
  Upload,
  Loader2,
  Calendar,
  MapPin,
  Clock,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  createLiveUpdate, 
  updateLiveUpdate, 
  deleteLiveUpdate, 
  reorderLiveUpdates 
} from "@/app/actions/liveUpdates";

interface LiveUpdate {
  id: string;
  category: string;
  imageUrl: string | null;
  title: string;
  shortDescription: string;
  fullDescription: string | null;
  eventDate: Date | null;
  eventTime: string | null;
  venue: string | null;
  speakerName: string | null;
  registrationLink: string | null;
  externalLink: string | null;
  isFeatured: boolean;
  isActive: boolean;
  publishDate: Date | null;
  expiryDate: Date | null;
  orderIndex: number;
}

interface AdminLiveUpdatesDashboardProps {
  initialUpdates: LiveUpdate[];
}

export default function AdminLiveUpdatesDashboard({ initialUpdates }: AdminLiveUpdatesDashboardProps) {
  const [updates, setUpdates] = useState<LiveUpdate[]>(initialUpdates);
  
  // Dialog controls
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<LiveUpdate | null>(null);

  // Form states
  const [category, setCategory] = useState("Webinar");
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [venue, setVenue] = useState("");
  const [speakerName, setSpeakerName] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [publishDate, setPublishDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // Status indicators
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // File Upload Helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
        setMessage({ text: "Poster uploaded successfully!", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to upload poster image.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "An error occurred during file upload.", type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setCategory("Webinar");
    setImageUrl("");
    setTitle("");
    setShortDescription("");
    setFullDescription("");
    setEventDate("");
    setEventTime("");
    setVenue("");
    setSpeakerName("");
    setRegistrationLink("");
    setExternalLink("");
    setIsFeatured(false);
    setIsActive(true);
    setPublishDate("");
    setExpiryDate("");
  };

  // Submit Add
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);

    try {
      const res = await createLiveUpdate({
        category,
        imageUrl: imageUrl || undefined,
        title,
        shortDescription,
        fullDescription: fullDescription || undefined,
        eventDate: eventDate ? new Date(eventDate) : null,
        eventTime: eventTime || undefined,
        venue: venue || undefined,
        speakerName: speakerName || undefined,
        registrationLink: registrationLink || undefined,
        externalLink: externalLink || undefined,
        isFeatured,
        isActive,
        publishDate: publishDate ? new Date(publishDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null
      });

      if (res.success && res.update) {
        setUpdates(prev => [...prev, res.update as any].sort((a, b) => a.orderIndex - b.orderIndex));
        setIsAddOpen(false);
        resetForm();
        setMessage({ text: "New Live Updates Hub card added successfully!", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to add update.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    } finally {
      setIsPending(false);
    }
  };

  // Open Edit Dialog
  const openEditDialog = (item: LiveUpdate) => {
    setEditingUpdate(item);
    setCategory(item.category);
    setImageUrl(item.imageUrl || "");
    setTitle(item.title);
    setShortDescription(item.shortDescription);
    setFullDescription(item.fullDescription || "");
    setEventDate(item.eventDate ? new Date(item.eventDate).toISOString().substring(0, 10) : "");
    setEventTime(item.eventTime || "");
    setVenue(item.venue || "");
    setSpeakerName(item.speakerName || "");
    setRegistrationLink(item.registrationLink || "");
    setExternalLink(item.externalLink || "");
    setIsFeatured(item.isFeatured);
    setIsActive(item.isActive);
    setPublishDate(item.publishDate ? new Date(item.publishDate).toISOString().substring(0, 10) : "");
    setExpiryDate(item.expiryDate ? new Date(item.expiryDate).toISOString().substring(0, 10) : "");
    setIsEditOpen(true);
  };

  // Submit Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUpdate) return;
    setIsPending(true);
    setMessage(null);

    try {
      const res = await updateLiveUpdate(editingUpdate.id, {
        category,
        imageUrl: imageUrl || null,
        title,
        shortDescription,
        fullDescription: fullDescription || null,
        eventDate: eventDate ? new Date(eventDate) : null,
        eventTime: eventTime || null,
        venue: venue || null,
        speakerName: speakerName || null,
        registrationLink: registrationLink || null,
        externalLink: externalLink || null,
        isFeatured,
        isActive,
        publishDate: publishDate ? new Date(publishDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null
      });

      if (res.success && res.update) {
        setUpdates(prev => prev.map(u => u.id === editingUpdate.id ? { ...u, ...res.update } as any : u).sort((x, y) => x.orderIndex - y.orderIndex));
        setIsEditOpen(false);
        resetForm();
        setMessage({ text: "Live Updates Hub details updated successfully!", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to update details.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    } finally {
      setIsPending(false);
    }
  };

  // Handle Delete update
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this live update card?")) return;
    setMessage(null);

    try {
      const res = await deleteLiveUpdate(id);
      if (res.success) {
        setUpdates(prev => prev.filter(u => u.id !== id));
        setMessage({ text: "Live update card deleted successfully.", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to delete update.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    }
  };

  // Toggle active state
  const handleToggleActive = async (item: LiveUpdate) => {
    setMessage(null);
    try {
      const res = await updateLiveUpdate(item.id, { isActive: !item.isActive });
      if (res.success && res.update) {
        setUpdates(prev => prev.map(u => u.id === item.id ? { ...u, isActive: res.update.isActive } as any : u));
        setMessage({ text: `Update ${!item.isActive ? 'enabled' : 'disabled'} successfully!`, type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to toggle status.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    }
  };

  // Reorder
  const handleMove = async (index: number, direction: "UP" | "DOWN") => {
    const nextIndex = direction === "UP" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= updates.length) return;

    setMessage(null);
    const list = [...updates];
    const temp = list[index];
    list[index] = list[nextIndex];
    list[nextIndex] = temp;

    try {
      const ids = list.map(item => item.id);
      const res = await reorderLiveUpdates(ids);
      if (res.success) {
        setUpdates(list.map((item, idx) => ({ ...item, orderIndex: idx })));
        setMessage({ text: "Updates reordered successfully!", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to apply reordering.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast alert */}
      {message && (
        <div 
          onClick={() => setMessage(null)}
          className={`p-4 rounded-xl flex items-center justify-between cursor-pointer border shadow-sm transition-all animate-in fade-in slide-in-from-top-4 ${
            message.type === "success" 
              ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{message.text}</span>
          </div>
          <span className="text-xs opacity-60">Dismiss</span>
        </div>
      )}

      {/* Stats and Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">Active Homepage Live Updates</h3>
          <p className="text-xs text-muted-foreground">Manage active webinars, walkathons, camps, campaigns, or innovation news inside the left sidebar widgets.</p>
        </div>

        <Button
          onClick={() => {
            resetForm();
            setIsAddOpen(true);
          }}
          className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold shadow rounded-xl text-xs py-4.5 cursor-pointer flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Live Update
        </Button>
      </div>

      {/* Main List Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                <th className="p-4 pl-6 w-16 text-center">Order</th>
                <th className="p-4">Update Details</th>
                <th className="p-4">Date & Venue</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {updates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-12 text-muted-foreground">
                    No live updates found. Click Add to create one!
                  </td>
                </tr>
              ) : (
                updates.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-slate-50/40 transition-colors ${!item.isActive && 'opacity-65'}`}>
                    
                    {/* Order column */}
                    <td className="p-4 pl-6 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          onClick={() => handleMove(index, "UP")}
                          disabled={index === 0}
                          className="h-5 w-5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-500"
                        >
                          <ArrowUp className="h-3.5 w-3.5 mx-auto" />
                        </button>
                        <span className="text-xs font-black text-slate-700">{index + 1}</span>
                        <button
                          onClick={() => handleMove(index, "DOWN")}
                          disabled={index === updates.length - 1}
                          className="h-5 w-5 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-500"
                        >
                          <ArrowDown className="h-3.5 w-3.5 mx-auto" />
                        </button>
                      </div>
                    </td>

                    {/* Column 2: Info */}
                    <td className="p-4 flex gap-3.5 items-center">
                      <div className="relative h-12 w-16 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="thumbnail" className="w-full h-full object-cover" />
                        ) : (
                          <FileImage className="h-5 w-5 text-slate-400" />
                        )}
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded font-black uppercase border border-pink-200/50">
                            {item.category}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-800 truncate max-w-xs">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">{item.shortDescription}</p>
                      </div>
                    </td>

                    {/* Column 3: Event info */}
                    <td className="p-4 space-y-1">
                      {item.eventDate ? (
                        <div className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-pink-500" />
                          {new Date(item.eventDate).toLocaleDateString("en-US")}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No Date</span>
                      )}
                      {item.venue && (
                        <div className="text-[10px] text-muted-foreground flex items-center gap-0.5 max-w-[150px] truncate">
                          <MapPin className="h-3 w-3" />
                          {item.venue}
                        </div>
                      )}
                    </td>

                    {/* Column 4: Featured */}
                    <td className="p-4 text-xs">
                      {item.isFeatured ? (
                        <span className="text-xs font-extrabold text-amber-600 inline-flex items-center gap-0.5">
                          <Sparkles className="h-3 w-3 fill-amber-500 text-amber-500" /> Featured
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">No</span>
                      )}
                    </td>

                    {/* Column 5: Status */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border ${
                          item.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {item.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {item.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>

                    {/* Column 6: Edit / Delete */}
                    <td className="p-4 text-right pr-6 space-x-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(item)}
                        className="h-8 w-8 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Home Page Live Update</DialogTitle>
            <DialogDescription>Create a webinar, campaign, walkathon, check-up camp, or research update card.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="addCategory">Category</Label>
                <select
                  id="addCategory"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Webinar">Upcoming Webinar</option>
                  <option value="Campaign">Awareness Campaign</option>
                  <option value="News">Breast Cancer News</option>
                  <option value="Event">Screening/Healthcare Event</option>
                  <option value="Research">Research & Innovation</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="addDate">Event Date (Optional)</Label>
                <Input
                  id="addDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="addTime">Event Time (Optional)</Label>
                <Input
                  id="addTime"
                  placeholder="e.g. 14:30 or 10:00 AM"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addVenue">Venue / Location (Optional)</Label>
                <Input
                  id="addVenue"
                  placeholder="e.g. Zoom meeting, TMH Room 3"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="addSpeaker">Speaker Name (For Webinars)</Label>
                <Input
                  id="addSpeaker"
                  placeholder="e.g. Dr. Jyoti Bajpai"
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addRegLink">Registration Link / Destination URL</Label>
                <Input
                  id="addRegLink"
                  placeholder="e.g. /webinars or external page"
                  value={registrationLink}
                  onChange={(e) => setRegistrationLink(e.target.value)}
                />
              </div>
            </div>

            {/* Poster upload */}
            <div className="space-y-1.5">
              <Label>Cover Poster Image (Optional)</Label>
              <div className="flex gap-4 items-center">
                {imageUrl && (
                  <div className="h-12 w-16 rounded overflow-hidden border flex-shrink-0">
                    <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="relative flex-1 border border-dashed rounded-lg p-2.5 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-pink-600">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Click to upload image poster"}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="addTitle">Update Title</Label>
              <Input
                id="addTitle"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="addShortDesc">Short Description (2-3 lines)</Label>
              <textarea
                id="addShortDesc"
                rows={2}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Give a brief summary..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="addFullDesc">Full Detailed Content / Agenda (Optional)</Label>
              <textarea
                id="addFullDesc"
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Provide detailed description..."
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="addPublish">Publish Date (Optional)</Label>
                <Input
                  id="addPublish"
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addExpiry">Expiry Date (Optional)</Label>
                <Input
                  id="addExpiry"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-6 items-center">
              <div className="flex items-center gap-2">
                <input
                  id="addActive"
                  type="checkbox"
                  className="h-4.5 w-4.5 rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <Label htmlFor="addActive" className="text-xs font-semibold cursor-pointer select-none">
                  Enable update immediately
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="addFeatured"
                  type="checkbox"
                  className="h-4.5 w-4.5 rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <Label htmlFor="addFeatured" className="text-xs font-semibold cursor-pointer select-none">
                  Mark as Featured Update
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || isUploading} className="bg-pink-600 hover:bg-pink-700 text-white font-bold">
                {isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
                Add Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Home Page Live Update</DialogTitle>
            <DialogDescription>Modify details and click save changes.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="editCategory">Category</Label>
                <select
                  id="editCategory"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Webinar">Upcoming Webinar</option>
                  <option value="Campaign">Awareness Campaign</option>
                  <option value="News">Breast Cancer News</option>
                  <option value="Event">Screening/Healthcare Event</option>
                  <option value="Research">Research & Innovation</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="editDate">Event Date (Optional)</Label>
                <Input
                  id="editDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="editTime">Event Time (Optional)</Label>
                <Input
                  id="editTime"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editVenue">Venue / Location (Optional)</Label>
                <Input
                  id="editVenue"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="editSpeaker">Speaker Name</Label>
                <Input
                  id="editSpeaker"
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editRegLink">Registration Link</Label>
                <Input
                  id="editRegLink"
                  value={registrationLink}
                  onChange={(e) => setRegistrationLink(e.target.value)}
                />
              </div>
            </div>

            {/* Poster image upload */}
            <div className="space-y-1.5">
              <Label>Poster Image</Label>
              <div className="flex gap-4 items-center">
                {imageUrl && (
                  <div className="h-12 w-16 rounded overflow-hidden border flex-shrink-0">
                    <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="relative flex-1 border border-dashed rounded-lg p-2.5 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-pink-600">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Click to replace poster image"}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editTitle">Update Title</Label>
              <Input
                id="editTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editShortDesc">Short Description</Label>
              <textarea
                id="editShortDesc"
                rows={2}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editFullDesc">Full Detailed Content</Label>
              <textarea
                id="editFullDesc"
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="editPublish">Publish Date (Optional)</Label>
                <Input
                  id="editPublish"
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editExpiry">Expiry Date (Optional)</Label>
                <Input
                  id="editExpiry"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-6 items-center">
              <div className="flex items-center gap-2">
                <input
                  id="editActive"
                  type="checkbox"
                  className="h-4.5 w-4.5 rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <Label htmlFor="editActive" className="text-xs font-semibold cursor-pointer select-none">
                  Enable update immediately
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="editFeatured"
                  type="checkbox"
                  className="h-4.5 w-4.5 rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(item => !item)}
                />
                <Label htmlFor="editFeatured" className="text-xs font-semibold cursor-pointer select-none">
                  Mark as Featured Update
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || isUploading} className="bg-pink-600 hover:bg-pink-700 text-white font-bold">
                {isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
