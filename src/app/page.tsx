import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CloudCog,
  Database,
  Figma,
  Github,
  Linkedin,
  Leaf,
  LucideIcon,
  Send,
  ShipWheel,
  TerminalSquare,
  Waypoints,
} from "lucide-react";
import DaytonaCode from "@/components/DaytonaCode";
import TabsWithCode from "@/components/TabsWithCode";

function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4 sm:px-5">{children}</div>;
}

function TopBar() {
  return (
    <div className="border-b border-white/10 bg-black/20">
      <Container>
        <div className="mono py-2 text-center text-[11px] leading-relaxed text-white/60 sm:text-xs">
          Backend Portfolio for Engineering at Scale //{" "}
          <span className="text-white/80">Open for Internship</span>
        </div>
      </Container>
    </div>
  );
}

function Navbar() {
  return (
    <header className="pt-4 sm:pt-6">
      <Container>
        <nav className="flex flex-wrap items-start justify-between gap-4 sm:items-center">
          <div className="flex min-w-0 items-center gap-3 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="brd grid h-10 w-10 place-items-center rounded-lg bg-white/5 font-bold">
                S
              </div>
              <div className="min-w-0 leading-tight">
                <div className="text-xs font-semibold sm:text-sm">
                  Sudharaka Lakshan
                </div>
                <div className="hidden text-xs text-white/55 sm:block">
                  Backend-Focused SE Undergraduate
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-5 text-sm md:flex">
              <a className="link" href="#projects">
                Projects
              </a>
              <a className="link" href="#skills">
                Skills
              </a>
              <a className="link" href="#experience">
                Experience
              </a>
              <a className="link" href="#contact">
                Contact
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <a
              className="brd grid h-10 w-10 place-items-center rounded-lg bg-white/5 transition hover:bg-white/10"
              href="https://github.com/sudharaka2010"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4 text-white/70" />
            </a>
            <a
              className="brd grid h-10 w-10 place-items-center rounded-lg bg-white/5 transition hover:bg-white/10"
              href="https://linkedin.com/in/sudharaka-thilakasiri-229575199"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4 text-white/70" />
            </a>
            <a className="btn-ghost" href="#contact">
              Hire Me
            </a>
          </div>
        </nav>

        <div className="mt-2 flex items-center gap-4 overflow-x-auto pb-1 text-sm md:hidden">
          <a className="link whitespace-nowrap" href="#projects">
            Projects
          </a>
          <a className="link whitespace-nowrap" href="#skills">
            Skills
          </a>
          <a className="link whitespace-nowrap" href="#experience">
            Experience
          </a>
          <a className="link whitespace-nowrap" href="#contact">
            Contact
          </a>
        </div>
      </Container>
    </header>
  );
}

