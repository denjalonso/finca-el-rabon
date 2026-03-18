import { useState, useEffect, useCallback, useRef } from "react";

interface LightboxProps {
  images: { gradient: string; alt: string }[];
}

export default function Lightbox({ images }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const isOpen = currentIndex !== null;

  const close = useCallback(() => setCurrentIndex(null), []);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  }, [images.length]);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i !== null ? (i + 1) % images.length : null));
  }, [images.length]);

  // Listen for gallery image clicks
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-lightbox-index]");
      if (target) {
        const index = parseInt(target.getAttribute("data-lightbox-index")!, 10);
        setCurrentIndex(index);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close, prev, next]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const image = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const diff = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(diff) > 50) {
          if (diff > 0) prev();
          else next();
        }
        touchStartX.current = null;
      }}
    >
      {/* Close button */}
      <button
        onClick={close}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white text-2xl cursor-pointer bg-transparent border-none"
        aria-label="Close lightbox"
      >
        &times;
      </button>

      {/* Previous arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-2 lg:left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white text-3xl cursor-pointer bg-transparent border-none"
        aria-label="Previous image"
      >
        &#8249;
      </button>

      {/* Image */}
      <div
        className={`max-w-[95vw] max-h-[85vh] lg:max-w-[85vw] aspect-[4/3] rounded-lg bg-gradient-to-br ${image.gradient}`}
        role="img"
        aria-label={image.alt}
      />

      {/* Next arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-2 lg:right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white text-3xl cursor-pointer bg-transparent border-none"
        aria-label="Next image"
      >
        &#8250;
      </button>

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
