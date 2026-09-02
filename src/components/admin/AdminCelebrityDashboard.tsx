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
  Loader2
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
  createCelebrityTestimonial, 
  updateCelebrityTestimonial, 
  deleteCelebrityTestimonial, 
  reorderCelebrityTestimonials 
} from "@/app/actions/rightSidebarWidgets";

interface CelebrityTestimonial {
  id: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  name: string;
  profession: string;
  duration: string | null;
  quote: string;
  description: string | null;
  orderIndex: number;
  isActive: boolean;
}

interface AdminCelebrityDashboardProps {
  initialTestimonials: CelebrityTestimonial[];
}

export default function AdminCelebrityDashboard({ initialTestimonials }: AdminCelebrityDashboardProps) {
  const [testimonials, setTestimonials] = useState<CelebrityTestimonial[]>(initialTestimonials);
  
  // Dialog controls
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<CelebrityTestimonial | null>(null);

  // Form states
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [duration, setDuration] = useState("");
  const [quote, setQuote] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Status indicators
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // File Upload Helpers
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingVideo(true);
    setMessage(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setVideoUrl(data.url);
        setMessage({ text: "Video file uploaded successfully!", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to upload video.", type: "error" });
      }
    } catch {
      setMessage({ text: "Upload failed.", type: "error" });
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingThumb(true);
    setMessage(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setThumbnailUrl(data.url);
        setMessage({ text: "Thumbnail uploaded successfully!", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to upload thumbnail.", type: "error" });
      }
    } catch {
      setMessage({ text: "Upload failed.", type: "error" });
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const resetForm = () => {
    setVideoUrl("");
    setThumbnailUrl("");
    setName("");
    setProfession("");
    setDuration("");
    setQuote("");
    setDescription("");
    setIsActive(true);
  };

  // Submit Add
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) {
      setMessage({ text: "Video file or URL is required.", type: "error" });
      return;
    }
    setIsPending(true);
    setMessage(null);
    try {
      const res = await createCelebrityTestimonial({
        videoUrl,
        thumbnailUrl: thumbnailUrl || undefined,
        name,
        profession,
        duration: duration || undefined,
        quote,
        description: description || undefined,
        isActive
      });
      if (res.success && res.testimonial) {
        setTestimonials(prev => [...prev, res.testimonial as any].sort((a, b) => a.orderIndex - b.orderIndex));
        setIsAddOpen(false);
        resetForm();
        setMessage({ text: "New celebrity awareness testimonial added successfully!", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to create testimonial.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    } finally {
      setIsPending(false);
    }
  };

  // Open Edit
  const openEditDialog = (t: CelebrityTestimonial) => {
    setEditingTestimonial(t);
    setVideoUrl(t.videoUrl);
    setThumbnailUrl(t.thumbnailUrl || "");
    setName(t.name);
    setProfession(t.profession);
    setDuration(t.duration || "");
    setQuote(t.quote);
    setDescription(t.description || "");
    setIsActive(t.isActive);
    setIsEditOpen(true);
  };

  // Submit Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    setIsPending(true);
    setMessage(null);
    try {
      const res = await updateCelebrityTestimonial(editingTestimonial.id, {
        videoUrl,
        thumbnailUrl: thumbnailUrl || null,
        name,
        profession,
        duration: duration || null,
        quote,
        description: description || null,
        isActive
      });
      if (res.success && res.testimonial) {
        setTestimonials(prev => prev.map(t => t.id === editingTestimonial.id ? { ...t, ...res.testimonial } as any : t).sort((x, y) => x.orderIndex - y.orderIndex));
        setIsEditOpen(false);
        resetForm();
        setMessage({ text: "Celebrity testimonial updated successfully!", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to update details.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    } finally {
      setIsPending(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this celebrity testimonial?")) return;
    setMessage(null);
    try {
      const res = await deleteCelebrityTestimonial(id);
      if (res.success) {
        setTestimonials(prev => prev.filter(t => t.id !== id));
        setMessage({ text: "Testimonial removed successfully.", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to delete testimonial.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    }
  };

  // Toggle active state
  const handleToggleActive = async (t: CelebrityTestimonial) => {
    setMessage(null);
    try {
      const res = await updateCelebrityTestimonial(t.id, { isActive: !t.isActive });
      if (res.success && res.testimonial) {
        setTestimonials(prev => prev.map(item => item.id === t.id ? { ...item, isActive: res.testimonial.isActive } as any : item));
        setMessage({ text: `Testimonial ${!t.isActive ? 'enabled' : 'disabled'} successfully!`, type: "success" });
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
    if (nextIndex < 0 || nextIndex >= testimonials.length) return;

    setMessage(null);
    const list = [...testimonials];
    const temp = list[index];
    list[index] = list[nextIndex];
    list[nextIndex] = temp;

    try {
      const ids = list.map(t => t.id);
      const res = await reorderCelebrityTestimonials(ids);
      if (res.success) {
        setTestimonials(list.map((item, idx) => ({ ...item, orderIndex: idx })));
        setMessage({ text: "Testimonials reordered successfully!", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to apply reordering.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast alert */}
      {message && (
        <div 
          onClick={() => setMessage(null)}
          className={`p-4 rounded-xl flex items-center justify-between cursor-pointer border shadow-sm ${
            message.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{message.text}</span>
          </div>
          <span className="text-xs opacity-60">Dismiss</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
        <div>
          <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">Celebrity Testimonial Videos</h3>
          <p className="text-xs text-muted-foreground">Manage loops, names, professions, quotes, and video durations inside the bottom Hero widget.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsAddOpen(true); }} className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs">
          <Plus className="h-4 w-4 mr-1" /> Add Celebrity Video
        </Button>
      </div>

      {/* List Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                <th className="p-4 pl-6 w-16 text-center">Order</th>
                <th className="p-4">Celebrity Details</th>
                <th className="p-4">Quote Message</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Action Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-muted-foreground">No celebrity testimonials found. Click Add to create one!</td>
                </tr>
              ) : (
                testimonials.map((t, index) => (
                  <tr key={t.id} className={`hover:bg-slate-50/40 transition-colors ${!t.isActive && 'opacity-65'}`}>
                    <td className="p-4 pl-6 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <button onClick={() => handleMove(index, "UP")} disabled={index === 0} className="h-5 w-5 rounded hover:bg-slate-100 disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5 mx-auto" /></button>
                        <span className="text-xs font-black">{index + 1}</span>
                        <button onClick={() => handleMove(index, "DOWN")} disabled={index === testimonials.length - 1} className="h-5 w-5 rounded hover:bg-slate-100 disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5 mx-auto" /></button>
                      </div>
                    </td>
                    <td className="p-4 flex gap-3.5 items-center">
                      <div className="relative h-12 w-16 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {t.thumbnailUrl ? <img src={t.thumbnailUrl} alt="thumbnail" className="w-full h-full object-cover" /> : <FileImage className="h-5 w-5 text-slate-400" />}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-800 truncate max-w-sm">{t.name}</h4>
                        <p className="text-xs text-muted-foreground truncate max-w-sm">{t.profession} {t.duration && `• ${t.duration}`}</p>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-650 italic">
                      "{t.quote}"
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleToggleActive(t)} className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border ${t.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-250' : 'bg-slate-100 text-slate-500'}`}>
                        {t.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {t.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="p-4 text-right pr-6 space-x-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEditDialog(t)} className="h-8 w-8 hover:text-blue-600"><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(t.id)} className="h-8 w-8 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
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
            <DialogTitle>Add Celebrity Testimonial Video</DialogTitle>
            <DialogDescription>Create a card with autoplaying video loops for the bottom widget.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Video Testimonial File <span className="text-pink-500">*</span></Label>
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1 border border-dashed rounded-lg p-2.5 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-pink-600">
                    <input type="file" accept="video/*" onChange={handleVideoUpload} disabled={isUploadingVideo} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Video className="h-4 w-4" />{isUploadingVideo ? "Uploading..." : videoUrl ? "Video Selected (Click to change)" : "Upload Video File"}
                  </div>
                </div>
                {videoUrl && <span className="text-[10px] text-emerald-600 truncate block mt-1">{videoUrl}</span>}
              </div>

              <div className="space-y-1.5">
                <Label>Video Thumbnail Image (Optional)</Label>
                <div className="flex gap-4 items-center">
                  {thumbnailUrl && <div className="h-10 w-14 rounded overflow-hidden border"><img src={thumbnailUrl} alt="preview" className="h-full w-full object-cover" /></div>}
                  <div className="relative flex-1 border border-dashed rounded-lg p-2.5 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-pink-600">
                    <input type="file" accept="image/*" onChange={handleThumbUpload} disabled={isUploadingThumb} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload className="h-4 w-4" />{isUploadingThumb ? "Uploading..." : "Upload Thumbnail"}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="celebName">Name <span className="text-pink-500">*</span></Label>
                <Input id="celebName" placeholder="e.g. Dr. Jyoti Bajpai" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="celebDuration">Duration (Optional)</Label>
                <Input id="celebDuration" placeholder="e.g. 2:30" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="celebProf">Profession / Designation <span className="text-pink-500">*</span></Label>
              <Input id="celebProf" placeholder="e.g. Senior Oncologist, TMH" value={profession} onChange={(e) => setProfession(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="celebQuote">Inspirational Quote <span className="text-pink-500">*</span></Label>
              <textarea id="celebQuote" rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="e.g. Early screening is our ultimate defense." value={quote} onChange={(e) => setQuote(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="celebDesc">Brief Description (Optional)</Label>
              <textarea id="celebDesc" rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="flex items-center gap-2">
              <input id="celebActive" type="checkbox" className="h-4.5 w-4.5 rounded border-pink-300 text-pink-600 focus:ring-pink-500" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <Label htmlFor="celebActive" className="text-xs font-semibold cursor-pointer select-none">Enable testimonial immediately</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending || isUploadingVideo || isUploadingThumb} className="bg-pink-600 hover:bg-pink-700 text-white font-bold">
                {isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}Add Testimonial
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Celebrity Testimonial Video</DialogTitle>
            <DialogDescription>Modify details and click save changes.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Video Testimonial File</Label>
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1 border border-dashed rounded-lg p-2.5 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-pink-600">
                    <input type="file" accept="video/*" onChange={handleVideoUpload} disabled={isUploadingVideo} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Video className="h-4 w-4" />{isUploadingVideo ? "Uploading..." : "Replace Video File"}
                  </div>
                </div>
                {videoUrl && <span className="text-[10px] text-emerald-600 truncate block mt-1">{videoUrl}</span>}
              </div>

              <div className="space-y-1.5">
                <Label>Video Thumbnail Image</Label>
                <div className="flex gap-4 items-center">
                  {thumbnailUrl && <div className="h-10 w-14 rounded overflow-hidden border"><img src={thumbnailUrl} alt="preview" className="h-full w-full object-cover" /></div>}
                  <div className="relative flex-1 border border-dashed rounded-lg p-2.5 flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-pink-600">
                    <input type="file" accept="image/*" onChange={handleThumbUpload} disabled={isUploadingThumb} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload className="h-4 w-4" />{isUploadingThumb ? "Uploading..." : "Replace Thumbnail"}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="editCelebName">Name</Label>
                <Input id="editCelebName" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editCelebDuration">Duration</Label>
                <Input id="editCelebDuration" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editCelebProf">Profession / Designation</Label>
              <Input id="editCelebProf" value={profession} onChange={(e) => setProfession(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editCelebQuote">Inspirational Quote</Label>
              <textarea id="editCelebQuote" rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" value={quote} onChange={(e) => setQuote(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editCelebDesc">Brief Description</Label>
              <textarea id="editCelebDesc" rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="flex items-center gap-2">
              <input id="editCelebActive" type="checkbox" className="h-4.5 w-4.5 rounded border-pink-300 text-pink-600 focus:ring-pink-500" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <Label htmlFor="editCelebActive" className="text-xs font-semibold cursor-pointer select-none">Enable testimonial</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending || isUploadingVideo || isUploadingThumb} className="bg-pink-600 hover:bg-pink-700 text-white font-bold">
                {isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
