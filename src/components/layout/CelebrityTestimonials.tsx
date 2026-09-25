"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Video,
  Quote,
  Star,
} from "lucide-react";

interface CelebrityTestimonial {
  id: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  name: string;
  profession: string;
  duration: string | null;
  quote: string;
  description: string | null;
}

interface CelebrityTestimonialsProps {
  testimonials: CelebrityTestimonial[];
}

export default function CelebrityTestimonials({
  testimonials,
}: CelebrityTestimonialsProps) {
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeTestimonial = testimonials[activeTestimonialIdx];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [activeTestimonialIdx]);

  const handleVideoEnded = () => {
    if (testimonials.length > 1) {
      setActiveTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  };

  if (!activeTestimonial) return null;

  return (
    <div className="relative overflow-hidden bg-[#2d0a20]/95 backdrop-blur-xl border border-pink-900/60 rounded-3xl p-4 shadow-xl flex flex-col justify-between min-h-[260px] group text-white">
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-400" />

      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between items-center pb-1.5 border-b border-pink-900/40">
          <span className="text-[10px] font-black uppercase tracking-widest text-pink-400 flex items-center gap-1">
            <Star className="h-3 w-3 fill-pink-400 text-pink-400" /> Celebrity
            Testimonial
          </span>
          {activeTestimonial.duration && (
            <span className="text-[9px] text-slate-400 font-bold">
              {activeTestimonial.duration}
            </span>
          )}
        </div>

        {/* Video box (aspect-video) */}
        <div
          onClick={togglePlay}
          className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950/90 border border-slate-800/80 shadow-inner group/player flex items-center justify-center cursor-pointer p-0.5"
        >
          <video
            ref={videoRef}
            src={activeTestimonial.videoUrl}
            onEnded={handleVideoEnded}
            autoPlay
            muted={isMuted}
            playsInline
            className="w-full h-full object-contain mx-auto rounded-xl"
          />

          {/* Play/Pause Overlay — center */}
          <div
            className={`absolute inset-0 m-auto h-10 w-10 rounded-full bg-pink-600/90 hover:bg-pink-500 text-white flex items-center justify-center backdrop-blur-md shadow-lg shadow-pink-600/40 cursor-pointer z-10 transition-all active:scale-90 ${
              !isPlaying
                ? "opacity-100 scale-100"
                : "opacity-0 group-hover/player:opacity-100 scale-95 hover:scale-100"
            }`}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-white" />
            ) : (
              <Play className="h-4 w-4 fill-white ml-0.5" />
            )}
          </div>

          {/* Volume button — WHITE BG + BLACK ICON, always visible */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-white text-black flex items-center justify-center hover:bg-pink-50 active:scale-95 transition-all cursor-pointer z-10 border border-pink-200 shadow-md"
          >
            {isMuted ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Metadata */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-1.5">
            <h4 className="font-extrabold text-xs text-white truncate">
              {activeTestimonial.name}
            </h4>
            <span className="text-[9px] text-pink-300 font-semibold shrink-0 truncate">
              {activeTestimonial.profession}
            </span>
          </div>
          <p className="text-[10px] italic leading-relaxed text-slate-300 line-clamp-2 pl-3 border-l border-slate-800 relative">
            <Quote className="h-2 w-2 text-pink-400 absolute left-0 top-0.5 opacity-70 rotate-180" />
            "{activeTestimonial.quote}"
          </p>
        </div>
      </div>

      {/* Bottom — playlist thumbnails */}
      {testimonials.length > 1 && (
        <div className="pt-2 border-t border-slate-800 space-y-1.5">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">
            More Testimonials
          </span>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {testimonials.map((t, idx) => {
              const isActive = idx === activeTestimonialIdx;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTestimonialIdx(idx)}
                  className={`relative flex-shrink-0 h-8 w-12 rounded overflow-hidden border transition-all cursor-pointer ${
                    isActive
                      ? "border-pink-500 scale-105 shadow-md shadow-pink-500/30"
                      : "border-slate-700 opacity-60 hover:opacity-100"
                  }`}
                >
                  {t.thumbnailUrl ? (
                    <img
                      src={t.thumbnailUrl}
                      alt="thumbnail"
                      className="h-full w-full object-contain bg-slate-950 p-0.5"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-800 flex items-center justify-center text-white text-[8px]">
                      <Video className="h-3 w-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}