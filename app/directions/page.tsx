"use client";

import { useState } from "react";
import "./directions.css";

const typeSystems = [
  { id: "editorial", label: "01", name: "Riviera Editorial", note: "Expressive · refined", sample: "Gulfline" },
  { id: "couture", label: "02", name: "Coastal Couture", note: "High contrast · luxe", sample: "Gulfline" },
  { id: "noir", label: "03", name: "Modern Noir", note: "Confident · cinematic", sample: "Gulfline" },
  { id: "technical", label: "04", name: "Track Precision", note: "Engineered · modern", sample: "GULFLINE" },
];

const heroDirections = [
  { id: "monument", number: "01", name: "The Monument", note: "Iconic, full-bleed luxury" },
  { id: "split", number: "02", name: "The Reveal", note: "Editorial, art-directed tension" },
  { id: "night", number: "03", name: "After Dark", note: "Immersive, film-title energy" },
];

export default function DirectionsPage() {
  const [font, setFont] = useState("editorial");
  const [hero, setHero] = useState("monument");

  return (
    <main className={`design-lab font-${font}`}>
      <header className="lab-header">
        <a className="lab-brand" href="/" aria-label="Back to Gulfline Auto Spa">
          <span>G</span><strong>Gulfline</strong>
        </a>
        <div className="lab-title"><span>Design study / 2026</span><strong>Hero & type directions</strong></div>
        <a className="back-link" href="/">Live site <span aria-hidden="true">↗</span></a>
      </header>

      <aside className="control-rail" aria-label="Design direction controls">
        <section>
          <div className="control-heading"><span>A</span><strong>Typography</strong></div>
          <div className="type-options">
            {typeSystems.map((type) => (
              <button key={type.id} className={font === type.id ? "active" : ""} onClick={() => setFont(type.id)} aria-pressed={font === type.id}>
                <span className="option-number">{type.label}</span>
                <span className={`type-sample sample-${type.id}`}>{type.sample}</span>
                <span className="option-copy"><strong>{type.name}</strong><small>{type.note}</small></span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="control-heading"><span>B</span><strong>Cinematic hero</strong></div>
          <div className="hero-options">
            {heroDirections.map((direction) => (
              <button key={direction.id} className={hero === direction.id ? "active" : ""} onClick={() => setHero(direction.id)} aria-pressed={hero === direction.id}>
                <span>{direction.number}</span><span><strong>{direction.name}</strong><small>{direction.note}</small></span>
              </button>
            ))}
          </div>
        </section>

        <p className="lab-note">Mix any type direction with any hero. The homepage remains untouched while you explore.</p>
      </aside>

      <section className="preview-stage" aria-live="polite">
        <div className="preview-label"><span>Live composition</span><strong>{heroDirections.find((item) => item.id === hero)?.name}</strong></div>

        {hero === "monument" && (
          <article className="cinematic-hero hero-monument">
            <img src="/hero-detail-v2.jpg" alt="Deep navy coupe beside Tampa Bay at golden hour" />
            <div className="cinema-shade" />
            <nav className="concept-nav"><span className="concept-logo">GULFLINE / TAMPA</span><span>Services</span><span>Process</span><a href="#concept-cta">Book detail</a></nav>
            <div className="monument-copy">
              <p><span /> Tampa Bay / 27.9506° N</p>
              <h1>The coast<br />looks better<br /><em>in reflection.</em></h1>
            </div>
            <div className="monument-footer">
              <p>Precision detailing for vehicles that deserve to arrive twice.</p>
              <a id="concept-cta" href="/#quote">Build your detail <span>↗</span></a>
              <span className="frame-count">01 / 03</span>
            </div>
          </article>
        )}

        {hero === "split" && (
          <article className="cinematic-hero hero-split">
            <div className="split-paper">
              <nav className="concept-nav"><span className="concept-logo">GULFLINE</span><span>01 / Tampa, FL</span></nav>
              <div className="split-copy">
                <p>Automotive finish atelier</p>
                <h1>Made to<br /><em>hold light.</em></h1>
                <div><span>Paint correction</span><span>Ceramic protection</span><span>Signature details</span></div>
              </div>
              <a href="/#quote" className="circle-cta">Begin<br />your detail <span>↗</span></a>
            </div>
            <figure className="split-image">
              <img src="/hero-detail-v2.jpg" alt="Deep navy coupe glowing in coastal light" />
              <figcaption><span>Gulf light / Frame 01</span><span>Drag to discover →</span></figcaption>
            </figure>
          </article>
        )}

        {hero === "night" && (
          <article className="cinematic-hero hero-night">
            <img src="/hero-detail-v2.jpg" alt="Deep navy performance coupe in dramatic Tampa light" />
            <div className="night-grade" />
            <nav className="concept-nav"><span className="concept-logo">G / A S</span><span>27°57&apos;02.2&quot;N</span><span>Est. Tampa</span></nav>
            <div className="night-index"><span>Film 001</span><i /><span>Gulf Coast</span></div>
            <div className="night-copy">
              <p>A study in gloss, depth & motion</p>
              <h1>CHASE<br /><em>THE LIGHT</em></h1>
            </div>
            <div className="night-footer">
              <span>Sound on ◉</span>
              <a href="/#quote">Enter Gulfline <b>→</b></a>
              <span>Scroll to explore ↓</span>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
