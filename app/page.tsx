"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { FeatureSteps } from "@/components/blocks/feature-section";
import { Gallery6 } from "@/components/ui/gallery6";

const FRAME_COUNT = 220;
// The supplied Ford sequence is native 16:9, so each frame can fill the hero
// without enlarging a compressed crop.
const FRAME_CONTENT_ASPECT_RATIO = 16 / 9;
const framePath = (index: number) =>
  `/ford-hero/Ford Car ${String(index).padStart(3, "0")}.jpg`;

const heroMoments = [
  {
    eyebrow: "Paint correction",
    title: "Clarity, restored.",
    body: "Measured polishing lifts haze and swirls while preserving the character of your finish.",
    range: [0.25, 0.46],
  },
  {
    eyebrow: "Ceramic protection",
    title: "Gloss that stays.",
    body: "Durable protection keeps Gulf Coast sun, salt, and sudden rain from dulling the result.",
    range: [0.51, 0.72],
  },
  {
    eyebrow: "Gulfline Auto Spa",
    title: "Ultimate Car Detailing Services",
    body: "The ultimate car detailing service—tailored to your vehicle and the way you drive.",
    range: [0.76, 0.86],
    persist: true,
    cta: "Request a quote",
  },
] as const;

const services = [
  {
    id: "paint-correction",
    name: "Paint Correction",
    detail: "Measured polishing lifts swirls, haze, and oxidation while preserving the clear coat your vehicle needs.",
    time: "1–3 days",
    image: "/service-paint-correction.png",
    imagePosition: "center 54%",
  },
  {
    id: "ceramic-coating",
    name: "Ceramic Coating",
    detail: "A durable, hydrophobic barrier that helps gloss hold up through Tampa sun, salt air, and sudden rain.",
    time: "1–2 days",
    image: "/service-ceramic-coating.png",
    imagePosition: "center 66%",
  },
  {
    id: "signature-detail",
    name: "Signature Detail",
    detail: "A complete interior and exterior reset for vehicles that need thoughtful attention from cabin to paintwork.",
    time: "4–6 hours",
    image: "/service-signature-detail.png",
    imagePosition: "center",
  },
  {
    id: "interior-detail",
    name: "Interior Detail",
    detail: "Deep cleaning for high-touch surfaces, upholstery, carpets, glass, and the places daily use leaves behind.",
    time: "3–5 hours",
    image: "/service-interior-detail.png",
    imagePosition: "center",
  },
  {
    id: "maintenance-detail",
    name: "Maintenance Detail",
    detail: "Recurring care that keeps a well-kept vehicle crisp between larger correction or protection services.",
    time: "2–3 hours",
    image: "/service-maintenance.png",
    imagePosition: "center",
  },
  {
    id: "wheel-trim-care",
    name: "Wheel & Trim Care",
    detail: "Focused cleaning and finishing for wheels, tires, exterior trim, and the details that frame the whole vehicle.",
    time: "1–2 hours",
    image: "/service-wheel-care.png",
    imagePosition: "center",
  },
];

const steps = [
  {
    step: "Inspect",
    title: "Read the vehicle.",
    content:
      "We assess the paint, materials, and real condition—not just the vehicle class—before recommending a single service.",
    image: "/ford-hero/Ford Car 001.jpg",
    imagePosition: "center",
  },
  {
    step: "Refine",
    title: "Correct what matters.",
    content:
      "A tailored process addresses the defects that change the finish while preserving the surfaces your vehicle depends on.",
    image: "/ford-hero/Ford Car 075.jpg",
    imagePosition: "center",
  },
  {
    step: "Reveal",
    title: "Return it resolved.",
    content:
      "You receive a considered walkaround, practical care notes, and a finish ready for the Gulf light.",
    image: "/ford-hero/Ford Car 145.jpg",
    imagePosition: "center",
  },
];

function ScrollHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const targetFrameRef = useRef(0);
  const drawnFrameRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;
    const isMobile = window.matchMedia("(max-width: 720px)").matches;

    const draw = () => {
      rafRef.current = null;
      let index = targetFrameRef.current;

      while (index > 0 && !imagesRef.current[index]?.complete) index -= 1;
      const image = imagesRef.current[index];
      if (!image || !image.complete || image.naturalWidth === 0) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const sourceWidth = image.naturalWidth;
      const sourceHeight = Math.min(
        image.naturalHeight,
        sourceWidth / FRAME_CONTENT_ASPECT_RATIO,
      );
      const sourceX = (image.naturalWidth - sourceWidth) / 2;
      const sourceY = (image.naturalHeight - sourceHeight) / 2;
      const scale = Math.max(width / sourceWidth, height / sourceHeight);
      const drawWidth = sourceWidth * scale;
      const drawHeight = sourceHeight * scale;
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      context.fillStyle = "#102b3a";
      context.fillRect(0, 0, width, height);
      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        x,
        y,
        drawWidth,
        drawHeight,
      );
      drawnFrameRef.current = index;
    };

    const requestDraw = () => {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(draw);
    };

    const loadFrame = (index: number) => {
      if (imagesRef.current[index]) return;
      const image = new Image();
      image.decoding = "async";
      image.src = framePath(index + 1);
      image.onload = () => {
        if (index === 0) setReady(true);
        if (Math.abs(index - targetFrameRef.current) < 4 || drawnFrameRef.current < 0) requestDraw();
      };
      imagesRef.current[index] = image;
    };

    const initialFrameCount = isMobile ? 10 : 18;
    loadFrame(0);
    for (let index = 1; index < initialFrameCount; index += 1) loadFrame(index);

    let preloadIndex = initialFrameCount;
    const preload = () => {
      const end = Math.min(preloadIndex + 12, FRAME_COUNT);
      for (; preloadIndex < end; preloadIndex += 1) loadFrame(preloadIndex);
      if (preloadIndex < FRAME_COUNT) window.setTimeout(preload, 80);
    };
    const preloadTimer = isMobile ? null : window.setTimeout(preload, 250);

    const update = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const nextProgress = Math.min(1, Math.max(0, -rect.top / Math.max(1, scrollable)));
      targetFrameRef.current = Math.min(
        FRAME_COUNT - 1,
        Math.floor(nextProgress * (FRAME_COUNT - 1)),
      );
      loadFrame(targetFrameRef.current);
      if (isMobile) {
        loadFrame(Math.max(0, targetFrameRef.current - 1));
        loadFrame(Math.min(FRAME_COUNT - 1, targetFrameRef.current + 1));
      }
      setProgress(nextProgress);
      requestDraw();
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", requestDraw);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", requestDraw);
      if (preloadTimer !== null) window.clearTimeout(preloadTimer);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="scroll-hero" id="top" aria-label="Gulfline Auto Spa introduction">
      <div className="scroll-hero-stage">
        <header className="site-header hero-header">
          <a className="brand" href="#top" aria-label="Gulfline Auto Spa home">
            <span className="brand-mark">G</span>
            <span>Gulfline Auto Spa</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#services">Services</a>
            <a href="#process">Process</a>
            <a href="#quote">Quote</a>
          </nav>
          <a className="header-cta" href="#quote">Request a quote <span aria-hidden="true">↗</span></a>
        </header>

        <div className="scroll-hero-copy">
          <div className="hero-intro" style={{ opacity: Math.max(0, 1 - progress * 6) }}>
            <p className="hero-kicker">Tampa, Florida · Mobile &amp; studio detailing</p>
            <h1>Tampa Top <em>Car Detailer</em></h1>
            <p className="lede">Precision detailing for cars that live in the real world—crafted to stay brilliant through Gulf Coast sun, salt, and storms.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#quote">Request a quote <span aria-hidden="true">→</span></a>
              <a className="text-link" href="#services">View services</a>
            </div>
          </div>

          {heroMoments.map((moment) => {
            const [start, end] = moment.range;
            const center = (start + end) / 2;
            const half = (end - start) / 2;
            const visibility =
              "persist" in moment
                ? Math.min(1, Math.max(0, (progress - start) / (end - start)))
                : Math.max(0, 1 - Math.abs(progress - center) / half);
            return (
              <div
                className="hero-moment"
                key={moment.title}
                style={{ opacity: visibility, transform: `translate3d(0, calc(-50% + ${(1 - visibility) * 28}px), 0)` }}
                aria-hidden={visibility < 0.15}
              >
                <p className="hero-kicker">{moment.eyebrow}</p>
                <h2>{moment.title}</h2>
                <p className="hero-moment-body">{moment.body}</p>
                {"cta" in moment && (
                  <a
                    className="button button-primary hero-final-cta"
                    href="#quote"
                    tabIndex={visibility < 0.15 ? -1 : 0}
                  >
                    {moment.cta} <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <figure className="scroll-hero-visual">
          <canvas
            ref={canvasRef}
            className={`sequence-canvas ${ready ? "is-ready" : ""}`}
            aria-label="A classic Mustang rotates through a Tampa Bay scene as you scroll"
            role="img"
          />
          <img className="sequence-fallback" src={framePath(1)} alt="Classic blue Mustang by the coast" />
          <div className="sequence-wash" aria-hidden="true" />
        </figure>

        <div className="scroll-cue" style={{ opacity: Math.max(0, 1 - progress * 8) }} aria-hidden="true">
          <span>Scroll to explore</span><i />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [service, setService] = useState("Paint Correction");
  const [vehicle, setVehicle] = useState("Sedan");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main>
      <ScrollHero />

      <Gallery6
        heading="Choose the care your car needs."
        description="Explore the full Gulfline service menu. We’ll tailor the final treatment after seeing the vehicle in person."
        items={services.map((item) => ({
          id: item.id,
          title: item.name,
          summary: item.detail,
          url: "#quote",
          image: item.image,
          meta: `Typical time · ${item.time}`,
          imagePosition: item.imagePosition,
          cropLetterbox: item.cropLetterbox,
        }))}
        onItemSelect={(item) => setService(item.title)}
      />

      <section className="trust section" aria-labelledby="trust-title">
        <div className="trust-heading">
          <div>
            <p className="section-label">Our Reviews</p>
            <h2 id="trust-title">
              Great detailing is more than a glossy finish. It is clear advice,
              careful workmanship, and the confidence of knowing your vehicle
              received the right treatment from the start.
            </h2>
          </div>

          <div className="trust-proof">
            <p className="trust-kicker">Trusted by thousands</p>
            <div className="trust-social">
              <div className="trust-faces" aria-hidden="true">
                <img src="/client-portrait-1.png" alt="" loading="lazy" decoding="async" />
                <img src="/client-portrait-2.png" alt="" loading="lazy" decoding="async" />
                <img src="/client-portrait-3.png" alt="" loading="lazy" decoding="async" />
              </div>
              <div className="trust-rating">
                <span
                  className="trust-stars-art"
                  role="img"
                  aria-label="Rated 4.5 out of 5 stars"
                />
                <small>10K+ Reviews</small>
              </div>
            </div>
            <p>
              For five years, our experts have perfected the detail on premium
              vehicles like this 1969 Mustang. We deliver meticulous care you
              can rely on.
            </p>
          </div>
        </div>

        <figure className="trust-car">
          <img src="/mustang-trust-transparent-v2.png" alt="Red 1969 Mustang in full side profile" loading="lazy" decoding="async" />
        </figure>
      </section>

      <section className="process section" id="process">
        <p className="section-label">The Gulfline method</p>
        <FeatureSteps
          features={steps}
          title="Clear from the first look."
        />
      </section>

      <section className="quote section" id="quote">
        <div className="quote-copy">
          <p className="section-label light">Request a quote</p>
          <h2>Tell us about your car.</h2>
          <p>Choose a starting point and we’ll confirm the right treatment after reviewing its condition and your goals.</p>
          <div className="availability">Currently welcoming Tampa Bay quote requests</div>
        </div>

        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>1. Choose a service</legend>
            <div className="choice-grid">
              {services.map((item) => (
                <label key={item.name} className={service === item.name ? "selected" : ""}>
                  <input type="radio" name="service" value={item.name} checked={service === item.name} onChange={() => setService(item.name)} />
                  <span>{item.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>2. Tell us about the vehicle</legend>
            <div className="choice-grid vehicle-choices">
              {["Sedan", "SUV / Truck", "Coupe / Exotic"].map((item) => (
                <label key={item} className={vehicle === item ? "selected" : ""}>
                  <input type="radio" name="vehicle" value={item} checked={vehicle === item} onChange={() => setVehicle(item)} />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="form-row">
            <label><span>Name</span><input required name="name" autoComplete="name" placeholder="Your name" /></label>
            <label><span>Email</span><input required type="email" name="email" autoComplete="email" placeholder="you@example.com" /></label>
          </div>
          <label className="notes"><span>What would you like us to know?</span><textarea name="notes" rows={3} placeholder="Vehicle year, model, paint condition, timing…" /></label>
          <button className="button submit-button" type="submit">Request my quote <span aria-hidden="true">→</span></button>
          {submitted && <p className="form-success" role="status">Your {service.toLowerCase()} request for a {vehicle.toLowerCase()} is ready. This demo form can be connected to your preferred inbox or booking system before launch.</p>}
        </form>
      </section>

      <section className="statement">
        <div className="statement-heading">
          <p className="section-label">The Gulfline approach</p>
          <h2>Quality car service you can trust.</h2>
        </div>
        <figure className="craft-photo">
          <img src="/approach-interior.jpeg" alt="A freshly detailed Mustang interior in the Gulfline studio" loading="lazy" decoding="async" />
          <figcaption>Interior detailing in the Tampa studio</figcaption>
        </figure>
        <div className="statement-grid">
          <p>We pair modern paint knowledge with careful handwork. Every recommendation starts with the vehicle in front of us and the conditions it actually lives in.</p>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark">G</span><span>Gulfline Auto Spa</span></a>
        <p>Modern vehicle care, made for Tampa Bay.</p>
        <div><a href="#services">Services</a><a href="#process">Process</a><a href="#quote">Request a quote</a></div>
        <small>© 2026 Gulfline Auto Spa · Tampa, Florida</small>
      </footer>
    </main>
  );
}
