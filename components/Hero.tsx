"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".w", { y: 60, autoAlpha: 0, duration: 1.1, stagger: 0.1, ease: "power3.out" });
        gsap.from(".hero-foot", { y: 30, autoAlpha: 0, duration: 0.9, delay: 0.35, ease: "power3.out" });
      });
    },
    { scope: root },
  );

  return (
    <header className="hero" ref={root}>
      <nav>
        <a href="#work">Work</a>
        <a href="#builds">Smaller builds</a>
        <a href="#contact">Contact</a>
      </nav>
      <h1 className="display">
        <span className="l">
          <span className="w">Chase</span>
        </span>
        <span className="l">
          <span className="w">Vandiver</span>
        </span>
      </h1>
      <div className="hero-foot glass">
        {/* Draft line. Chase to rewrite. */}
        <p>
          I build and ship software: apps, betting models and AI systems that my friends and
          family use every week.
        </p>
        <span className="cue">
          Scroll <i />
        </span>
      </div>
    </header>
  );
}
