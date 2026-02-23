"use client";

import { useState } from "react";
import { Images } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// This component handles the popup gallery logic
export default function GalleryButton({ slides }: { slides: { src: string }[] }) {
  const [open, setOpen] = useState(false);

  // If there are no images, don't show the button
  if (!slides || slides.length === 0) return null;

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="bg-white/90 backdrop-blur-md text-slate-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-2xl hover:bg-blue-600 hover:text-white transition-all scale-100 hover:scale-105 active:scale-95 border border-white/50"
      >
        <Images size={20} />
        View Gallery ({slides.length})
      </button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
      />
    </>
  );
}