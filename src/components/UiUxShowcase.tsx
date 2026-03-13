"use client";

import Link from "next/link";
import { startTransition, useEffect, useEffectEvent, useMemo, useState } from "react";
import { ArrowUpRight, Figma, Layers3, Sparkles } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

type VisualCard = {
  label: string;
  body: string;
  widthClass: string;
  alignClass: string;
};

type UiUxSlide = {
  id: string;
  badge: string;
  filename: string;
  language: "css" | "tsx";
  code: string;
  visualEyebrow: string;
  visualMode: string;
  visualTitle: string;
  visualBody: string;
  chips: string[];
  bars: number[];
  visualCards: VisualCard[];
  shellBackground: string;
  accentClass: string;
  accentSoftClass: string;
  accentBorderClass: string;
};

const TYPE_DELAY_MS = 16;
const SLIDE_HOLD_MS = 1800;

const UIUX_SLIDES: UiUxSlide[] = [
  {
    id: "design-system",
    badge: "Design system",
    filename: "design-tokens.css",
    language: "css",
    code: `:root {
  --surface-card: rgba(255,255,255,0.05);
  --surface-soft: rgba(255,255,255,0.03);
  --radius-panel: 32px;
  --space-section: clamp(24px, 4vw, 40px);
  --text-title: #f8fafc;
}

.hero-card {
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: var(--radius-panel);
  background: linear-gradient(180deg, rgba(255,255,255,0.05), transparent);
}`,
    visualEyebrow: "Design system",
    visualMode: "Desktop rhythm",
    visualTitle: "Token-based hierarchy that stays clean from Figma to frontend.",
    visualBody:
      "Spacing, typography, and component states are organized so the final interface keeps the same visual discipline after implementation.",
    chips: ["Type scale", "Spacing map", "Button states"],
    bars: [68, 44, 84],
    visualCards: [
      {
        label: "Desktop hero",
        body: "Primary heading, short support copy, and action balance.",
        widthClass: "w-[84%]",
        alignClass: "self-start",
      },
      {
        label: "Component stack",
        body: "Cards, filters, and CTA rules stay reusable.",
        widthClass: "w-[72%]",
        alignClass: "self-end",
      },
    ],
    shellBackground:
      "radial-gradient(circle at 18% 18%, rgba(52, 211, 153, 0.18), transparent 34%), radial-gradient(circle at 88% 10%, rgba(56, 189, 248, 0.14), transparent 26%), rgba(255,255,255,0.02)",
    accentClass: "bg-emerald-300",
    accentSoftClass: "bg-emerald-400/12 text-emerald-100",
    accentBorderClass: "border-emerald-300/20",
  },
  {
    id: "mobile-flow",
    badge: "Interaction flow",
    filename: "FlowCard.tsx",
    language: "tsx",
    code: `export function FlowCard() {
  return (
    <section className="rounded-[28px] border border-white/10 bg-black/30 p-5">
      <span className="mono text-[11px] uppercase text-white/45">
        mobile onboarding
      </span>
      <h3 className="mt-3 text-2xl font-semibold text-white">
        Clear steps. Low friction. Fast action.
      </h3>
      <p className="mt-3 text-sm leading-7 text-white/65">
        Each screen keeps one main task, one supporting action, and one
        visible progress cue.
      </p>
    </section>
  );
}`,
    visualEyebrow: "Mobile UX",
    visualMode: "Touch-first flow",
    visualTitle: "Compact screens with clearer action priority and calmer spacing.",
    visualBody:
      "The visual panel shifts toward mobile framing, quick-scanning cards, and stronger action placement for real product usability.",
    chips: ["Onboarding", "Bottom action", "Progress states"],
    bars: [56, 78, 38],
    visualCards: [
      {
        label: "Mobile frame",
        body: "Focused copy blocks with strong thumb-zone CTA placement.",
        widthClass: "w-[68%]",
        alignClass: "self-end",
      },
      {
        label: "Action strip",
        body: "Progress, supporting text, and one highlighted next step.",
        widthClass: "w-[78%]",
        alignClass: "self-start",
      },
    ],
    shellBackground:
      "radial-gradient(circle at 20% 12%, rgba(251, 191, 36, 0.14), transparent 30%), radial-gradient(circle at 88% 18%, rgba(244, 114, 182, 0.12), transparent 28%), rgba(255,255,255,0.02)",
    accentClass: "bg-amber-300",
    accentSoftClass: "bg-amber-400/12 text-amber-100",
    accentBorderClass: "border-amber-300/20",
  },
  {
    id: "portfolio-ui",
    badge: "Portfolio UI",
    filename: "ProjectPreview.tsx",
    language: "tsx",
    code: `export function ProjectPreview() {
  return (
    <article className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5">
      <span className="mono text-[10px] uppercase tracking-[0.16em] text-white/42">
        preview system
      </span>
      <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">
        Motion-first project card
      </h3>
      <p className="mt-4 max-w-[42ch] text-sm leading-7 text-white/65">
        Hover motion, cleaner metadata, and stronger hierarchy make portfolio
        pieces easier to scan and more memorable.
      </p>
    </article>
  );
}`,
    visualEyebrow: "Portfolio section",
    visualMode: "Preview choreography",
    visualTitle: "Showcase layouts that feel editorial without losing clarity.",
    visualBody:
      "Motion previews, layered cards, and typography hierarchy make project sections more expressive while staying professional and easy to read.",
    chips: ["Motion preview", "Content rhythm", "Visual hierarchy"],
    bars: [82, 52, 66],
    visualCards: [
      {
        label: "Preview card",
        body: "Large frame, short metadata, and stronger title control.",
        widthClass: "w-[86%]",
        alignClass: "self-start",
      },
      {
        label: "Detail note",
        body: "Summary blocks sit under the artboard without clutter.",
        widthClass: "w-[70%]",
        alignClass: "self-end",
      },
    ],
    shellBackground:
      "radial-gradient(circle at 18% 18%, rgba(129, 140, 248, 0.15), transparent 30%), radial-gradient(circle at 84% 18%, rgba(251, 146, 60, 0.12), transparent 28%), rgba(255,255,255,0.02)",
    accentClass: "bg-sky-300",
    accentSoftClass: "bg-sky-400/12 text-sky-100",
    accentBorderClass: "border-sky-300/20",
  },
];

