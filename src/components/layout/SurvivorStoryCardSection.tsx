"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  MapPin,
  Hospital,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  X,
  Share2,
  User,
  CheckCircle2,
  Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SuccessStoryItem {
  id: string;
  fullName: string;
  email?: string;
  mobileNumber?: string;
  city: string;
  state: string;
  age?: number | null;
  roleType: string;
  storyTitle: string;
  completeStory: string;
  videoUrl?: string | null;
  imageUrls: string[];
  treatmentHospital?: string | null;
  consent: boolean;
  status: string;
  createdAt?: string | Date;
}

interface SurvivorStoryCardSectionProps {
  initialStories?: SuccessStoryItem[];
}

export default function SurvivorStoryCardSection({
  initialStories = [],
}: SurvivorStoryCardSectionProps) {
  const [stories, setStories] = useState<SuccessStoryItem[]>(initialStories);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState<SuccessStoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(initialStories.length === 0);

  // Fallback images for stories that don't have an uploaded picture
  const fallbackImages = [
    "/images/survivor_strength.png",
    "/images/awareness_ribbon.png",
    "/images/survivor-priya.jpg",
    "/images/Cancer Patients.jpg",
    "/images/breast-cancer-support.jpg",
  ];

  // Refresh stories on client mount to ensure freshly submitted stories are loaded
  useEffect(() => {
    async function fetchStories() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/success-stories/approved`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setStories(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to refresh success stories:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStories();
  }, []);

  if (!stories || stories.length === 0) {
    if (isLoading) {
      return (
        <section aria-label="Loading survivor stories" className="border-b border-slate-200/70 bg-slate-50/60 py-10 sm:py-14">
          <div className="container mx-auto space-y-5 px-4 sm:px-6 lg:px-8">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-40 animate-pulse rounded-2xl bg-slate-200 sm:h-56" />
          </div>
        </section>
      );
    }
    return null;
  }

  const currentStory = stories[currentIndex] || stories[0];
  const storyImage =
    currentStory.imageUrls && currentStory.imageUrls.length > 0 && currentStory.imageUrls[0]
      ? currentStory.imageUrls[0]
      : fallbackImages[currentIndex % fallbackImages.length];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-10 sm:py-14 bg-slate-50/60 border-b border-slate-200/70" id="success-stories">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with story navigation pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs font-bold ">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                Real Survivor Journeys
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                • {stories.length} Stories Shared
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Voices of Hope &amp; Healing
            </h2>
          </div>

          {/* Quick story selector tabs / controls */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0 ">
            {stories.map((s, idx) => (
              <button
                key={s.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${currentIndex === idx
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
              >
                {s.fullName}
              </button>
            ))}

            <Link href="/success-stories/share" className="ml-1 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg border-pink-300 text-pink-700 hover:bg-pink-50 text-xs font-bold px-3"
              >
                + Share Yours
              </Button>
            </Link>
          </div>
        </div>

        {/* ============ MAIN STORY CARD (IMAGE 2 STYLE) ============ */}
        <div className="bg-white rounded-2xl sm:rounded-2xl p-6 border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.07)] transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* LEFT COLUMN: Modern Styled Image or Video with Badges */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-2xl sm:rounded-2xl overflow-hidden shadow-sm aspect-[4/3] sm:aspect-[16/11] lg:h-[350px] w-full bg-slate-900 group">
                {currentStory.videoUrl ? (
                  <div className="w-full h-full relative bg-black flex items-center justify-center">
                    <video
                      key={currentStory.videoUrl}
                      src={currentStory.videoUrl}
                      controls
                      playsInline
                      preload="metadata"
                      poster={currentStory.imageUrls?.[0] || undefined}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <>
                    <img
                      src={storyImage}
                      alt={currentStory.storyTitle}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25 pointer-events-none" />

                    {/* Top Badge: Role & Hindi subtitle badge */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                      <span className="bg-slate-900/75 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 shadow-sm flex items-center gap-1.5">
                        <span>🎗️</span>
                        <span>
                          {currentStory.roleType === "Patient"
                            ? "कैंसर सर्वाइवर की सच्ची कहानी"
                            : "प्रेरणादायक पारिवारिक संबल"}
                        </span>
                      </span>

                      {currentStory.age && (
                        <span className="bg-black/60 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-md border border-white/10">
                          Age: {currentStory.age}
                        </span>
                      )}
                    </div>

                    {/* Bottom Badge: Location & Hospital */}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                      <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-lg border border-white/40 shadow-sm flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-pink-600" />
                        <span>{currentStory.city}{currentStory.state ? `, ${currentStory.state}` : ""}</span>
                      </span>

                      {currentStory.treatmentHospital && (
                        <span className="bg-emerald-900/80 backdrop-blur-md text-emerald-100 text-[11px] sm:text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-400/30 line-clamp-1 max-w-[200px]">
                          {currentStory.treatmentHospital}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Content matching Image 2 Layout */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-5">

              {/* Category / Kicker in Green Uppercase (Matches "WHY YOU" in reference) */}
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-emerald-600 flex items-center gap-2">
                  <span>SURVIVOR STORY</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-semibold">{currentStory.roleType || "Patient"}</span>
                </span>

                {/* Navigation controls if multiple stories */}
                {stories.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 mr-1">
                      {currentIndex + 1} / {stories.length}
                    </span>
                    <button
                      onClick={handlePrev}
                      aria-label="Previous story"
                      className="p-1.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      aria-label="Next story"
                      className="p-1.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Story Heading (Matches "MRIDUL KRISHNA & CO." bold headline in reference) */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                {currentStory.storyTitle}
              </h3>

              {/* Bold Lead Introduction paragraph */}
              <p className="text-slate-700 font-semibold text-sm sm:text-base leading-relaxed">
                <strong className="text-slate-900 font-bold">{currentStory.fullName.toUpperCase()}</strong>
                {currentStory.age ? `, aged ${currentStory.age}` : ""}, from {currentStory.city}{currentStory.state ? `, ${currentStory.state}` : ""}
                {currentStory.treatmentHospital
                  ? ` successfully completed treatment at ${currentStory.treatmentHospital}.`
                  : " fought breast cancer with tremendous resilience and hope."}
              </p>

              {/* Body story text (Matches the description text in reference) */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-4 lg:line-clamp-5 whitespace-pre-line">
                {currentStory.completeStory}
              </p>

              {/* "Readmore >" Link in Green (Matches reference exactly) */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setSelectedStory(currentStory)}
                  className="text-emerald-700 hover:text-emerald-800 font-bold text-sm sm:text-base inline-flex items-center gap-1.5 hover:gap-2.5 transition-all cursor-pointer group"
                >
                  <span>Readmore &gt;</span>
                </button>

                <Link
                  href={`/success-stories/${currentStory.id}`}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium hover:underline"
                >
                  View standalone page
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ============ STORY DETAIL MODAL (WHEN USER CLICKS READMORE >) ============ */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-8">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold ">
                {selectedStory.roleType || "Survivor"} Story
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {selectedStory.storyTitle}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 pt-1">
                <span className="font-bold text-slate-800">{selectedStory.fullName}</span>
                {selectedStory.age && <span>• {selectedStory.age} Years Old</span>}
                <span>• {selectedStory.city}, {selectedStory.state}</span>
              </div>
            </div>

            {/* Hospital information */}
            {selectedStory.treatmentHospital && (
              <div className="mt-4 p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Hospital className="h-5 w-5" />
                </div>
                <div className="text-xs sm:text-sm">
                  <span className="font-semibold text-emerald-950 block">Treatment Center:</span>
                  <span className="text-emerald-800">{selectedStory.treatmentHospital}</span>
                </div>
              </div>
            )}

            {/* Full Story Content */}
            <div className="mt-6 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line border-t border-slate-100 pt-6">
              {selectedStory.completeStory}
            </div>

            {/* Video Player if available */}
            {selectedStory.videoUrl && (
              <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200 bg-black">
                <video
                  src={selectedStory.videoUrl}
                  controls
                  className="w-full max-h-[300px] object-contain"
                />
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <Link href={`/success-stories/${selectedStory.id}`}>
                <Button variant="outline" size="sm" className="rounded-xl text-xs font-bold">
                  Open In Full Page <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>

              <Button
                onClick={() => setSelectedStory(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs px-5"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
