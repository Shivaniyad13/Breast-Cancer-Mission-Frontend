"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function HomeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <section className="w-full bg-white py-3 sm:py-5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg">
          <Image
            src="/banner.png"
            alt="Cancer Mukt Delhi University Abhiyan on 31 October 2026"
            width={2048}
            height={768}
            className="block w-full h-auto"
          />
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            aria-label="Close banner"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
