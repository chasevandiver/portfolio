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
          {project.highlights.length > 0 && (
            <ul className="highlights">
              {project.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
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
  const triggers = useRef<ScrollTrigger[]>([]);

  // Jump to the point in a project's pinned scroll where its content has arrived.
  const goTo = (i: number) => {
    const st = triggers.current[i];
    if (!st) return;
    const top = st.start + (st.end - st.start) * 0.42;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(top);
    else window.scrollTo(0, top);
  };

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
            const dots = gsap.utils.toArray<HTMLElement>(".rail button", el);

            sections.forEach((sec, i) => {
              light(sec, i);
              const q = gsap.utils.selector(sec);
              const device = q(".device")[0] as HTMLElement;
              const dot = dots[i];
              const tl = gsap
                .timeline({
                  defaults: { ease: "none" },
                  scrollTrigger: {
                    trigger: sec, start: "top top", end: "+=320%", pin: true, scrub: 0.7, invalidateOnRefresh: true,
                    onToggle: (self) => dot?.classList.toggle("active", self.isActive),
                  },
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
                // Read: the panels keep drifting at different rates.
                .addLabel("hold", 4.1)
                .to(q(".card.l"), { y: -16, duration: 1.2 }, "hold")
                .to(q(".card.r"), { y: -40, duration: 1.2 }, "hold")
                // Focus: the panels step aside and the video takes the screen.
                .addLabel("focus", 5.3)
                .to(q(".card.l"), { x: -120, autoAlpha: 0, duration: 1, ease: "power2.in" }, "focus")
                .to(q(".card.r"), { x: 120, autoAlpha: 0, duration: 1, ease: "power2.in" }, "focus")
                .to(q(".name"), { autoAlpha: 0.14, y: -40, duration: 1.2, ease: "power2.inOut" }, "focus")
                .to(
                  device,
                  {
                    scale: () => Math.min(1.5, (innerHeight * 0.86) / device.offsetHeight, (innerWidth * 0.88) / device.offsetWidth),
                    y: () => -parseFloat(getComputedStyle(device).marginTop) / 2,
                    duration: 1.6,
                    ease: "power3.inOut",
                  },
                  "focus+=0.1",
                )
                .to(q(".halo"), { scale: 1.3, duration: 1.6, ease: "power3.inOut" }, "focus+=0.1")
                .to({}, { duration: 1.4 })
                // Leave: device recedes and dims while the light changes colour.
                .addLabel("out")
                .to(device, { z: -620, rotationX: -22, yPercent: -18, autoAlpha: 0, duration: 1.5, ease: "power2.in" }, "out")
                .to(q(".name"), { autoAlpha: 0, duration: 0.8 }, "out")
                .to(q(".halo"), { autoAlpha: 0, duration: 1.3 }, "out+=0.2");
              triggers.current[i] = tl.scrollTrigger!;
            });
            // Created after the pins so its range includes their spacing.
            ScrollTrigger.create({
              trigger: el, start: "top 40%", end: "bottom 60%",
              toggleClass: { targets: ".rail", className: "on" },
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

          // Past the last project the light fades back to neutral for the rest of the page.
          gsap.fromTo(
            ambient,
            { backgroundColor: prev },
            {
              backgroundColor: HERO_LIGHT, opacity: 0.26, ease: "none", immediateRender: false,
              scrollTrigger: { trigger: ".work-end", start: "top bottom", end: "top top", scrub: true },
            },
          );

          return () => el.classList.remove("pinned");
        },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root} id="work">
      <div className="ambient" aria-hidden="true" />
      <nav className="rail" aria-label="Featured projects">
        {projects.map((project, i) => (
          <button
            key={project.slug}
            type="button"
            onClick={() => goTo(i)}
            style={{ "--accent": project.accent } as React.CSSProperties}
          >
            <span>{project.name}</span>
          </button>
        ))}
      </nav>
      {projects.map((project, i) => (
        <ProjectSection key={project.slug} project={project} cover={i > 0} />
      ))}
      <div className="work-end" />
    </div>
  );
}
