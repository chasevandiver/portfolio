import { featured, grid } from "@/lib/projects";

const directions = [
  { href: "/design/direction-a.html", name: "A: Launch" },
  { href: "/design/direction-b.html", name: "B: Precision" },
  { href: "/design/direction-c.html", name: "C: Depth" },
];

// Interim page. The real site is built once a design direction is picked.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-8 p-8">
      <h1 className="text-4xl font-semibold tracking-tight">Chase Vandiver</h1>
      <p className="text-neutral-400">
        Design directions for the portfolio. {featured.length} featured
        projects and {grid.length} smaller builds are seeded in
        data/projects.json.
      </p>
      <ul className="flex flex-col gap-3 text-xl">
        {directions.map((d) => (
          <li key={d.href}>
            <a className="underline underline-offset-4" href={d.href}>
              {d.name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
