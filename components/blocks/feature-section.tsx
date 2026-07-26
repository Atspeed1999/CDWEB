"use client";

import { CSSProperties, KeyboardEvent, useRef, useState } from "react";

export interface FeatureItem {
  step: string;
  title: string;
  content: string;
  image: string;
  imagePosition?: string;
  cropLetterbox?: boolean;
}

interface FeatureStepsProps {
  features: FeatureItem[];
  title: string;
}

export function FeatureSteps({
  features,
  title,
}: FeatureStepsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeFeature = features[activeIndex];

  if (!activeFeature) return null;

  const selectTab = (index: number) => {
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectTab((activeIndex - 1 + features.length) % features.length);
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectTab((activeIndex + 1) % features.length);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectTab(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectTab(features.length - 1);
    }
  };

  return (
    <div
      className="feature-steps"
      role="region"
      aria-label={title}
      onKeyDown={handleKeyDown}
    >
      <div className="feature-steps-heading">
        <h2>{title}</h2>
        <p>
          Three deliberate stages. One clear standard from arrival to
          handover.
        </p>
      </div>

      <div className="feature-stage">
        <div className="feature-copy">
          <div
            className="feature-nav"
            role="tablist"
            aria-label="Detailing stages"
            aria-orientation="vertical"
          >
            {features.map((feature, index) => (
              <button
                id={`method-tab-${index}`}
                key={feature.step}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                tabIndex={index === activeIndex ? 0 : -1}
                aria-selected={index === activeIndex}
                aria-controls="method-panel"
                onClick={() => setActiveIndex(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{feature.step}</strong>
                <span className="feature-tab-copy">
                  <small>{feature.title}</small>
                  {index === activeIndex && (
                    <span className="feature-tab-description">
                      {feature.content}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        <figure
          id="method-panel"
          className="feature-image"
          role="tabpanel"
          aria-labelledby={`method-tab-${activeIndex}`}
        >
          <img
            key={activeFeature.image}
            className={activeFeature.cropLetterbox ? "crop-letterbox" : ""}
            src={activeFeature.image}
            alt={`${activeFeature.title} at Gulfline Auto Spa`}
            style={
              {
                objectPosition: activeFeature.imagePosition ?? "center",
              } as CSSProperties
            }
          />
        </figure>
      </div>
    </div>
  );
}
