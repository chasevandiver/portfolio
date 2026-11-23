"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/lib/projects";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Index of smaller builds: a plain list, not cards. */
export default function Builds({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".build", { autoAlpha: 0, y: 24 });
        ScrollTrigger.batch(".build", {
          start: "top 88%",
          once: true,
          onEnter: (rows) =>
            gsap.to(rows, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" }),
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="builds" id="builds" ref={root}>
      <h2 className="display">Smaller builds</h2>
      <ul>
        {projects.map((p) => {
          const hasBlurb = p.blurb && p.blurb !== "TODO";
          const body = (
            <>
              <span className="b-name">{p.name}</span>
              {hasBlurb && <span className="b-blurb">{p.blurb}</span>}
              <span className="b-cat">{p.category}</span>
            </>
          );
          return (
            <li className="build" key={p.slug}>
              {p.url ? (
                <a href={p.url} target="_blank" rel="noreferrer">
                  {body}
                </a>
              ) : (
                <div>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
