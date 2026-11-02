"use client";

import { useState } from "react";
import EventPhotoSlider from "@/components/layout/EventPhotoSlider";

export default function HomeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <section className="w-full bg-white py-3 sm:py-5" aria-label="Event moments">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <EventPhotoSlider showClose onClose={() => setIsVisible(false)} />
      </div>
    </section>
  );
}
