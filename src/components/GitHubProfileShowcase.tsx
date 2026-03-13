import Image from "next/image";
import {
  ArrowUpRight,
  CalendarDays,
  Code2,
  Database,
  ExternalLink,
  FolderGit2,
  Github,
  GitFork,
  Globe,
  LayoutTemplate,
  MonitorSmartphone,
  Star,
  TerminalSquare,
  Users,
  Waypoints,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { GitHubShowcaseData } from "@/lib/github-profile";

const CONTRIBUTION_LEVEL_CLASSES = [
  "bg-white/[0.05]",
  "bg-emerald-900/55",
  "bg-emerald-700/75",
  "bg-emerald-500/80",
  "bg-emerald-300/95",
] as const;

const REPO_CARD_VARIANTS = [
  {
    radius: "36px 26px 34px 24px",
    background:
      "radial-gradient(circle at top left, rgba(34, 197, 94, 0.12), transparent 38%), rgba(255, 255, 255, 0.025)",
    orbClass: "border-emerald-300/14 bg-emerald-400/10 text-emerald-100",
  },
  {
    radius: "28px 38px 24px 36px",
    background:
      "radial-gradient(circle at top right, rgba(56, 189, 248, 0.12), transparent 38%), rgba(255, 255, 255, 0.025)",
    orbClass: "border-sky-300/14 bg-sky-400/10 text-sky-100",
  },
  {
    radius: "38px 30px 26px 34px",
    background:
      "radial-gradient(circle at top left, rgba(250, 204, 21, 0.12), transparent 36%), rgba(255, 255, 255, 0.025)",
    orbClass: "border-amber-300/14 bg-amber-400/10 text-amber-100",
  },
] as const;

const TOOL_ICON_LIBRARY: Array<{
  label: string;
  Icon: LucideIcon;
  colorClass: string;
  languages?: string[];
  topics?: string[];
  useHomepage?: boolean;
  always?: boolean;
}> = [
  {
    label: "GitHub",
    Icon: Github,
    colorClass: "text-white",
    always: true,
  },
  {
    label: "TypeScript",
    Icon: Code2,
    colorClass: "text-sky-300",
    languages: ["TypeScript"],
  },
  {
    label: "Java",
    Icon: Waypoints,
    colorClass: "text-[#f89820]",
    languages: ["Java"],
  },
  {
    label: "Flutter / Dart",
    Icon: MonitorSmartphone,
    colorClass: "text-cyan-300",
    languages: ["Dart"],
  },
  {
    label: "Backend / Data",
    Icon: Database,
    colorClass: "text-violet-300",
    languages: ["PHP"],
    topics: ["postgresql", "hibernate-jpa", "spring-boot-3"],
  },
  {
    label: "Frontend",
    Icon: LayoutTemplate,
    colorClass: "text-amber-200",
    languages: ["HTML"],
  },
  {
    label: "Web deployment",
    Icon: Globe,
    colorClass: "text-emerald-200",
    useHomepage: true,
  },
  {
    label: "CLI workflow",
    Icon: TerminalSquare,
    colorClass: "text-white/80",
    topics: ["cli", "console-app"],
  },
] as const;

function formatMonthYear(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatJoinedDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function humanizeRepoName(name: string) {
  return name
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function trimDescription(text: string, maxLength = 165) {
  if (text.length <= maxLength) {
    return text;
  }

  const sliced = text.slice(0, maxLength).trimEnd();
  const boundary = sliced.lastIndexOf(" ");
  const safeSlice = boundary > maxLength * 0.6 ? sliced.slice(0, boundary) : sliced;

  return `${safeSlice}...`;
}

function splitContributionHeading(heading: string) {
  const match = heading.match(/^([\d,]+)\s+(.+)$/);

  if (!match) {
    return null;
  }

  return {
    count: match[1],
    label: match[2],
  };
}

function getToolShowcase(data: GitHubShowcaseData) {
  const languageSet = new Set(
    data.repos
      .map((repo) => repo.language)
      .filter((language): language is string => Boolean(language)),
  );
  const topicSet = new Set(
    data.repos.flatMap((repo) => repo.topics.map((topic) => topic.toLowerCase())),
  );
  const hasHomepage = data.repos.some((repo) => Boolean(repo.homepage));

  return TOOL_ICON_LIBRARY.filter((tool) => {
    if (tool.always) {
      return true;
    }

    if (tool.useHomepage && hasHomepage) {
      return true;
    }

    if (tool.languages?.some((language) => languageSet.has(language))) {
      return true;
    }

    if (tool.topics?.some((topic) => topicSet.has(topic.toLowerCase()))) {
      return true;
    }

    return false;
  }).slice(0, 6);
}

export default function GitHubProfileShowcase({
  data,
  docsUrl,
}: {
  data: GitHubShowcaseData;
  docsUrl: string;
}) {
  const tools = getToolShowcase(data);
  const contributionHeading = splitContributionHeading(data.contributionCalendar.heading);

  return (
    <div className="mt-6 space-y-6 sm:space-y-8">
      <section className="panel overflow-hidden rounded-[40px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <div className="mono text-[11px] tracking-[0.18em] text-white/44 uppercase">
              GitHub workspace
            </div>
            <h1 className="mt-3 max-w-[13ch] text-[2.45rem] leading-[0.96] font-semibold tracking-tight text-white sm:text-[3.5rem] lg:text-[4.4rem]">
              GitHub profile, contributions, and shipped repositories.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/62 sm:text-base">
              A clean overview of your public GitHub account with better balance,
              softer shapes, and repository highlights that stay readable on every
              screen size.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 xl:justify-end">
            <a
              href={data.profile.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-92"
            >
              Open GitHub
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={docsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/84 transition hover:border-white/24 hover:bg-white/[0.07]"
            >
              GitHub docs
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 grid min-w-0 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <article
            className="relative overflow-hidden border border-white/10 p-5 sm:p-6"
            style={{
              borderRadius: "38px 28px 34px 26px",
              background:
                "radial-gradient(circle at top left, rgba(94, 234, 212, 0.12), transparent 40%), rgba(255, 255, 255, 0.025)",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="mono text-[10px] tracking-[0.16em] text-white/42 uppercase">
                Profile snapshot
              </div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/80">
                <Github className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-5">
              <div className="w-fit overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-1">
                <Image
                  src={data.profile.avatarUrl}
                  alt={data.profile.name}
                  width={176}
                  height={176}
                  className="h-28 w-28 rounded-[26px] object-cover sm:h-32 sm:w-32"
                />
              </div>

              <div>
                <div className="max-w-[10ch] text-[2rem] leading-[1.02] font-semibold tracking-tight text-white sm:text-[2.35rem]">
                  {data.profile.name}
                </div>
                <div className="mt-2 text-lg text-white/52">@{data.profile.username}</div>
              </div>

              <div className="space-y-2 text-[15px] leading-7 text-white/70">
                {data.profile.bioLines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { label: "Public repos", value: data.profile.publicRepos },
                { label: "Followers", value: data.profile.followers },
                { label: "Following", value: data.profile.following },
                { label: "Joined GitHub", value: formatJoinedDate(data.profile.joinedAt) },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4"
                >
                  <div className="mono text-[10px] tracking-[0.16em] text-white/42 uppercase">
                    {stat.label}
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight text-white/94">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-sm text-white/58">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
                <CalendarDays className="h-4 w-4" />
                Updated {formatMonthYear(data.profile.updatedAt)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
                <Users className="h-4 w-4" />
                Public profile
              </span>
            </div>
          </article>

          <article
            className="relative min-w-0 overflow-hidden border border-white/10 p-5 sm:p-6 lg:p-7"
            style={{
              borderRadius: "44px 30px 40px 30px",
              background:
                "radial-gradient(circle at top right, rgba(34, 197, 94, 0.12), transparent 34%), rgba(255, 255, 255, 0.025)",
            }}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mono text-[10px] tracking-[0.16em] text-white/42 uppercase">
                  Contribution activity
                </div>
                {contributionHeading ? (
                  <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-3">
                    <span className="text-4xl font-semibold tracking-tight text-white sm:text-[3.4rem]">
                      {contributionHeading.count}
                    </span>
                    <span className="text-base font-medium leading-relaxed text-white/68 sm:pb-2">
                      {contributionHeading.label}
                    </span>
                  </div>
                ) : (
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {data.contributionCalendar.heading}
                  </h2>
                )}
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/56 sm:text-[15px]">
                  The contribution graph stays inside a softer panel so it feels lighter,
                  fits better on laptop screens, and remains scrollable on smaller devices.
                </p>
              </div>

              <div className="inline-flex self-start rounded-full border border-emerald-300/18 bg-emerald-400/10 px-3.5 py-2 text-sm font-medium text-emerald-100">
                {data.contributionCalendar.yearLabel} snapshot
              </div>
            </div>

            <div className="mt-6 rounded-[30px] border border-white/8 bg-black/26 p-4 sm:p-5">
              <div className="overflow-x-auto pb-2">
                <div className="min-w-[640px]">
                  <div className="ml-9 flex justify-between gap-2 text-[9px] text-white/34 sm:ml-10 sm:text-[10px]">
                    {data.contributionCalendar.months.map((month) => (
                      <span key={month} className="mono uppercase tracking-[0.16em]">
                        {month}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 grid grid-cols-[22px_1fr] gap-3 sm:grid-cols-[28px_1fr]">
                    <div className="flex flex-col gap-1.5 pt-0.5 text-[9px] text-white/26 sm:text-[10px]">
                      {["", "Mon", "", "Wed", "", "Fri", ""].map((day, index) => (
                        <div
                          key={`${day}-${index}`}
                          className="mono h-[10px] uppercase sm:h-[12px]"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      {data.contributionCalendar.rows.map((row, rowIndex) => (
                        <div key={`row-${rowIndex}`} className="flex gap-1 sm:gap-[5px]">
                          {row.map((cell, cellIndex) => (
                            <span
                              key={`${cell.date ?? "empty"}-${cellIndex}`}
                              className={[
                                "h-[10px] w-[10px] rounded-[3px] border border-white/[0.03] sm:h-[12px] sm:w-[12px]",
                                cell.date
                                  ? CONTRIBUTION_LEVEL_CLASSES[cell.level]
                                  : "bg-transparent",
                              ].join(" ")}
                              title={
                                cell.date
                                  ? `${cell.date} - activity level ${cell.level}`
                                  : undefined
                              }
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl text-sm leading-relaxed text-white/54">
                  Public contribution calendar pulled from your GitHub profile activity.
                </div>

                <div className="flex items-center gap-1.5 text-xs text-white/42">
                  <span>Less</span>
                  {CONTRIBUTION_LEVEL_CLASSES.map((levelClass) => (
                    <span
                      key={levelClass}
                      className={`h-[10px] w-[10px] rounded-[3px] border border-white/[0.04] ${levelClass}`}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="panel overflow-hidden rounded-[40px] px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mono text-[11px] tracking-[0.18em] text-white/44 uppercase">
              Projects
            </div>
            <h2 className="mt-3 max-w-[18ch] text-[2.2rem] leading-[1.02] font-semibold tracking-tight text-white sm:text-[3rem]">
              Public repositories selected from recent GitHub work.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/58 sm:text-base">
              Each card keeps the content tighter and cleaner, with softer corners and
              shorter descriptions so the page feels more polished.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/58">
            <FolderGit2 className="h-4 w-4" />
            Top 6 public repositories
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 lg:auto-rows-fr">
          {data.repos.map((repo, index) => {
            const variant = REPO_CARD_VARIANTS[index % REPO_CARD_VARIANTS.length];
            const topics =
              repo.topics.length > 0
                ? repo.topics.slice(0, 3)
                : [repo.defaultBranch, repo.language ?? "public repo"].slice(0, 2);

            return (
              <article
                key={repo.id}
                className="group flex h-full flex-col overflow-hidden border border-white/10 p-5 sm:p-6"
                style={{
                  borderRadius: variant.radius,
                  background: variant.background,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mono text-[10px] tracking-[0.18em] text-white/40 uppercase">
                      {repo.language ?? "Mixed stack"}
                    </div>
                    <h3 className="mt-4 max-w-[16ch] text-[1.95rem] leading-[1.05] font-semibold tracking-tight text-white sm:text-[2.2rem]">
                      {humanizeRepoName(repo.name)}
                    </h3>
                  </div>

                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border transition hover:scale-[1.02] hover:text-white ${variant.orbClass}`}
                    aria-label={`Open ${repo.name} on GitHub`}
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </a>
                </div>

                <p className="mt-5 max-w-[36rem] text-[15px] leading-7 text-white/68 sm:text-base">
                  {trimDescription(repo.description, repo.homepage ? 170 : 150)}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {topics.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs text-white/62"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/50">
                    <span className="inline-flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      {repo.stars}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <GitFork className="h-4 w-4" />
                      {repo.forks}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {formatMonthYear(repo.pushedAt)}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/86 transition hover:border-white/24 hover:bg-white/[0.08]"
                    >
                      Repository
                      <ArrowUpRight className="h-4 w-4" />
                    </a>

                    {repo.homepage ? (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300/16 bg-emerald-400/10 px-4 py-2.5 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/14"
                      >
                        Live site
                        <Globe className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="panel overflow-hidden rounded-[40px] px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="mono text-[11px] tracking-[0.18em] text-white/44 uppercase">
              Tools
            </div>
            <h2 className="mt-3 max-w-[18ch] text-[2.1rem] leading-[1.02] font-semibold tracking-tight text-white sm:text-[2.9rem]">
              Tools visible across this GitHub workflow.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/58 sm:text-base">
              The strip stays icon-first, but the spacing, radius, and alignment are
              tuned so it feels cleaner and lighter on the page.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            {tools.map((tool, index) => (
              <div
                key={tool.label}
                title={tool.label}
                className="grid h-[68px] w-[68px] place-items-center border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] transition hover:border-white/18 hover:bg-white/[0.07] sm:h-[72px] sm:w-[72px]"
                style={{
                  borderRadius:
                    index % 2 === 0 ? "24px 18px 26px 18px" : "18px 26px 18px 24px",
                }}
              >
                <tool.Icon className={`h-6 w-6 ${tool.colorClass}`} />
                <span className="sr-only">{tool.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
