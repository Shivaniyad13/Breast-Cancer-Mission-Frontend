"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { eventPhotoIds } from "@/lib/eventPhotos";

export default function EventPhotoGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") {
        setSelectedIndex((index) =>
          index === null ? null : (index - 1 + eventPhotoIds.length) % eventPhotoIds.length,
        );
      }
      if (event.key === "ArrowRight") {
        setSelectedIndex((index) =>
          index === null ? null : (index + 1) % eventPhotoIds.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  return (
    <section id="event-gallery" className="border-b border-pink-100 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <p className="text-sm font-bold uppercase tracking-wider text-pink-600">
            Event Gallery
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
            Cancer Mukt Delhi University Abhiyan
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {eventPhotoIds.map((photoId, index) => (
            <button
              key={photoId}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`View event photo ${index + 1}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-pink-100 bg-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
            >
              <Image
                src={`/event-photos/${photoId}`}
                alt={`Cancer Mukt Delhi University Abhiyan event photo ${index + 1}`}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Event photo ${selectedIndex + 1} of ${eventPhotoIds.length}`}
          onClick={() => setSelectedIndex(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
        >
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            aria-label="Close event photo"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex((selectedIndex - 1 + eventPhotoIds.length) % eventPhotoIds.length);
            }}
            aria-label="Previous event photo"
            className="absolute left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:left-6"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div
            className="relative h-[75vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={`/event-photos/${eventPhotoIds[selectedIndex]}`}
              alt={`Cancer Mukt Delhi University Abhiyan event photo ${selectedIndex + 1}`}
              fill
              unoptimized
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex((selectedIndex + 1) % eventPhotoIds.length);
            }}
            aria-label="Next event photo"
            className="absolute right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:right-6"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <p className="absolute bottom-4 text-sm font-medium text-white">
            {selectedIndex + 1} / {eventPhotoIds.length}
          </p>
        </div>
      )}
    </section>
  );
}
