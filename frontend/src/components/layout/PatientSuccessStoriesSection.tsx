"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Heart, 
  MapPin, 
  Quote, 
  Sparkles,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  status: string;
  createdAt: Date;
}

interface PatientSuccessStoriesSectionProps {
  initialStories: SuccessStory[];
}

export default function PatientSuccessStoriesSection({ initialStories }: PatientSuccessStoriesSectionProps) {
  const router = useRouter();
  const [stories, setStories] = useState<SuccessStory[]>(initialStories);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeStory = stories[activeStoryIndex];

  // Auto-play and handle transitions when active story index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Auto-play was prevented. Waiting for interaction.", error);
            setIsPlaying(false);
          });
      }
    }
  }, [activeStoryIndex]);

  // Video finished playing -> smooth transition to next video
  const handleVideoEnded = () => {
    if (stories.length > 1) {
      setActiveStoryIndex((prevIndex) => (prevIndex + 1) % stories.length);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!activeStory) {
    return (
      <div className="w-full text-center py-10 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-pink-200">
        <p className="text-muted-foreground">No patient success stories found. Submit yours today!</p>
      </div>
    );
  }

  // Generate a snippet of the quote or construct one from their story
  const firstSentence = activeStory.completeStory.split(/[.!?]/)[0] + ".";

  return (
    <div className="space-y-16">
      {/* Video Showcase Card */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl border border-pink-100 dark:border-pink-950 shadow-2xl p-6 sm:p-8">
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-300/10 dark:bg-pink-900/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-300/10 dark:bg-purple-900/10 rounded-full blur-3xl" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* LEFT side - Video Player (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Player Container */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-xl border border-slate-800 group">
              <AnimatePresence mode="wait">
                {activeStory.videoUrl ? (
                  <motion.video
                    key={activeStory.id}
                    ref={videoRef}
                    src={activeStory.videoUrl}
                    onEnded={handleVideoEnded}
                    autoPlay
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.5 }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900">
                    <Video className="h-16 w-16 text-pink-500 animate-pulse mb-3" />
                    <p className="text-sm font-semibold">Video preview not available</p>
                  </div>
                )}
              </AnimatePresence>

              {/* Video Overlay Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                
                {/* Top bar info */}
                <div className="flex justify-between items-center text-white/90">
                  <span className="text-xs font-semibold bg-pink-600/80 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3 animate-spin" /> Playing Story
                  </span>
                </div>

                {/* Bottom bar controls */}
                <div className="flex justify-between items-center">
                  <button 
                    onClick={togglePlay}
                    className="h-10 w-10 flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur transition-all active:scale-95 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-white" />}
                  </button>

                  <button 
                    onClick={toggleMute}
                    className="h-10 w-10 flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur transition-all active:scale-95 cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Quote and Patient Details below the video */}
            <div className="space-y-4">
              <div className="relative pl-8">
                <Quote className="absolute left-0 top-0 h-6 w-6 text-pink-400 opacity-50 rotate-180" />
                <p className="text-lg md:text-xl font-medium italic text-slate-800 dark:text-slate-100 leading-relaxed">
                  "{firstSentence}"
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-pink-50 dark:border-pink-950/40 pt-4">
                <div>
                  <h3 className="font-heading text-xl font-extrabold text-slate-800 dark:text-slate-100">
                    {activeStory.fullName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>{activeStory.roleType}</span>
                    <span>•</span>
                    {activeStory.age && (
                      <>
                        <span>Age {activeStory.age}</span>
                        <span>•</span>
                      </>
                    )}
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin className="h-3 w-3 text-pink-400" />
                      {activeStory.city}, {activeStory.state}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => router.push(`/success-stories/${activeStory.id}`)}
                  className="bg-pink-600 hover:bg-pink-700 text-white shadow-md active:scale-95 transition-all"
                >
                  Read Full Story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

          </div>

          {/* RIGHT side - Vertical Stories List (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col h-[520px]">
            <h3 className="text-sm font-bold text-pink-600 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Heart className="h-4 w-4 fill-pink-600 text-pink-600" /> More Inspiring Journeys
            </h3>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {stories.map((story, index) => {
                const isActive = index === activeStoryIndex;
                return (
                  <div
                    key={story.id}
                    onClick={() => setActiveStoryIndex(index)}
                    className={`group relative flex gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-pink-50 to-purple-50/50 dark:from-pink-950/20 dark:to-purple-950/10 border-pink-200 dark:border-pink-900 shadow-md"
                        : "bg-white/50 dark:bg-slate-850/50 hover:bg-white dark:hover:bg-slate-850 border-slate-100 dark:border-slate-800 hover:border-pink-100 hover:shadow"
                    }`}
                  >
                    {/* Fake Thumbnail/Gradient Cover */}
                    <div className="relative h-20 w-28 rounded-xl overflow-hidden bg-gradient-to-br from-pink-400 to-purple-500 shadow-inner flex-shrink-0 flex items-center justify-center text-white">
                      {story.videoUrl ? (
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                          <Play className={`h-6 w-6 transition-transform group-hover:scale-110 ${isActive ? 'text-pink-300' : 'text-white'}`} />
                        </div>
                      ) : (
                        <Heart className="h-6 w-6 text-white/80" />
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className={`font-bold text-sm truncate ${isActive ? "text-pink-700 dark:text-pink-400" : "text-slate-800 dark:text-slate-100"}`}>
                          {story.fullName}
                        </h4>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-full font-medium">
                          {story.roleType === "Patient" ? "Survivor" : "Family"}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                        <MapPin className="h-2.5 w-2.5 text-pink-400" />
                        {story.city}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-snug">
                        {story.storyTitle}
                      </p>
                    </div>

                    {/* Left Border Accent for Active Story */}
                    {isActive && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 bg-pink-600 rounded-r-md" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Share Your Success Story CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl shadow-xl text-white py-12 px-8 sm:px-12">
        {/* Glow circles */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-white/15 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-bold uppercase tracking-wider">
              Share Your Success Story
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight">
              Has Cancer Awareness Touched Your Life?
            </h2>
            <p className="text-pink-100 max-w-xl text-sm md:text-base leading-relaxed">
              Every battle fought is a reminder of hope. Whether you are a survivor or a supportive family member, sharing your journey of recovery can inspire thousands of others to detect early and seek timely medical care.
            </p>
          </div>

          <Button
            onClick={() => router.push("/success-stories/share")}
            size="lg"
            className="w-full md:w-auto bg-white hover:bg-slate-100 text-pink-700 font-extrabold shadow-lg hover:shadow-xl active:scale-95 transition-all text-base px-8 h-14 rounded-xl flex-shrink-0 cursor-pointer"
          >
            Share Your Story
            <Heart className="ml-2 h-5 w-5 fill-pink-600 text-pink-600 animate-pulse" />
          </Button>
        </div>
      </section>
    </div>
  );
}
