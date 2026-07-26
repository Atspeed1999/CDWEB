"use client";

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

export interface GalleryItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
  meta: string;
  imagePosition?: string;
  cropLetterbox?: boolean;
}

interface Gallery6Props {
  heading: string;
  description: string;
  items: GalleryItem[];
  onItemSelect?: (item: GalleryItem) => void;
}

function Gallery6({ heading, description, items, onItemSelect }: Gallery6Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    setCanScrollPrev(track.scrollLeft > 4);
    setCanScrollNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateControls();
    track.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);

    return () => {
      track.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, [updateControls]);

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * Math.min(track.clientWidth * 0.82, 468), behavior: "smooth" });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scroll(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scroll(1);
    }
  };

  return (
    <section className="services section service-gallery" id="services">
      <div className="gallery-heading">
        <div>
          <p className="section-label">Services</p>
          <h2>{heading}</h2>
          <p>{description}</p>
        </div>
        <div className="gallery-controls" aria-label="Service slider controls">
          <button type="button" onClick={() => scroll(-1)} disabled={!canScrollPrev} aria-label="Previous services">
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" onClick={() => scroll(1)} disabled={!canScrollNext} aria-label="Next services">
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="gallery-track"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Gulfline detailing services"
        onKeyDown={handleKeyDown}
      >
        {items.map((item) => (
          <article className="gallery-card" key={item.id} aria-roledescription="slide">
            <a href={item.url} onClick={() => onItemSelect?.(item)}>
              <div className="gallery-image">
                <img
                  src={item.image}
                  alt={`${item.title} by Gulfline Auto Spa`}
                  loading="lazy"
                  decoding="async"
                  className={item.cropLetterbox ? "crop-letterbox" : undefined}
                  style={{ objectPosition: item.imagePosition }}
                />
              </div>
              <div className="gallery-card-copy">
                <p className="gallery-meta">{item.meta}</p>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <span className="gallery-link">Request this service <b aria-hidden="true">→</b></span>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export { Gallery6 };