function highlightCode(code: string, language: UiUxSlide["language"]) {
  const grammar =
    language === "css"
      ? Prism.languages.css
      : Prism.languages.tsx ??
        Prism.languages.jsx ??
        Prism.languages.typescript ??
        Prism.languages.javascript;

  const safeGrammar = grammar ?? Prism.languages.markup;
  return Prism.highlight(code || " ", safeGrammar, language);
}

export default function UiUxShowcase() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const current = UIUX_SLIDES[slideIndex];
  const totalChars = current.code.length;
  const lineCount = current.code.split("\n").length;

  const advanceSlide = useEffectEvent(() => {
    startTransition(() => {
      setSlideIndex((prev) => (prev + 1) % UIUX_SLIDES.length);
      setCharCount(0);
    });
  });

  useEffect(() => {
    if (charCount < totalChars) {
      const typingTimer = window.setTimeout(() => {
        setCharCount((prev) => Math.min(prev + 1, totalChars));
      }, TYPE_DELAY_MS);

      return () => window.clearTimeout(typingTimer);
    }

    const holdTimer = window.setTimeout(() => {
      advanceSlide();
    }, SLIDE_HOLD_MS);

    return () => window.clearTimeout(holdTimer);
  }, [charCount, totalChars]);

  const visibleCode = current.code.slice(0, charCount);

  const highlightedCode = useMemo(
    () => highlightCode(visibleCode, current.language),
    [current.language, visibleCode],
  );

  return (
    <section id="uiux" className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-5">
        <div className="panel overflow-hidden rounded-[34px] p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mono text-[11px] tracking-[0.18em] text-white/44 uppercase">
                UI / UX section
              </div>
              <h2 className="mt-3 max-w-[15ch] text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                UI thinking that moves cleanly into frontend code.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/62 sm:text-base">
                This section auto-rotates between design-system logic, interaction
                flows, and portfolio presentation patterns so visitors can feel both
                the code side and the visual side of your work.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/62">
                <Sparkles className="h-4 w-4" />
                Auto motion
              </div>
              <Link
                href="/tech/figma"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/86 transition hover:border-white/24 hover:bg-white/[0.08]"
              >
                Open UI/UX gallery
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
            <article className="code-shell min-w-0 overflow-hidden rounded-[30px]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/5 px-3 py-2.5 sm:px-5 sm:py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/70" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                    <span className="h-3 w-3 rounded-full bg-green-500/70" />
                  </div>
                  <span className="mono max-w-[190px] truncate text-[11px] text-white/60 sm:max-w-none sm:text-xs">
                    {current.filename}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="mono rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/70 sm:text-[11px]">
                    {current.badge}
                  </span>
                  <span className="mono rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/70 sm:text-[11px]">
                    Auto sync
                  </span>
                </div>
              </div>

              <div className="p-3 sm:p-6">
                <div className="code-pre overflow-hidden rounded-[24px]">
                  <div className="grid grid-cols-[42px_1fr] sm:grid-cols-[52px_1fr]">
                    <div className="code-ln mono select-none py-4 pl-3 pr-2 text-[11px] sm:py-5 sm:pl-4 sm:pr-3 sm:text-[12px]">
                      {Array.from({ length: lineCount }, (_, i) => (
                        <div key={i} className="leading-7">
                          {i + 1}
                        </div>
                      ))}
                    </div>

                    <div className="mono overflow-auto py-4 pr-3 text-[12.5px] text-white/80 sm:py-5 sm:pr-5 sm:text-[13.5px]">
                      <pre className="m-0 whitespace-pre leading-7">
                        <code
                          className={`language-${current.language}`}
                          dangerouslySetInnerHTML={{ __html: highlightedCode }}
                        />
                        <span className="inline-block h-[1.05em] w-[2px] animate-pulse bg-white/70 align-[-2px]" />
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {UIUX_SLIDES.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => {
                        startTransition(() => {
                          setSlideIndex(index);
                          setCharCount(0);
                        });
                      }}
                      className={[
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-left text-xs transition",
                        index === slideIndex
                          ? "border-white/16 bg-white/[0.08] text-white/88"
                          : "border-white/10 bg-white/[0.03] text-white/50 hover:bg-white/[0.05]",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "h-2 w-2 rounded-full",
                          index === slideIndex ? current.accentClass : "bg-white/20",
                        ].join(" ")}
                      />
                      {slide.badge}
                    </button>
                  ))}
                </div>
              </div>
            </article>

            <article
              className="relative overflow-hidden rounded-[32px] border border-white/10 p-4 sm:p-5 lg:p-6"
              style={{ background: current.shellBackground }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="mono text-[11px] tracking-[0.18em] text-white/42 uppercase">
                  {current.visualEyebrow}
                </div>
                <div
                  className={[
                    "rounded-full border px-3 py-1.5 text-sm font-medium",
                    current.accentBorderClass,
                    current.accentSoftClass,
                  ].join(" ")}
                >
                  {current.visualMode}
                </div>
              </div>

              <div className="mt-4 rounded-[28px] border border-white/10 bg-black/28 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-white/40">
                  <Layers3 className="h-4 w-4" />
                  <div className="mono text-[10px] tracking-[0.16em] uppercase">
                    Prototype board
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(220px,0.95fr)]">
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="mono text-[10px] tracking-[0.16em] text-white/42 uppercase">
                        Primary layout
                      </span>
                      <span
                        className={[
                          "h-2.5 w-2.5 rounded-full",
                          current.accentClass,
                        ].join(" ")}
                      />
                    </div>

                    <div className="mt-5 space-y-3">
                      {current.bars.map((bar, index) => (
                        <div
                          key={`${current.id}-bar-${index}`}
                          className="h-3 rounded-full bg-white/[0.06]"
                        >
                          <div
                            className={[
                              "h-full rounded-full transition-all duration-700",
                              current.accentClass,
                            ].join(" ")}
                            style={{ width: `${bar}%` }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {current.chips.map((chip) => (
                        <div
                          key={chip}
                          className="rounded-[20px] border border-white/10 bg-black/30 px-3 py-3"
                        >
                          <div className="mono text-[10px] tracking-[0.16em] text-white/42 uppercase">
                            Active idea
                          </div>
                          <div className="mt-2 text-sm leading-relaxed text-white/72">
                            {chip}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex min-h-[238px] flex-col justify-center gap-4">
                    {current.visualCards.map((card) => (
                      <div
                        key={`${current.id}-${card.label}`}
                        className={[
                          "rounded-[24px] border border-white/10 bg-black/34 p-4 transition-all duration-700",
                          card.widthClass,
                          card.alignClass,
                        ].join(" ")}
                      >
                        <div className="mono text-[10px] tracking-[0.16em] text-white/42 uppercase">
                          {card.label}
                        </div>
                        <div className="mt-3 text-sm leading-relaxed text-white/70">
                          {card.body}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[26px] border border-white/10 bg-black/34 p-5">
                <div className="flex items-center gap-2 text-white/40">
                  <Figma className="h-4 w-4" />
                  <div className="mono text-[10px] tracking-[0.16em] uppercase">
                    Visual summary
                  </div>
                </div>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-[2rem]">
                  {current.visualTitle}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/62 sm:text-base">
                  {current.visualBody}
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
