"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/lib/projects";
import ProjectVideo from "./ProjectVideo";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HERO_LIGHT = "#46507a";

function host(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function ProjectSection({ project, cover }: { project: Project; cover: boolean }) {
  const classes = ["project", project.viewport === "mobile" && "mobile-vp", cover && "cover"]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={classes}
      id={project.slug}
      data-accent={project.accent}
      style={{ "--accent": project.accent } as React.CSSProperties}
    >
      <h2 className="name display">
        {project.name.split(" ").map((word, i) => (
          <span key={i}>
            {i > 0 && " "}
            <span className="w">{word}</span>
          </span>
        ))}
      </h2>
      <div className="stage">
        <div className="halo" />
        <div className={`device ${project.viewport}`}>
          <ProjectVideo project={project} />
        </div>
      </div>
      <div className="panels">
        <div className="glass card l">
          <span className="cat">{project.category}</span>
          <p className="blurb">{project.blurb}</p>
        </div>
        <div className="glass card r">
          {project.stack.length > 0 && (
            <ul className="tags">
              {project.stack.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
          {project.url ? (
            <a className="live" href={project.url} target="_blank" rel="noreferrer">
              Open {host(project.url)}
            </a>
          ) : (
            <span className="soon">Live link coming soon</span>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Featured project sections plus the ambient light behind them.
 * All ScrollTriggers are created here, in page order, so pins refresh correctly.
 */
export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const ambient = el.querySelector(".ambient");
      const sections = gsap.utils.toArray<HTMLElement>(".project", el);
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };

          // The light moves behind the device and takes each project's colour as it arrives.
          let prev = HERO_LIGHT;
          const light = (sec: HTMLElement, i: number) => {
            const accent = sec.dataset.accent!;
            const st = { trigger: sec, start: "top bottom", end: "top top", scrub: true };
            gsap.fromTo(
              ambient,
              { backgroundColor: prev },
              { backgroundColor: accent, ease: "none", immediateRender: false, scrollTrigger: st },
            );
            if (i === 0) {
              gsap.to(ambient, { x: 0, y: 0, opacity: 0.42, ease: "none", scrollTrigger: { ...st } });
            }
            prev = accent;
          };

          if (desktop) {
            el.classList.add("pinned");

            sections.forEach((sec, i) => {
              light(sec, i);
              const q = gsap.utils.selector(sec);
              gsap
                .timeline({
                  defaults: { ease: "none" },
                  scrollTrigger: { trigger: sec, start: "top top", end: "+=260%", pin: true, scrub: 0.7 },
                })
                // Arrive: device swings up out of depth and settles flat.
                .from(q(".name .w"), { y: 90, autoAlpha: 0, duration: 1.3, stagger: 0.14, ease: "power3.out" }, 0)
                .from(q(".halo"), { autoAlpha: 0, scale: 0.6, duration: 2.6, ease: "power2.out" }, 0.2)
                .from(
                  q(".device"),
                  { rotationX: 58, rotationY: -20, rotationZ: 7, z: -700, yPercent: 55, duration: 3.2, ease: "power3.out" },
                  0.2,
                )
                .from(q(".device"), { autoAlpha: 0, duration: 0.9 }, 0.2)
                .from(q(".card.l"), { x: -70, y: 110, autoAlpha: 0, duration: 1.5, ease: "power3.out" }, 2.1)
                .from(q(".card.r"), { x: 90, y: 190, autoAlpha: 0, duration: 1.8, ease: "power3.out" }, 2.3)
                // Hold, with the layers still drifting at different rates.
                .addLabel("hold", 4.1)
                .to(q(".card.l"), { y: -24, duration: 2.6 }, "hold")
                .to(q(".card.r"), { y: -64, duration: 2.6 }, "hold")
                .to(q(".name"), { y: -18, duration: 2.6 }, "hold")
                // Leave: device recedes and dims while the light changes colour.
                .addLabel("out", 6.7)
                .to(q(".device"), { z: -620, rotationX: -22, yPercent: -18, autoAlpha: 0, duration: 1.5, ease: "power2.in" }, "out")
                .to(q(".card"), { autoAlpha: 0, y: "-=60", duration: 0.9, stagger: 0.1, ease: "power2.in" }, "out")
                .to(q(".name .w"), { autoAlpha: 0, y: -50, duration: 0.9, stagger: 0.06, ease: "power2.in" }, "out+=0.3")
                .to(q(".halo"), { autoAlpha: 0, duration: 1.3 }, "out+=0.2");
            });
          } else {
            sections.forEach((sec, i) => {
              light(sec, i);
              const q = gsap.utils.selector(sec);
              gsap.from(q(".name .w"), {
                y: 40, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: "power3.out",
                scrollTrigger: { trigger: sec, start: "top 75%", once: true },
              });
              gsap
                .timeline({ scrollTrigger: { trigger: q(".stage")[0], start: "top 80%", once: true } })
                .from(q(".halo"), { autoAlpha: 0, scale: 0.7, duration: 1.2, ease: "power2.out" })
                .from(q(".device"), { rotationX: 24, y: 60, autoAlpha: 0, duration: 1.1, ease: "power3.out" }, 0);
              gsap.from(q(".card"), {
                y: 40, autoAlpha: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
                scrollTrigger: { trigger: q(".panels")[0], start: "top 85%", once: true },
              });
            });
          }

          return () => el.classList.remove("pinned");
        },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root} id="work">
      <div className="ambient" aria-hidden="true" />
      {projects.map((project, i) => (
        <ProjectSection key={project.slug} project={project} cover={i > 0} />
      ))}
    </div>
  );
}
