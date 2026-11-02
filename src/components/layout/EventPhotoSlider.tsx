"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { eventPhotoIds } from "@/lib/eventPhotos";

interface EventPhotoSliderProps {
  aspectClassName?: string;
  className?: string;
  showClose?: boolean;
  onClose?: () => void;
}

export default function EventPhotoSlider({
  aspectClassName = "aspect-[4/3] sm:aspect-[16/7]",
  className = "relative w-full overflow-hidden rounded-2xl bg-slate-100 shadow-lg sm:rounded-3xl",
  showClose = false,
  onClose,
}: EventPhotoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % eventPhotoIds.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [isPlaying]);

  const showPrevious = () => {
    setCurrentIndex((index) => (index - 1 + eventPhotoIds.length) % eventPhotoIds.length);
  };
  const showNext = () => {
    setCurrentIndex((index) => (index + 1) % eventPhotoIds.length);
  };

  return (
    <div className={className} aria-roledescription="carousel">
      <div className={`relative ${aspectClassName}`}>
        <Image
          src={`/api/event-photos/${eventPhotoIds[currentIndex]}`}
          alt={`Cancer Mukt Bharat event moment ${currentIndex + 1}`}
          width={2048}
          height={896}
          unoptimized
          className="h-full w-full object-contain"
        />
      </div>
      <button
        type="button"
        onClick={showPrevious}
        aria-label="Previous event photo"
        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={showNext}
        aria-label="Next event photo"
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => setIsPlaying((playing) => !playing)}
        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      {showClose && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close banner"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="h-5 w-5" />
        </button>
      )}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        {eventPhotoIds.map((photoId, index) => (
          <button
            key={photoId}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={`Show event photo ${index + 1}`}
            aria-current={index === currentIndex ? "true" : undefined}
            className={`h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              index === currentIndex ? "w-5 bg-white" : "w-2.5 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
