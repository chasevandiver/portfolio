import data from "@/data/projects.json";

export type Project = {
  slug: string;
  name: string;
  blurb: string;
  category: string;
  stack: string[];
  url: string;
  video: string;
  poster: string;
  accent: string;
  featured: boolean;
  viewport: "mobile" | "desktop";
};

export const projects = data as Project[];
export const featured = projects.filter((p) => p.featured);
export const grid = projects.filter((p) => !p.featured);
