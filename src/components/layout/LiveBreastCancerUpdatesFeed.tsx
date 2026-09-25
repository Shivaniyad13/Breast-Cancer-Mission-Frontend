"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Radio,
  Newspaper,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";
import {
  getLiveBreastCancerFeed,
  FeedItem,
} from "@/app/actions/breastCancerNews";

export default function LiveBreastCancerUpdatesFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadFeed() {
      const res = await getLiveBreastCancerFeed();
      if (res.success && res.items.length > 0 && isMounted) {
        setItems(res.items);
      }
    }
    loadFeed();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  if (items.length === 0) {
    return (
      <div className="relative overflow-hidden bg-[#2d0a20]/95 backdrop-blur-xl border border-pink-900/60 rounded-3xl p-4 shadow-xl flex flex-col items-center justify-center min-h-[260px] text-pink-300 animate-pulse">
        <Radio className="h-5 w-5 mb-2" />
        <p className="text-xs font-semibold">Loading Live Updates...</p>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div
      className="relative overflow-hidden bg-[#2d0a20]/95 backdrop-blur-xl border border-pink-900/60 rounded-3xl p-4 shadow-xl flex flex-col justify-between min-h-[260px] group text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-400" />

      <div className="space-y-3">
        {/* Header — Live label + Left/Right arrows */}
        <div className="flex justify-between items-center pb-1.5 border-b border-pink-900/40">
          <span className="text-[10px] font-black uppercase tracking-widest text-pink-400 flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Live Updates
          </span>
          <div className="flex gap-1">
            <button
              onClick={handlePrev}
              aria-label="Previous item"
              className="h-6 w-6 rounded-md bg-slate-800/90 text-pink-200 border border-pink-900/60 flex items-center justify-center active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next item"
              className="h-6 w-6 rounded-md bg-slate-800/90 text-pink-200 border border-pink-900/60 flex items-center justify-center active:scale-90 cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Image box (aspect-video — same as testimonial video) */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950/90 border border-slate-800/80 shadow-inner">
          <AnimatePresence mode="wait">
            <motion.a
              key={currentItem.id + "-" + currentIndex}
              href={currentItem.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -22 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 block group/card cursor-pointer"
            >
              <img
                src={currentItem.thumbnailUrl}
                alt={currentItem.title}
                className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Top badge */}
              <div className="absolute top-2 left-2">
                {currentItem.type === "video" ? (
                  <span className="bg-pink-600 text-white text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Play className="h-2.5 w-2.5 fill-white" /> Video
                  </span>
                ) : (
                  <span className="bg-white/95 backdrop-blur text-pink-700 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Newspaper className="h-2.5 w-2.5" /> News
                  </span>
                )}
              </div>
            </motion.a>
          </AnimatePresence>
        </div>

        {/* Metadata — matches testimonial layout exactly */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-1.5">
            <h4 className="font-extrabold text-xs text-white truncate">
              {currentItem.source}
            </h4>
            <span className="text-[9px] text-pink-300 font-semibold shrink-0">
              {currentItem.publishedTime}
            </span>
          </div>
          <p className="text-[10px] italic leading-relaxed text-slate-300 line-clamp-2 pl-3 border-l border-slate-800 relative">
            <Quote className="h-2 w-2 text-pink-400 absolute left-0 top-0.5 opacity-70 rotate-180" />
            "{currentItem.title}"
          </p>
          <a
            href={currentItem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-bold text-pink-400 hover:text-pink-300 transition-colors pt-0.5 cursor-pointer"
          >
            Read More <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Dots + counter (bottom — replaces testimonial thumbnails) */}
      {items.length > 1 && (
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {items.slice(0, 8).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex % 8
                    ? "w-5 bg-pink-500"
                    : "w-1.5 bg-slate-600"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">
            {currentIndex + 1} / {items.length}
          </span>
        </div>
      )}
    </div>
  );
}