"use client";

import { useState } from "react";
import { 
  Check, 
  X, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Sparkles,
  MapPin, 
  Hospital,
  AlertCircle,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
  updateSuccessStoryStatus, 
  editSuccessStory, 
  deleteSuccessStory 
} from "@/app/actions/successStories";

interface SuccessStory {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  city: string;
  state: string;
  age: number | null;
  roleType: string;
  storyTitle: string;
  completeStory: string;
  videoUrl: string | null;
  imageUrls: string[];
  treatmentHospital: string | null;
  consent: boolean;
  status: any;
  createdAt: Date;
}

interface AdminSuccessStoriesDashboardProps {
  stories: SuccessStory[];
}

export default function AdminSuccessStoriesDashboard({ stories: initialStories }: AdminSuccessStoriesDashboardProps) {
  const [stories, setStories] = useState<SuccessStory[]>(initialStories);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "VERIFIED" | "REJECTED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Selected Story states
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Edit states
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    city: "",
    state: "",
    age: "",
    roleType: "",
    storyTitle: "",
    completeStory: "",
    videoUrl: "",
    treatmentHospital: ""
  });

  // Action status message
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Filtering
  const filteredStories = stories.filter((story) => {
    const matchesTab = activeTab === "ALL" || story.status === activeTab;
    const matchesSearch = 
      story.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.storyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.completeStory.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Handle Approve/Reject status changes
  const handleStatusChange = async (id: string, status: "VERIFIED" | "REJECTED") => {
    try {
      const res = await updateSuccessStoryStatus(id, status);
      if (res.success && res.story) {
        setStories(prev => prev.map(s => s.id === id ? { ...s, status: res.story.status } : s));
        setMessage({ text: `Story status updated to ${status} successfully!`, type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to update story status.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    }
  };

  // Handle Delete story
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this success story? This action cannot be undone.")) return;

    try {
      const res = await deleteSuccessStory(id);
      if (res.success) {
        setStories(prev => prev.filter(s => s.id !== id));
        setMessage({ text: "Success story deleted successfully.", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to delete success story.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    }
  };

  // Open Edit Dialog
  const openEditDialog = (story: SuccessStory) => {
    setEditingStory(story);
    setEditForm({
      fullName: story.fullName,
      city: story.city,
      state: story.state,
      age: story.age?.toString() || "",
      roleType: story.roleType,
      storyTitle: story.storyTitle,
      completeStory: story.completeStory,
      videoUrl: story.videoUrl || "",
      treatmentHospital: story.treatmentHospital || ""
    });
    setIsEditOpen(true);
  };

  // Submit Edit Form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;

    try {
      const res = await editSuccessStory(editingStory.id, {
        fullName: editForm.fullName,
        city: editForm.city,
        state: editForm.state,
        age: editForm.age ? parseInt(editForm.age) : undefined,
        roleType: editForm.roleType,
        storyTitle: editForm.storyTitle,
        completeStory: editForm.completeStory,
        videoUrl: editForm.videoUrl || undefined,
        treatmentHospital: editForm.treatmentHospital || undefined
      });

      if (res.success && res.story) {
        setStories(prev => prev.map(s => s.id === editingStory.id ? { ...s, ...res.story } : s));
        setIsEditOpen(false);
        setMessage({ text: "Success story details updated successfully!", type: "success" });
      } else {
        setMessage({ text: res.error || "Failed to update story.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred.", type: "error" });
    }
  };

  const showStoryDetails = (story: SuccessStory) => {
    setSelectedStory(story);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast alert message */}
      {message && (
        <div 
          onClick={() => setMessage(null)}
          className={`p-4 rounded-xl flex items-center justify-between cursor-pointer border shadow-sm transition-all animate-in fade-in slide-in-from-top-4 ${
            message.type === "success" 
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/40" 
              : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/40"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{message.text}</span>
          </div>
          <span className="text-xs opacity-60">Dismiss</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-100/50">
          <CardHeader className="py-4">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-pink-600">Total Stories</CardDescription>
            <CardTitle className="text-3xl font-black">{stories.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-950/10 border-yellow-200/40">
          <CardHeader className="py-4">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">Pending Approval</CardDescription>
            <CardTitle className="text-3xl font-black text-yellow-700 dark:text-yellow-300">
              {stories.filter(s => s.status === "PENDING").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-emerald-50 dark:bg-emerald-950/10 border-emerald-200/40">
          <CardHeader className="py-4">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Approved Stories</CardDescription>
            <CardTitle className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
              {stories.filter(s => s.status === "VERIFIED").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-rose-50 dark:bg-rose-950/10 border-rose-200/40">
          <CardHeader className="py-4">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Rejected Stories</CardDescription>
            <CardTitle className="text-3xl font-black text-rose-700 dark:text-rose-300">
              {stories.filter(s => s.status === "REJECTED").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Control Bar: Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        
        {/* Sub-status Tab Switcher */}
        <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
          {["ALL", "PENDING", "VERIFIED", "REJECTED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 sm:flex-none text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                activeTab === tab 
                  ? "bg-white dark:bg-slate-950 shadow-sm text-pink-600" 
                  : "text-muted-foreground hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search stories, names, titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Story moderation table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold">
                <th className="p-4 pl-6">Patient / Submitter</th>
                <th className="p-4">Story Title</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Action Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-12 text-muted-foreground">
                    No success stories match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredStories.map((story) => (
                  <tr key={story.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/30 transition-colors">
                    
                    {/* Column 1: Patient details */}
                    <td className="p-4 pl-6 space-y-1">
                      <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        {story.fullName} 
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded font-normal">
                          {story.roleType}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">{story.email} • {story.mobileNumber}</div>
                    </td>

                    {/* Column 2: Title */}
                    <td className="p-4">
                      <div className="font-semibold text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        {story.storyTitle}
                      </div>
                    </td>

                    {/* Column 3: Location */}
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1 text-xs">
                        <MapPin className="h-3.5 w-3.5 text-pink-400" />
                        {story.city}, {story.state}
                      </div>
                      {story.treatmentHospital && (
                        <div className="text-[11px] text-muted-foreground mt-0.5 max-w-xs truncate flex items-center gap-0.5">
                          <Hospital className="h-3 w-3" /> {story.treatmentHospital}
                        </div>
                      )}
                    </td>

                    {/* Column 4: Status badge */}
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                        story.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400"
                          : story.status === "VERIFIED"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
                      }`}>
                        {story.status}
                      </span>
                    </td>

                    {/* Column 5: Action controls */}
                    <td className="p-4 text-right pr-6 space-x-1.5">
                      
                      {/* Read details / View */}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => showStoryDetails(story)}
                        title="View Full Story Details"
                        className="h-8 w-8 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/20"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(story)}
                        title="Edit Story Content"
                        className="h-8 w-8 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>

                      {/* Approve button */}
                      {story.status !== "VERIFIED" && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleStatusChange(story.id, "VERIFIED")}
                          title="Approve Story"
                          className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Reject button */}
                      {story.status !== "REJECTED" && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleStatusChange(story.id, "REJECTED")}
                          title="Reject Story"
                          className="h-8 w-8 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(story.id)}
                        title="Delete Story"
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
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

      {/* DETAIL DIALOG */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pink-600 fill-pink-600 animate-pulse" />
              Story Details: {selectedStory?.fullName}
            </DialogTitle>
            <DialogDescription>
              Submitter Role: {selectedStory?.roleType} {selectedStory?.age && `(Age: ${selectedStory.age})`} from {selectedStory?.city}, {selectedStory?.state}
            </DialogDescription>
          </DialogHeader>

          {selectedStory && (
            <div className="space-y-4 pt-2">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl space-y-1.5 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-pink-600 uppercase tracking-widest leading-none block">Title</span>
                <p className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                  {selectedStory.storyTitle}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl space-y-1.5 border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-pink-600 uppercase tracking-widest leading-none block">Journey details</span>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedStory.completeStory}
                </p>
              </div>

              {selectedStory.treatmentHospital && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl space-y-1 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-pink-600 uppercase tracking-widest leading-none block">Hospital</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {selectedStory.treatmentHospital}
                  </p>
                </div>
              )}

              {selectedStory.videoUrl && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl space-y-1 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-pink-600 uppercase tracking-widest leading-none block">Video Testimonial URL</span>
                  <a 
                    href={selectedStory.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-pink-600 hover:underline inline-flex items-center gap-1"
                  >
                    {selectedStory.videoUrl} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {selectedStory.imageUrls.length > 0 && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-pink-600 uppercase tracking-widest leading-none block">Submitted Images</span>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedStory.imageUrls.map((url, idx) => (
                      <a href={url} target="_blank" rel="noopener noreferrer" key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                        <img src={url} alt="submit image" className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Success Story</DialogTitle>
            <DialogDescription>Modify story content or metadata and click save.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="editName">Full Name</Label>
                <Input
                  id="editName"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editRole">Role Type</Label>
                <select
                  id="editRole"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editForm.roleType}
                  onChange={(e) => setEditForm(prev => ({ ...prev, roleType: e.target.value }))}
                >
                  <option value="Patient">Patient</option>
                  <option value="Family Member">Family Member</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="editAge">Age</Label>
                <Input
                  id="editAge"
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editCity">City</Label>
                <Input
                  id="editCity"
                  value={editForm.city}
                  onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editState">State</Label>
                <Input
                  id="editState"
                  value={editForm.state}
                  onChange={(e) => setEditForm(prev => ({ ...prev, state: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editHospital">Treatment Hospital</Label>
              <Input
                id="editHospital"
                value={editForm.treatmentHospital}
                onChange={(e) => setEditForm(prev => ({ ...prev, treatmentHospital: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editTitle">Story Title</Label>
              <Input
                id="editTitle"
                value={editForm.storyTitle}
                onChange={(e) => setEditForm(prev => ({ ...prev, storyTitle: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editStory">Complete Journey Description</Label>
              <textarea
                id="editStory"
                rows={6}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editForm.completeStory}
                onChange={(e) => setEditForm(prev => ({ ...prev, completeStory: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editVideoUrl">Video Testimonial URL</Label>
              <Input
                id="editVideoUrl"
                value={editForm.videoUrl}
                onChange={(e) => setEditForm(prev => ({ ...prev, videoUrl: e.target.value }))}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white font-bold">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
