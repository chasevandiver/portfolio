import Builds from "@/components/Builds";
import Contact from "@/components/Contact";
import FeaturedProjects from "@/components/FeaturedProjects";
import Hero from "@/components/Hero";
import SmoothScroll from "@/components/SmoothScroll";
import { featured, grid } from "@/lib/projects";

export default function Home() {
  return (
    <SmoothScroll>
      <Hero />
      <main>
        <FeaturedProjects projects={featured} />
        <Builds projects={grid} />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
