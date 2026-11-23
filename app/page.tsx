import FeaturedProjects from "@/components/FeaturedProjects";
import Hero from "@/components/Hero";
import SmoothScroll from "@/components/SmoothScroll";
import { featured } from "@/lib/projects";

export default function Home() {
  return (
    <SmoothScroll>
      <Hero />
      <main>
        {/* First two featured projects for now. The rest, the grid and contact come next. */}
        <FeaturedProjects projects={featured.slice(0, 2)} />
      </main>
      <footer className="end">
        <p>Six more projects, the grid of smaller builds and contact are coming next.</p>
      </footer>
    </SmoothScroll>
  );
}