function Hero() {
  const pythonLines = [
    {
      html: `<span class="tok-cyan">from</span> <span class="tok-blue">portfolio</span> <span class="tok-cyan">import</span> <span class="tok-yellow">Sudharaka</span>`,
    },
    { html: `` },
    {
      html: `<span class="tok-fg">me</span> <span class="tok-dim">=</span> <span class="tok-yellow">Sudharaka</span><span class="tok-fg">(</span>`,
    },
    {
      html: `  <span class="tok-blue">role</span><span class="tok-dim">=</span><span class="tok-purple">"Backend-Focused SE Undergraduate"</span>,`,
    },
    {
      html: `  <span class="tok-blue">stack</span><span class="tok-dim">=</span>[<span class="tok-purple">"Java"</span>, <span class="tok-purple">"Spring Boot"</span>, <span class="tok-purple">"PostgreSQL"</span>, <span class="tok-purple">"Docker"</span>],`,
    },
    { html: `<span class="tok-fg">)</span>` },
    { html: `` },
    {
      html: `<span class="tok-yellow">print</span><span class="tok-fg">(</span><span class="tok-blue">me</span><span class="tok-fg">.</span><span class="tok-blue">open_to</span><span class="tok-fg">(</span><span class="tok-purple">"Backend Internship"</span><span class="tok-fg">))</span>`,
    },
  ];

  return (
    <section className="pb-12 pt-10 sm:pb-14 sm:pt-16">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Build Backend Systems.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
              Backend-focused Software Engineering undergraduate building RESTful
              APIs with <span className="text-white/85">Java and Spring Boot</span>,{" "}
              strong in{" "}
              <span className="text-white/85">relational databases</span>, learning{" "}
              <span className="text-white/85">Docker + DevOps</span>.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a className="btn-primary text-center" href="#projects">
                View Projects
              </a>
              <a
                className="btn-ghost inline-flex items-center justify-center gap-2"
                href="#contact"
              >
                Contact <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mono mt-7 flex flex-wrap gap-3 text-xs text-white/70">
              {[
                "Java",
                "Spring Boot",
                "REST APIs",
                "PostgreSQL / MySQL",
                "Docker",
              ].map((t) => (
                <span key={t} className="brd rounded-lg bg-white/5 px-3 py-1">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <DaytonaCode
              title="pip install sudharaka"
              leftBadges={["Py", "TS"]}
              lines={pythonLines}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

function LogoWall() {
  const items: Array<{
    name: string;
    slug: string;
    Icon: LucideIcon;
    hoverIconClass: string;
  }> = [
    {
      name: "Java",
      slug: "java",
      Icon: Waypoints,
      hoverIconClass: "group-hover:text-[#f89820]",
    },
    {
      name: "Spring",
      slug: "spring",
      Icon: Leaf,
      hoverIconClass: "group-hover:text-[#6db33f]",
    },
    {
      name: "PostgreSQL",
      slug: "postgresql",
      Icon: Database,
      hoverIconClass: "group-hover:text-[#4169e1]",
    },
    {
      name: "Docker",
      slug: "docker",
      Icon: ShipWheel,
      hoverIconClass: "group-hover:text-[#2496ed]",
    },
    {
      name: "GitHub",
      slug: "github",
      Icon: Github,
      hoverIconClass: "group-hover:text-white",
    },
    {
      name: "AWS",
      slug: "aws",
      Icon: CloudCog,
      hoverIconClass: "group-hover:text-[#ff9900]",
    },
    {
      name: "Linux",
      slug: "linux",
      Icon: TerminalSquare,
      hoverIconClass: "group-hover:text-[#fcc624]",
    },
    {
      name: "Figma",
      slug: "figma",
      Icon: Figma,
      hoverIconClass: "group-hover:text-[#a259ff]",
    },
    {
      name: "Postman",
      slug: "postman",
      Icon: Send,
      hoverIconClass: "group-hover:text-[#ff6c37]",
    },
  ];

  return (
    <section id="skills" className="py-12 sm:py-16">
      <Container>
        <div>
          <div className="mono px-2 py-2 text-xs text-white/65 sm:text-sm">
            Tools and technologies I use
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {items.map((item) => (
              <Link
                key={item.slug}
                href={`/tech/${item.slug}`}
                className={[
                  "group grid h-24 place-items-center gap-2 rounded-xl border border-white/10 px-2 text-center sm:h-28 sm:gap-3 sm:px-3",
                  "bg-white/[0.015] transition-colors duration-200",
                  "hover:border-emerald-400/35 hover:bg-emerald-500/[0.08]",
                ].join(" ")}
              >
                <item.Icon
                  className={[
                    "h-5 w-5 text-white/40 transition-colors duration-200 sm:h-6 sm:w-6",
                    item.hoverIconClass,
                  ].join(" ")}
                />
                <span className="text-sm font-semibold text-white/80 transition-colors duration-200 group-hover:text-emerald-100 sm:text-base">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Feature3() {
  const cards = [
    {
      title: "REST API Development",
      desc: "Clean Controller-Service-Repository APIs with validation and error handling.",
      videoSrc: "/videos/rest-api.mp4",
      videoLabel: "API Flow",
    },
    {
      title: "Database Design",
      desc: "Relational modeling, normalization, and efficient CRUD workflows.",
      videoSrc: "/videos/database-design.mp4",
      videoLabel: "Schema + Query",
    },
    {
      title: "DevOps Exposure",
      desc: "Docker basics, environments, CI/CD exposure and Linux CLI habits.",
      videoSrc: "/videos/devops.mp4",
      videoLabel: "Docker + CI",
    },
  ];

  return (
    <section id="experience" className="py-12 sm:py-16">
      <Container>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          Fast, Clean, Practical
          <div className="text-white/55">Backend Engineering Focus.</div>
        </h2>

        <div className="brd mt-8 grid grid-cols-1 overflow-hidden rounded-2xl md:mt-10 md:grid-cols-3">
          {cards.map((c, idx) => (
            <div
              key={c.title}
              className={[
                "group p-5 sm:p-8",
                "border-white/10",
                idx !== cards.length - 1 ? "border-b md:border-b-0" : "",
                idx !== cards.length - 1 ? "md:border-r" : "",
              ].join(" ")}
            >
              <div className="mono text-lg font-semibold">{c.title}</div>
              <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
                {c.desc}
              </p>
              <div className="brd relative mt-6 h-32 overflow-hidden rounded-xl bg-black/50 sm:mt-10 sm:h-36">
                <video
                  className="h-full w-full object-cover opacity-80 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
                  src={c.videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={`${c.title} video preview`}
                >
                  Your browser does not support the video tag.
                </video>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 px-3 pb-2">
                  <span className="mono rounded-md border border-emerald-300/30 bg-emerald-400/12 px-2 py-0.5 text-[10px] tracking-[0.14em] text-emerald-100/90">
                    {c.videoLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 py-14 sm:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="brd grid h-10 w-10 place-items-center rounded-lg bg-white/5 font-bold">
                S
              </div>
              <div>
                <div className="font-semibold">Sudharaka Lakshan</div>
                <div className="text-xs text-white/55">Backend Portfolio</div>
              </div>
            </div>

            <p className="mt-5 max-w-xl break-words leading-relaxed text-white/60">
              Contact:{" "}
              <span className="text-white/80">sudharaka.lakshan@outlook.com</span>{" "}
              - <span className="text-white/80">+94 77 858 7128</span>
            </p>
          </div>

          <div>
            <div className="mono mb-3 text-xs text-white/50">SECTIONS</div>
            <div className="space-y-2">
              <a className="link block" href="#projects">
                Projects
              </a>
              <a className="link block" href="#skills">
                Skills
              </a>
              <a className="link block" href="#experience">
                Experience
              </a>
            </div>
          </div>

          <div>
            <div className="mono mb-3 text-xs text-white/50">FOLLOW</div>
            <div className="space-y-2">
              <a
                className="link block"
                href="https://github.com/sudharaka2010"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                className="link block"
                href="https://linkedin.com/in/sudharaka-thilakasiri-229575199"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-xs text-white/45">
          (c) {new Date().getFullYear()} Sudharaka Lakshan Thilakasiri
        </div>
      </Container>
    </footer>
  );
}

export default function Page() {
  return (
    <main className="daytona-bg min-h-screen">
      <TopBar />
      <Navbar />
      <Hero />
      <LogoWall />
      <Feature3 />

      <section id="projects" className="py-12 sm:py-16">
        <Container>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Programmatic Control.
            <div className="text-white/55">File, Git, LSP, and Execute API.</div>
          </h2>

          <TabsWithCode />
        </Container>
      </section>

      <Footer />
    </main>
  );
}
