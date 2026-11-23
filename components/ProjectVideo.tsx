"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/lib/projects";

/**
 * The screen inside a device frame. Shows a placeholder until the project has
 * a clip. A real clip is muted, loops, has a poster, and only loads and plays
 * while it is near the viewport.
 */
export default function ProjectVideo({ project }: { project: Project }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // No autoplay: show the poster and let the visitor start it.
      el.controls = true;
      el.preload = "metadata";
      el.src = project.video;
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.src) el.src = project.video;
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [project.video]);

  if (!project.video) {
    return (
      <div className="screen">
        <span className="play" />
        <span>Video placeholder</span>
        <small>{project.viewport === "mobile" ? "Phone" : "Desktop"} clip, muted loop</small>
      </div>
    );
  }

  return (
    <div className="screen">
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="none"
        poster={project.poster || undefined}
        aria-label={`${project.name} screen recording`}
      />
    </div>
  );
}
