import Link from "next/link";
import { notFound } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  CloudCog,
  Database,
  ExternalLink,
  Figma,
  Github,
  Leaf,
  Send,
  ShipWheel,
  TerminalSquare,
  Waypoints,
} from "lucide-react";

type Tech = {
  name: string;
  Icon: LucideIcon;
  colorClass: string;
  summary: string;
  docsUrl: string;
};

const TECH_MAP: Record<string, Tech> = {
  java: {
    name: "Java",
    Icon: Waypoints,
    colorClass: "text-[#f89820]",
    summary:
      "Used for backend API development with clean architecture and strong type safety.",
    docsUrl: "https://docs.oracle.com/en/java/",
  },
  spring: {
    name: "Spring",
    Icon: Leaf,
    colorClass: "text-[#6db33f]",
    summary:
      "Used to build REST APIs, service layers, validation rules, and production-grade backend flows.",
    docsUrl: "https://spring.io/projects/spring-boot",
  },
  postgresql: {
    name: "PostgreSQL",
    Icon: Database,
    colorClass: "text-[#4169e1]",
    summary:
      "Used for relational schema design, indexes, query optimization, and reliable persistence.",
    docsUrl: "https://www.postgresql.org/docs/",
  },
  docker: {
    name: "Docker",
    Icon: ShipWheel,
    colorClass: "text-[#2496ed]",
    summary:
      "Used to containerize backend services for consistent local and deployment environments.",
    docsUrl: "https://docs.docker.com/",
  },
  github: {
    name: "GitHub",
    Icon: Github,
    colorClass: "text-white",
    summary:
      "Used for version control workflows, pull requests, collaboration, and CI integrations.",
    docsUrl: "https://docs.github.com/",
  },
  aws: {
    name: "AWS",
    Icon: CloudCog,
    colorClass: "text-[#ff9900]",
    summary:
      "Used for cloud deployment concepts, service integration, and scalable infrastructure practices.",
    docsUrl: "https://docs.aws.amazon.com/",
  },
  linux: {
    name: "Linux",
    Icon: TerminalSquare,
    colorClass: "text-[#fcc624]",
    summary:
      "Used for daily CLI workflows, process management, scripts, and server-side troubleshooting.",
    docsUrl: "https://www.kernel.org/doc/html/latest/",
  },
  figma: {
    name: "Figma",
    Icon: Figma,
    colorClass: "text-[#a259ff]",
    summary:
      "Used for UI wireframes, component thinking, and collaboration between design and implementation.",
    docsUrl: "https://help.figma.com/",
  },
  postman: {
    name: "Postman",
    Icon: Send,
    colorClass: "text-[#ff6c37]",
    summary:
      "Used to test REST APIs, manage request collections, and document endpoints during backend development.",
    docsUrl: "https://learning.postman.com/docs/introduction/overview/",
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(TECH_MAP).map((slug) => ({ slug }));
}

export default async function TechPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tech = TECH_MAP[slug];

  if (!tech) notFound();

  return (
    <main className="daytona-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-5 sm:py-14">
        <Link
          href="/#skills"
          className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to skills
        </Link>

        <section className="panel mt-6 rounded-2xl p-5 sm:p-8 md:p-10">
          <div className="flex items-center gap-4">
            <tech.Icon className={`h-9 w-9 ${tech.colorClass}`} />
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              {tech.name}
            </h1>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            {tech.summary}
          </p>

          <a
            href={tech.docsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost mt-8 inline-flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            Open official docs
            <ExternalLink className="h-4 w-4" />
          </a>
        </section>
      </div>
    </main>
  );
}
