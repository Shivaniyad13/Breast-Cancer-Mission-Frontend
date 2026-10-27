"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { 
  Heart, 
  ArrowLeft, 
  Upload, 
  CheckCircle, 
  Sparkles, 
  AlertCircle,
  FileImage,
  FileVideo,
  Loader2,
  X
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitSuccessStory } from "@/app/actions/successStories";

export default function ShareSuccessStoryPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [age, setAge] = useState("");
  const [roleType, setRoleType] = useState("Patient");
  const [storyTitle, setStoryTitle] = useState("");
  const [completeStory, setCompleteStory] = useState("");
  const [treatmentHospital, setTreatmentHospital] = useState("");
  const [consent, setConsent] = useState(false);

  // Upload States
  const [imageUploads, setImageUploads] = useState<{ url: string; name: string }[]>([]);
  const [videoUpload, setVideoUpload] = useState<{ url: string; name: string } | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // File Upload Helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        let res = await apiClient("/upload", {
          method: "POST",
          body: formData,
        });

        // Fallback to Next.js route if backend fetch failed
        if (!res.ok) {
          res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
        }

        const data = await res.json();
        const uploadedUrl = data.data?.url || data.url;

        if (res.ok && uploadedUrl) {
          setImageUploads((prev) => [...prev, { url: uploadedUrl, name: file.name }]);
        } else {
          setError(data.error || data.message || "Failed to upload one or more images.");
        }
      }
    } catch (err: any) {
      console.error("Upload error", err);
      setError("An error occurred during file upload.");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      let res = await apiClient("/upload", {
        method: "POST",
        body: formData,
      });

      // Fallback to Next.js route if backend fetch failed
      if (!res.ok) {
        res = await fetch("/api/upload-video", {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json();
      const uploadedUrl = data.data?.url || data.url;

      if (res.ok && uploadedUrl) {
        setVideoUpload({ url: uploadedUrl, name: file.name });
      } else {
        setError(data.error || data.message || "Failed to upload video.");
      }
    } catch (err: any) {
      console.error("Upload error", err);
      setError("An error occurred during video upload.");
    } finally {
      setIsUploadingVideo(false);
      e.target.value = "";
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    if (!fullName || !email || !mobileNumber || !city || !state || !storyTitle || !completeStory) {
      setError("Please fill out all required fields marked with *.");
      setIsPending(false);
      return;
    }

    if (!consent) {
      setError("You must provide consent to publish your story before submitting.");
      setIsPending(false);
      return;
    }

    const storyData = {
      fullName,
      email,
      mobileNumber,
      city,
      state,
      age: age ? parseInt(age) : undefined,
      roleType,
      storyTitle,
      completeStory,
      videoUrl: videoUpload?.url || undefined,
      imageUrls: imageUploads.map((img) => img.url),
      treatmentHospital: treatmentHospital || undefined,
      consent,
    };

    const result = await submitSuccessStory(storyData);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Failed to submit story. Please try again.");
    }
    setIsPending(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30 dark:from-slate-950 dark:to-slate-900/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home Page
        </Link>

        {/* Success State */}
        {success ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-pink-100 dark:border-pink-950 rounded-2xl p-6 sm:p-8 text-center shadow-lg space-y-6"
          >
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 mb-2">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h1 className="font-heading font-bold text-slate-800 dark:text-slate-100 text-3xl sm:text-4xl">
              Story Submitted Successfully!
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-base">
              Thank you for sharing your journey of hope and courage. Your story has been successfully published and is now visible on the Home Page to inspire thousands of others!
            </p>
            <div className="pt-6 flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => router.push("/#success-stories")}
                className="bg-pink-600 hover:bg-pink-700 text-white shadow-md rounded-xl px-8 h-12 cursor-pointer font-bold"
              >
                View Your Story on Home Page
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/success-stories")}
                className="rounded-xl px-6 h-12 cursor-pointer font-bold border-slate-300"
              >
                All Stories
              </Button>
            </div>
          </motion.div>
        ) : (
          /* Form Container */
          <div className="bg-white dark:bg-slate-900 border border-pink-100 dark:border-pink-950 rounded-2xl p-6 shadow-md space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300">
                <Heart className="h-8 w-8 fill-pink-600" />
              </div>
              <h1 className="font-heading font-bold tracking-tight text-slate-800 dark:text-slate-100 text-3xl sm:text-4xl">
                Share Your Success Journey
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                Your story can inspire strength, promote early screening awareness, and guide others seeking breast cancer healthcare support.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name <span className="text-pink-500">*</span></Label>
                  <Input 
                    id="fullName" 
                    placeholder="Enter your name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address <span className="text-pink-500">*</span></Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Contact & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number <span className="text-pink-500">*</span></Label>
                  <Input 
                    id="mobileNumber" 
                    placeholder="10-digit number" 
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    placeholder="e.g. 45" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleType">Role Type</Label>
                  <select 
                    id="roleType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value)}
                  >
                    <option value="Patient">Patient / Survivor</option>
                    <option value="Family Member">Family Member</option>
                  </select>
                </div>
              </div>

              {/* Row 3: City & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City <span className="text-pink-500">*</span></Label>
                  <Input 
                    id="city" 
                    placeholder="e.g. Mumbai" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State <span className="text-pink-500">*</span></Label>
                  <Input 
                    id="state" 
                    placeholder="e.g. Maharashtra" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Treatment Hospital */}
              <div className="space-y-2">
                <Label htmlFor="treatmentHospital">Treatment Hospital (If approved to share)</Label>
                <Input 
                  id="treatmentHospital" 
                  placeholder="e.g. Tata Memorial Hospital, Mumbai" 
                  value={treatmentHospital}
                  onChange={(e) => setTreatmentHospital(e.target.value)}
                />
              </div>

              {/* Divider */}
              <hr className="border-pink-50 dark:border-pink-950/40 my-6" />

              {/* Story Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storyTitle">Story Title <span className="text-pink-500">*</span></Label>
                  <Input 
                    id="storyTitle" 
                    placeholder="e.g. Victorious Over Stage II Breast Cancer" 
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="completeStory">Complete Story / Journey <span className="text-pink-500">*</span></Label>
                  <textarea 
                    id="completeStory" 
                    rows={6}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Share your diagnosis timeline, medical procedures, recovery milestones, emotional struggles, and key hope-filled words." 
                    value={completeStory}
                    onChange={(e) => setCompleteStory(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* File Uploads (Images & Videos) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Images Upload */}
                <div className="space-y-3">
                  <Label>Upload Journey Images (Optional)</Label>
                  <div className="relative border-2 border-dashed border-pink-100 dark:border-pink-950/60 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-pink-50/20 transition-all cursor-pointer">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Upload className={`h-8 w-8 text-pink-400 mb-2 ${isUploadingImage && 'animate-bounce'}`} />
                    <span className="text-xs font-semibold text-pink-600">
                      {isUploadingImage ? "Uploading..." : "Click to upload image files"}
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-1">PNG, JPG or JPEG format</span>
                  </div>

                  {/* Render uploaded image files */}
                  {imageUploads.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Uploaded images ({imageUploads.length}):</p>
                      {imageUploads.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-1.5 text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                          <div className="flex items-center gap-1.5 truncate">
                            <FileImage className="h-4 w-4 shrink-0 text-emerald-600" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setImageUploads((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer ml-2"
                            title="Remove image"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video Upload */}
                <div className="space-y-3">
                  <Label>Upload Video Testimonial (Optional)</Label>
                  <div className="relative border-2 border-dashed border-pink-100 dark:border-pink-950/60 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-pink-50/20 transition-all cursor-pointer">
                    <input 
                      type="file" 
                      accept="video/*"
                      onChange={handleVideoUpload}
                      disabled={isUploadingVideo}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Upload className={`h-8 w-8 text-pink-400 mb-2 ${isUploadingVideo && 'animate-bounce'}`} />
                    <span className="text-xs font-semibold text-pink-600">
                      {isUploadingVideo ? "Uploading..." : "Click to upload testimonial video"}
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-1">MP4, WEBM or MOV format</span>
                  </div>

                  {/* Render uploaded video file */}
                  {videoUpload && (
                    <div className="space-y-1.5 mt-2">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Uploaded video:</p>
                      <div className="flex items-center justify-between gap-1.5 text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                        <div className="flex items-center gap-1.5 truncate">
                          <FileVideo className="h-4 w-4 shrink-0 text-emerald-600" />
                          <span className="truncate">{videoUpload.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setVideoUpload(null)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer ml-2"
                          title="Remove video"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-3 bg-pink-50/40 dark:bg-pink-950/10 p-4 rounded-2xl border border-pink-100/60 dark:border-pink-950/40 mt-4">
                <input 
                  id="consent" 
                  type="checkbox" 
                  className="mt-1 h-4.5 w-4.5 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                />
                <Label htmlFor="consent" className="text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  I hereby authorize Breast Cancer Awareness Mission to review, edit, and publish my success story, including my name, location, recovery journey details, and uploaded media files, on their public portal to spread medical awareness. <span className="text-pink-500 font-bold">*</span>
                </Label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isPending || isUploadingImage || isUploadingVideo}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-md py-5 text-base cursor-pointer transition-all"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Saving Your Story...
                    </>
                  ) : (
                    <>
                      Submit Story for Review
                      <Sparkles className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
