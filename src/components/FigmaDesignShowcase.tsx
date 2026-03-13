"use client";

import type {
  ChangeEvent,
  CSSProperties,
  FormEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clapperboard,
  ExternalLink,
  Film,
  ImageIcon,
  ImagePlus,
  Layers3,
  LayoutTemplate,
  Link2,
  LoaderCircle,
  MonitorSmartphone,
  Palette,
  Play,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import type { AdminGalleryItem } from "@/lib/admin-gallery";

type GalleryTab = "videos" | "images";
type ProjectSource = "sample" | "upload";

type PreviewFrame = {
  eyebrow: string;
  title: string;
  caption: string;
  accent: string;
  imageSrc?: string;
};

type FigmaProject = {
  id: string;
  title: string;
  category: string;
  summary: string;
  detail: string;
  prototypeNote: string;
  demoUrl?: string;
  demoLabel: string;
  tools: string[];
  deliverables: string[];
  frames: PreviewFrame[];
  videoSrc?: string;
  posterSrc?: string;
  duration: string;
  sourceType: ProjectSource;
  uploadKind?: GalleryTab;
};

type UploadDraft = {
  title: string;
  description: string;
  link: string;
  mediaFile: File | null;
  thumbnailFile: File | null;
};

type GalleryUpload = AdminGalleryItem;

type Notice = {
  tone: "success" | "error";
  message: string;
};

const DESIGN_STRENGTHS = [
  {
    title: "Wireframes with structure",
    description:
      "I sketch flows and content hierarchy before polishing the visual layer.",
    Icon: LayoutTemplate,
  },
  {
    title: "Reusable design systems",
    description:
      "Components, variants, and spacing rules keep every screen consistent.",
    Icon: Layers3,
  },
  {
    title: "Responsive UI thinking",
    description:
      "Layouts are built for desktop and mobile from the same design language.",
    Icon: MonitorSmartphone,
  },
  {
    title: "Clean handoff to code",
    description:
      "Specs, states, and interactions are organized so implementation stays fast.",
    Icon: Sparkles,
  },
];

const TECHNICAL_TOOLS = [
  "Auto layout",
  "Variants + components",
  "Prototype flows",
  "Developer handoff",
  "Responsive constraints",
  "Micro-interaction planning",
];

const DEFAULT_PROJECTS: FigmaProject[] = [
  {
    id: "creator-portfolio",
    sourceType: "sample",
    title: "Creator Portfolio Experience",
    category: "Personal brand / website design",
    summary:
      "A clean portfolio system designed to present projects, skills, and contact actions with strong hierarchy.",
    detail:
      "Focused on section rhythm, typography balance, and spacing that maps neatly into frontend code.",
    prototypeNote:
      "Prototype flow highlights hero transitions, hover states, and mobile navigation behavior.",
    demoUrl: "https://www.figma.com/",
    demoLabel: "Open Figma file",
    tools: [
      "Desktop layout",
      "Mobile adaptation",
      "Interactive states",
      "Design tokens",
    ],
    deliverables: ["Landing page", "Project spotlight", "Contact journey"],
    duration: "01:14",
    frames: [
      {
        eyebrow: "Desktop hero",
        title: "Polished first impression",
        caption: "Large statement typography with supporting project metrics.",
        accent: "rgba(87, 198, 255, 0.34)",
      },
      {
        eyebrow: "Project section",
        title: "Visual case study rhythm",
        caption: "Alternating cards keep long scrolling pages engaging.",
        accent: "rgba(255, 163, 88, 0.32)",
      },
      {
        eyebrow: "Mobile flow",
        title: "Compact navigation stack",
        caption: "Cards and CTAs collapse cleanly into a thumb-friendly layout.",
        accent: "rgba(159, 117, 255, 0.36)",
      },
    ],
  },
  {
    id: "finflow-dashboard",
    sourceType: "sample",
    title: "FinFlow Analytics Dashboard",
    category: "SaaS dashboard / data-rich UI",
    summary:
      "A dashboard concept for finance metrics with reusable cards, filters, charts, and clean states.",
    detail:
      "The system prioritizes scanning speed, color discipline, and modular panels reused across admin pages.",
    prototypeNote:
      "Prototype moves from overview cards into detail panels and action drawers.",
    demoUrl: "https://www.figma.com/",
    demoLabel: "Open dashboard design",
    tools: ["Data cards", "Chart framing", "Table states", "Reusable filters"],
    deliverables: ["Overview dashboard", "Detail panel", "Responsive admin screens"],
    duration: "00:56",
    frames: [
      {
        eyebrow: "Overview",
        title: "KPI cards with calm density",
        caption: "Information stays readable even with several metrics visible.",
        accent: "rgba(97, 224, 177, 0.34)",
      },
      {
        eyebrow: "Insights",
        title: "Focused chart storytelling",
        caption: "Contrast and spacing guide the eye through trend analysis.",
        accent: "rgba(92, 150, 255, 0.34)",
      },
      {
        eyebrow: "Responsive admin",
        title: "Panels that shrink well",
        caption: "The layout adapts without losing action priority or clarity.",
        accent: "rgba(255, 112, 172, 0.32)",
      },
    ],
  },
  {
    id: "campus-connect",
    sourceType: "sample",
    title: "Campus Connect Mobile App",
    category: "App UX / social + utility flow",
    summary:
      "A mobile-first concept that blends event discovery, chat, and profile actions into a lightweight student experience.",
    detail:
      "Built around clear onboarding, fast navigation patterns, and playful UI accents without losing usability.",
    prototypeNote:
      "Prototype emphasizes onboarding, swipeable discovery cards, and quick-access action bars.",
    demoUrl: "https://www.figma.com/",
    demoLabel: "Open mobile prototype",
    tools: ["App flow", "Bottom navigation", "Cards", "Prototype hotspots"],
    deliverables: ["Onboarding", "Feed screens", "Profile and event flow"],
    duration: "01:08",
    frames: [
      {
        eyebrow: "Onboarding",
        title: "Friendly first-time flow",
        caption: "Simple, inviting screens introduce the product quickly.",
        accent: "rgba(255, 133, 85, 0.33)",
      },
      {
        eyebrow: "Discovery feed",
        title: "Cards built for motion",
        caption: "Content blocks are designed to feel alive during prototype testing.",
        accent: "rgba(255, 196, 87, 0.32)",
      },
      {
        eyebrow: "Profile system",
        title: "Fast actions, low friction",
        caption: "Key details and actions stay visible inside a compact mobile frame.",
        accent: "rgba(116, 173, 255, 0.33)",
      },
    ],
  },
];

function createEmptyDraft(): UploadDraft {
  return {
    title: "",
    description: "",
    link: "",
    mediaFile: null,
    thumbnailFile: null,
  };
}

function buildUploadFrames(upload: GalleryUpload): PreviewFrame[] {
  const imageSrc =
    upload.thumbnailUrl ?? (upload.kind === "images" ? upload.mediaUrl : undefined);

  return [
    {
      eyebrow: "Upload 01",
      title:
        upload.kind === "videos" ? "Uploaded cover frame" : "Uploaded gallery frame",
      caption:
        upload.kind === "videos"
          ? "Your new video appears in the main preview area immediately."
          : "Your uploaded image now drives the moving preview rail.",
      accent: "rgba(97, 224, 177, 0.32)",
      imageSrc,
    },
    {
      eyebrow: "Upload 02",
      title: "Metadata card",
      caption: "Title, description, and link stay attached to the design card.",
      accent: "rgba(92, 150, 255, 0.32)",
      imageSrc,
    },
    {
      eyebrow: "Upload 03",
      title: upload.thumbnailUrl ? "Custom thumbnail ready" : "Auto preview fallback",
      caption: upload.thumbnailUrl
        ? "Your thumbnail creates a stronger first impression."
        : "If no thumbnail is added, the gallery still creates a clean preview.",
      accent: "rgba(255, 148, 199, 0.3)",
      imageSrc,
    },
  ];
}

function mapUploadToProject(upload: GalleryUpload): FigmaProject {
  const hasThumbnail = Boolean(upload.thumbnailUrl);

  return {
    id: upload.id,
    sourceType: "upload",
    uploadKind: upload.kind,
    title: upload.title,
    category:
      upload.kind === "videos"
        ? "Uploaded video / published by admin"
        : "Uploaded image / published by admin",
    summary: upload.description,
    detail: hasThumbnail
      ? "Custom thumbnail added. Your uploaded media now appears inside the same polished preview layout as the default projects."
      : upload.kind === "images"
        ? "No thumbnail was added, so the uploaded image itself becomes the preview cover and moving gallery frame."
        : "No thumbnail was added, so the video still appears in the preview area and uses the styled fallback where needed.",
    prototypeNote: hasThumbnail
      ? "This upload uses your custom thumbnail for cleaner preview cards."
      : "Upload saved successfully. You can add a thumbnail later by uploading an updated version.",
    demoUrl: upload.link,
    demoLabel: "Open project link",
    tools: [
      upload.kind === "videos" ? "Uploaded video" : "Uploaded image",
      hasThumbnail ? "Custom thumbnail" : "Auto preview",
      "Browser saved",
    ],
    deliverables:
      upload.kind === "videos"
        ? ["Video preview", "Title + description", "External link"]
        : ["Image preview", "Moving gallery card", "External link"],
    frames: buildUploadFrames(upload),
    videoSrc: upload.kind === "videos" ? upload.mediaUrl : undefined,
    posterSrc:
      upload.kind === "videos"
        ? upload.thumbnailUrl
        : upload.thumbnailUrl ?? upload.mediaUrl,
    duration: "Custom",
  };
}

function FrameCard({
  frame,
  index,
  compact = false,
}: {
  frame: PreviewFrame;
  index: number;
  compact?: boolean;
}) {
  const style: CSSProperties = {
    backgroundImage: frame.imageSrc
      ? `linear-gradient(180deg, rgba(6, 9, 16, 0.18), rgba(6, 9, 16, 0.82)), url(${frame.imageSrc})`
      : `radial-gradient(circle at 18% 18%, ${frame.accent}, transparent 46%), linear-gradient(180deg, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.03))`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    transform: `translateY(${index % 2 === 0 ? "0px" : compact ? "18px" : "22px"})`,
  };

  return (
    <article
      className={[
        "figma-preview-card relative overflow-hidden rounded-[26px] border border-white/12 bg-[#0b101a] p-4 text-white shadow-[0_18px_50px_rgba(0,0,0,0.4)]",
        compact ? "min-h-[220px] w-[280px]" : "min-h-[320px] w-[320px]",
      ].join(" ")}
      style={style}
    >
      <div className="figma-preview-grid pointer-events-none absolute inset-0 opacity-55" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="space-y-3">
          <span className="mono inline-flex rounded-full border border-white/18 bg-black/35 px-3 py-1 text-[10px] tracking-[0.18em] text-white/72 uppercase">
            {frame.eyebrow}
          </span>
          <div className="space-y-2">
            <div className="h-2.5 w-24 rounded-full bg-white/20" />
            <div className="h-2.5 w-40 rounded-full bg-white/10" />
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
              <div className="h-20 rounded-xl border border-dashed border-white/15 bg-white/6" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 rounded-2xl border border-white/10 bg-white/7" />
              <div className="h-16 rounded-2xl border border-white/10 bg-white/7" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/35 p-3 backdrop-blur-sm">
          <div className="text-sm font-semibold tracking-tight text-white/96">
            {frame.title}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-white/66">
            {frame.caption}
          </p>
        </div>
      </div>
    </article>
  );
}

function PreviewRail({
  frames,
  compact = false,
}: {
  frames: PreviewFrame[];
  compact?: boolean;
}) {
  const repeatedFrames = [...frames, ...frames];

  return (
    <div
      className={[
        "figma-preview-shell group relative overflow-hidden rounded-[30px] border border-white/10 bg-[#090d14]",
        compact ? "h-[280px]" : "h-[380px]",
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(162,89,255,0.16),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(40,183,255,0.14),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]" />
      <div className="absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#090d14] to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#090d14] to-transparent" />
      <div
        className={[
          "figma-preview-track absolute left-0 top-0 flex",
          compact ? "gap-4 p-5" : "gap-5 p-6",
        ].join(" ")}
      >
        {repeatedFrames.map((frame, index) => (
          <FrameCard
            key={`${frame.title}-${index}`}
            frame={frame}
            index={index}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}

function getProjectPalette(project: FigmaProject) {
  return {
    primary: project.frames[0]?.accent ?? "rgba(87, 198, 255, 0.34)",
    secondary: project.frames[1]?.accent ?? "rgba(255, 163, 88, 0.32)",
    tertiary: project.frames[2]?.accent ?? "rgba(159, 117, 255, 0.34)",
  };
}

function getProjectBackdrop(project: FigmaProject) {
  const palette = getProjectPalette(project);

  return [
    `radial-gradient(circle at 18% 18%, ${palette.primary}, transparent 42%)`,
    `radial-gradient(circle at 82% 22%, ${palette.secondary}, transparent 34%)`,
    `radial-gradient(circle at 50% 88%, ${palette.tertiary}, transparent 42%)`,
    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
  ].join(", ");
}

function ProjectMotionPoster({
  project,
  hovered = false,
  className,
  showNote = true,
}: {
  project: FigmaProject;
  hovered?: boolean;
  className?: string;
  showNote?: boolean;
}) {
  const frames = project.frames.slice(0, 3);
  const placements = [
    "left-[5%] top-[12%] h-[47%] w-[45%]",
    "right-[6%] top-[18%] h-[40%] w-[33%]",
    "left-[18%] bottom-[12%] h-[35%] w-[64%]",
  ];
  const baseTransforms = [
    "rotate(-7deg) translate3d(0px, 0px, 0px)",
    "rotate(4deg) translate3d(0px, 0px, 0px)",
    "rotate(-1.5deg) translate3d(0px, 0px, 0px)",
  ];
  const hoverTransforms = [
    "rotate(-4deg) translate3d(0px, -10px, 0px)",
    "rotate(7deg) translate3d(0px, -6px, 0px)",
    "rotate(0deg) translate3d(0px, -12px, 0px)",
  ];

  return (
    <div
      className={["relative overflow-hidden bg-[#070b12]", className].filter(Boolean).join(" ")}
      style={{ backgroundImage: getProjectBackdrop(project) }}
    >
      <div className="figma-preview-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,9,16,0.08),rgba(6,9,16,0.82))]" />

      {frames.map((frame, index) => {
        const style: CSSProperties = {
          backgroundImage: frame.imageSrc
            ? `linear-gradient(180deg, rgba(6, 9, 16, 0.12), rgba(6, 9, 16, 0.76)), url(${frame.imageSrc})`
            : `radial-gradient(circle at 18% 18%, ${frame.accent}, transparent 46%), linear-gradient(180deg, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.03))`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          transform: hovered ? hoverTransforms[index] : baseTransforms[index],
          transition: "transform 320ms ease, box-shadow 320ms ease",
        };

        return (
          <div
            key={`${project.id}-${frame.title}`}
            className={[
              "absolute overflow-hidden rounded-[24px] border border-white/12 bg-black/24 p-3 shadow-[0_24px_55px_rgba(0,0,0,0.32)]",
              placements[index],
            ].join(" ")}
            style={style}
          >
            <div className="figma-preview-grid absolute inset-0 opacity-35" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <span className="mono inline-flex self-start rounded-full border border-white/14 bg-black/35 px-2.5 py-1 text-[9px] tracking-[0.16em] text-white/74 uppercase">
                {frame.eyebrow}
              </span>

              <div className="space-y-2">
                <div
                  className="h-2 rounded-full bg-white/22"
                  style={{ width: `${62 + index * 8}%` }}
                />
                <div
                  className="h-2 rounded-full bg-white/12"
                  style={{ width: `${84 - index * 10}%` }}
                />
                <div className="rounded-2xl border border-white/10 bg-black/30 p-2.5">
                  <div className="h-8 rounded-xl border border-dashed border-white/16 bg-white/7" />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {showNote ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
          <div className="rounded-2xl border border-white/10 bg-black/42 p-3 backdrop-blur-sm">
            <div className="mono text-[10px] tracking-[0.16em] text-white/50 uppercase">
              Motion concept
            </div>
            <div className="mt-2 text-sm font-medium text-white/94">
              {project.frames[0]?.title ?? project.title}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-white/66">
              {project.prototypeNote}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ExpandableText({
  text,
  lines = 4,
  className,
  buttonClassName,
  buttonVariant = "pill",
}: {
  text: string;
  lines?: number;
  className?: string;
  buttonClassName?: string;
  buttonVariant?: "pill" | "link";
}) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      return;
    }

    const node = textRef.current;

    if (!node) {
      return;
    }

    const checkOverflow = () => {
      setCanExpand(node.scrollHeight > node.clientHeight + 1);
    };

    checkOverflow();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(checkOverflow);
      observer.observe(node);

      return () => {
        observer.disconnect();
      };
    }

    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [isExpanded, lines, text]);

  const collapsedStyle: CSSProperties | undefined = isExpanded
    ? undefined
    : {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: lines,
        overflow: "hidden",
      };

  return (
    <div>
      <p ref={textRef} className={className} style={collapsedStyle}>
        {text}
      </p>
      {canExpand || isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className={[
            buttonVariant === "link"
              ? "mt-2 inline-flex items-center text-sm font-medium text-white/66 underline underline-offset-4 transition hover:text-white/92"
              : "mono mt-3 inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] tracking-[0.16em] text-white/60 uppercase transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white/86",
            buttonClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      ) : null}
    </div>
  );
}

function LinkButton({
  href,
  label,
  className,
  compact = false,
}: {
  href?: string;
  label: string;
  className?: string;
  compact?: boolean;
}) {
  if (!href) {
    return (
      <span
        className={[
          compact
            ? "inline-flex items-center justify-center gap-2 rounded-full border border-dashed border-white/14 px-3 py-1.5 text-xs text-white/42"
            : "inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/14 px-4 py-3 text-sm text-white/42",
          className,
        ].join(" ")}
      >
        {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={[
        compact
          ? "inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/6 px-3 py-1.5 text-xs font-medium text-white/84 transition hover:border-white/24 hover:bg-white/10 hover:text-white"
          : "inline-flex items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/6 px-4 py-3 text-sm font-medium text-white/88 transition hover:border-white/24 hover:bg-white/10",
        className,
      ].join(" ")}
    >
      {label}
      <ArrowUpRight className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
    </a>
  );
}

function PreviewButton({
  onClick,
  label,
  className,
  compact = false,
}: {
  onClick: () => void;
  label: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        compact
          ? "inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/86 transition hover:border-white/24 hover:bg-white/10 hover:text-white"
          : "inline-flex items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/6 px-4 py-3 text-sm font-medium text-white/88 transition hover:border-white/24 hover:bg-white/10",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Play className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      {label}
    </button>
  );
}

function GalleryPreviewDialog({
  project,
  onClose,
}: {
  project: FigmaProject | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) {
    return null;
  }

  const hasVideo = Boolean(project.videoSrc);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#020408]/88 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} preview dialog`}
        className="panel relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] border border-white/12 bg-[#070b12]/96"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-black/40 text-white/82 transition hover:bg-white/10"
          aria-label="Close preview"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[1.15fr_0.85fr]">
          <div className="min-h-0 p-4 sm:p-5 lg:p-6">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#05070a]">
              <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2">
                <span className="mono inline-flex items-center gap-2 rounded-full border border-white/16 bg-black/35 px-3 py-1 text-[10px] tracking-[0.16em] text-white/78 uppercase">
                  <Film className="h-3 w-3" />
                  {hasVideo ? "Prototype player" : "Motion board"}
                </span>
                <span className="mono rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[10px] tracking-[0.16em] text-white/60 uppercase">
                  {project.duration}
                </span>
              </div>

              {hasVideo ? (
                <video
                  className="aspect-video w-full bg-black object-contain"
                  src={project.videoSrc}
                  poster={project.posterSrc}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  aria-label={`${project.title} full preview`}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <ProjectMotionPoster
                  project={project}
                  hovered
                  className="aspect-video w-full"
                />
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-5 border-t border-white/10 p-5 sm:p-6 lg:border-l lg:border-t-0">
            <div>
              <div className="mono text-[11px] tracking-[0.18em] text-white/44 uppercase">
                {project.category}
              </div>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white/96">
                {project.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/68 sm:text-base">
                {project.summary}
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <div className="mono text-[10px] tracking-[0.16em] text-white/48 uppercase">
                Preview notes
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/72">{project.detail}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-black/18 p-4">
                <div className="mono text-[10px] tracking-[0.16em] text-white/48 uppercase">
                  Deliverables
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.deliverables.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs text-white/66"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/18 p-4">
                <div className="mono text-[10px] tracking-[0.16em] text-white/48 uppercase">
                  Tools used
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs text-white/66"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/18 p-4">
              <div className="mono text-[10px] tracking-[0.16em] text-white/48 uppercase">
                Motion-first idea
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/68">
                {project.prototypeNote}
              </p>
            </div>

            <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <LinkButton href={project.demoUrl} label={project.demoLabel} />
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/14 bg-transparent px-4 py-3 text-sm font-medium text-white/76 transition hover:bg-white/6 hover:text-white/92"
              >
                Close preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RemoveButton({
  project,
  onRemove,
  isRemoving,
  canManage,
  compact = false,
}: {
  project: FigmaProject;
  onRemove: (projectId: string) => void;
  isRemoving: boolean;
  canManage: boolean;
  compact?: boolean;
}) {
  if (project.sourceType !== "upload" || !canManage) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => onRemove(project.id)}
      disabled={isRemoving}
      className={[
        compact
          ? "inline-flex items-center justify-center gap-2 rounded-full border border-rose-300/18 bg-rose-400/8 px-3 py-1.5 text-xs font-medium text-rose-100 transition hover:bg-rose-400/12"
          : "inline-flex items-center justify-center gap-2 rounded-xl border border-rose-300/18 bg-rose-400/8 px-4 py-3 text-sm font-medium text-rose-100 transition hover:bg-rose-400/12",
        "disabled:cursor-not-allowed disabled:opacity-55",
      ].join(" ")}
    >
      {isRemoving ? (
        <LoaderCircle className={compact ? "h-3.5 w-3.5 animate-spin" : "h-4 w-4 animate-spin"} />
      ) : (
        <Trash2 className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      )}
      Remove
    </button>
  );
}

function GalleryVideoThumbnail({
  project,
  onOpenPreview,
}: {
  project: FigmaProject;
  onOpenPreview: (project: FigmaProject) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasVideo = Boolean(project.videoSrc) && !hasVideoError;

  useEffect(() => {
    const previewVideo = videoRef.current;

    return () => {
      previewVideo?.pause();
    };
  }, []);

  function updateCursor(event: ReactPointerEvent<HTMLButtonElement>) {
    const cursor = cursorRef.current;

    if (!cursor) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    cursor.style.left = `${event.clientX - bounds.left}px`;
    cursor.style.top = `${event.clientY - bounds.top}px`;
  }

  async function startPreview() {
    setIsHovered(true);

    const video = videoRef.current;

    if (!video || !hasVideo) {
      return;
    }

    video.muted = true;

    try {
      if (video.currentTime > 0.05 || video.ended) {
        video.currentTime = 0;
      }
    } catch {
      // Ignore seek issues if metadata is not ready yet.
    }

    try {
      await video.play();
    } catch {
      // Ignore autoplay restrictions for hover previews.
    }
  }

  function stopPreview() {
    setIsHovered(false);

    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.pause();

    try {
      video.currentTime = 0;
    } catch {
      // Ignore reset failures if the media is not seekable yet.
    }
  }

  function handleOpenPreview() {
    stopPreview();
    onOpenPreview(project);
  }

  return (
    <button
      type="button"
      onClick={handleOpenPreview}
      onPointerEnter={startPreview}
      onPointerLeave={stopPreview}
      onPointerMove={updateCursor}
      onFocus={() => {
        void startPreview();
      }}
      onBlur={stopPreview}
      aria-label={`Open ${project.title} preview`}
      className="group/preview relative block w-full overflow-hidden rounded-[26px] text-left focus:outline-none"
    >
      <div
        className="figma-gallery-card relative aspect-[16/10] overflow-hidden rounded-[26px] border border-white/10 bg-[#070b12] md:cursor-none"
        style={{ backgroundImage: getProjectBackdrop(project) }}
      >
        {hasVideo ? (
          <video
            ref={videoRef}
            className={[
              "h-full w-full object-cover transition duration-500",
              isHovered ? "scale-[1.03] opacity-100" : "scale-100 opacity-88",
            ].join(" ")}
            src={project.videoSrc}
            poster={project.posterSrc}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setHasVideoError(true)}
            aria-hidden="true"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <ProjectMotionPoster
            project={project}
            hovered={isHovered}
            showNote={false}
            className="h-full w-full"
          />
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,5,9,0.02),rgba(3,5,9,0.22)_42%,rgba(3,5,9,0.82))]" />
        <div className="figma-video-sheen pointer-events-none absolute inset-y-0 -left-[24%] w-[18%] rotate-[18deg] bg-white/18 blur-2xl opacity-0 transition-opacity duration-300 group-hover/preview:opacity-100 group-focus-visible/preview:opacity-100" />

        <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2">
          <span className="mono inline-flex items-center gap-2 rounded-full border border-white/16 bg-black/32 px-3 py-1 text-[9px] tracking-[0.16em] text-white/74 uppercase">
            <Film className="h-3 w-3" />
            {hasVideo ? "Prototype clip" : "Motion concept"}
          </span>
          <span className="mono rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[9px] tracking-[0.16em] text-white/60 uppercase">
            {project.duration}
          </span>
        </div>

        <span
          ref={cursorRef}
          className={[
            "pointer-events-none absolute left-1/2 top-1/2 z-30 hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-black/55 text-white shadow-[0_18px_40px_rgba(0,0,0,0.42)] backdrop-blur-md transition duration-200 md:flex",
            isHovered ? "scale-100 opacity-100" : "scale-75 opacity-0",
          ].join(" ")}
        >
          <span className="figma-video-cursor-ring absolute inset-0 rounded-full" />
          <Play className="relative z-10 ml-0.5 h-5 w-5" />
        </span>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 p-4">
          <div className="min-w-0 flex-1">
            <div className="mono mb-2 text-[9px] tracking-[0.16em] text-white/50 uppercase">
              {hasVideo ? (isHovered ? "Preview running" : "Hover to preview") : "Click to open concept"}
            </div>
            <div className="h-1.5 max-w-[72%] overflow-hidden rounded-full bg-white/14">
              <span
                className={[
                  "block h-full rounded-full bg-gradient-to-r from-white/40 via-white/88 to-white/40 transition-all duration-500",
                  isHovered ? "w-full opacity-100" : "w-16 opacity-65",
                ].join(" ")}
              />
            </div>
          </div>

          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-black/40 text-white/78 shadow-[0_12px_26px_rgba(0,0,0,0.26)] backdrop-blur-sm">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </button>
  );
}

function getCompactDemoLabel(project: FigmaProject) {
  return project.sourceType === "upload" ? "Project link" : "Figma file";
}

function VideoProjectCard({
  project,
  onRemove,
  isRemoving,
  canManage,
  onOpenPreview,
}: {
  project: FigmaProject;
  onRemove: (projectId: string) => void;
  isRemoving: boolean;
  canManage: boolean;
  onOpenPreview: (project: FigmaProject) => void;
}) {
  const palette = getProjectPalette(project);
  const accentPanelStyle: CSSProperties = {
    backgroundImage: getProjectBackdrop(project),
  };
  const descriptionText = `${project.summary} ${project.detail}`.trim();

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.025] p-3 transition hover:border-white/16 hover:bg-white/[0.04]">
      <GalleryVideoThumbnail project={project} onOpenPreview={onOpenPreview} />

      <div className="flex flex-1 flex-col gap-4 p-2 pt-4 sm:p-3">
        <div className="flex items-start gap-3">
          <div
            className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-white/12"
            style={accentPanelStyle}
          >
            <div className="figma-preview-grid absolute inset-0 opacity-35" />
            <Film
              className="relative z-10 h-4 w-4 text-white/92"
              style={{ color: palette.secondary }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mono text-[10px] tracking-[0.18em] text-white/44 uppercase">
                  {project.category}
                </div>
                <h3 className="mt-1 text-[1.45rem] font-semibold leading-[1.2] tracking-tight text-white/96 sm:text-[1.62rem]">
                  {project.title}
                </h3>
              </div>

              <PreviewButton
                onClick={() => onOpenPreview(project)}
                label={project.videoSrc ? "Open preview" : "Open concept"}
                compact
                className="shrink-0"
              />
            </div>

            <div className="mt-3 md:min-h-[7.75rem]">
              <ExpandableText
                text={descriptionText}
                lines={3}
                className="text-sm leading-7 text-white/68 sm:text-[15px] sm:leading-7"
                buttonVariant="link"
                buttonClassName="mt-2 text-[11px] tracking-[0.02em] text-white/74 hover:bg-transparent hover:text-white"
              />
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-xl border border-emerald-300/20 bg-emerald-400/14 px-3 py-1.5 text-xs font-semibold text-emerald-100">
            Figma
          </span>
          <span className="mono inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] tracking-[0.16em] text-white/52 uppercase">
            {project.sourceType === "upload" ? "Admin upload" : "Showcase"}
          </span>
          <LinkButton
            href={project.demoUrl}
            label={getCompactDemoLabel(project)}
            compact
          />
          <RemoveButton
            project={project}
            onRemove={onRemove}
            isRemoving={isRemoving}
            canManage={canManage}
            compact
          />
        </div>
      </div>
    </article>
  );
}

function ImageProjectCard({
  project,
  onRemove,
  isRemoving,
  canManage,
}: {
  project: FigmaProject;
  onRemove: (projectId: string) => void;
  isRemoving: boolean;
  canManage: boolean;
}) {
  return (
    <article className="grid gap-6 rounded-[32px] border border-white/10 bg-white/[0.025] p-4 sm:p-6 xl:grid-cols-[1.12fr_0.88fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="mono text-[11px] tracking-[0.18em] text-white/46 uppercase">
            {project.category}
          </div>
          <span className="mono inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[10px] tracking-[0.16em] text-white/56 uppercase">
            <ImageIcon className="h-3 w-3" />
            Auto preview
          </span>
        </div>
        <PreviewRail frames={project.frames} />
      </div>

      <div className="flex flex-col justify-between gap-6 rounded-[28px] border border-white/10 bg-black/18 p-5">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-white/96">
            {project.title}
          </h3>
          <div className="mt-4 md:min-h-[8.25rem]">
            <ExpandableText
              text={project.summary}
              lines={4}
              className="text-sm leading-7 text-white/68 sm:text-[15px] sm:leading-7"
            />
          </div>
          <div className="mt-6 space-y-3">
            {project.frames.map((frame, index) => (
              <div
                key={frame.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="mono text-[10px] tracking-[0.16em] text-white/48 uppercase">
                  Frame {String(index + 1).padStart(2, "0")}
                </div>
                <div className="mt-2 text-sm font-medium text-white/92">
                  {frame.title}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-white/64">
                  {frame.caption}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {project.deliverables.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs text-white/66"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
            <div className="mono text-[10px] tracking-[0.16em] text-white/50 uppercase">
              Quick note
            </div>
            <div className="mt-2">
              <ExpandableText
                text={project.detail}
                lines={3}
                className="text-sm leading-7 text-white/72 sm:text-[15px] sm:leading-7"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <LinkButton href={project.demoUrl} label={project.demoLabel} />
            <RemoveButton
              project={project}
              onRemove={onRemove}
              isRemoving={isRemoving}
              canManage={canManage}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function FigmaDesignShowcase({
  docsUrl,
  initialUploads,
  isAdmin,
}: {
  docsUrl: string;
  initialUploads: GalleryUpload[];
  isAdmin: boolean;
}) {
  const [activeTab, setActiveTab] = useState<GalleryTab>("videos");
  const [uploadMode, setUploadMode] = useState<GalleryTab>("videos");
  const [drafts, setDrafts] = useState<Record<GalleryTab, UploadDraft>>({
    videos: createEmptyDraft(),
    images: createEmptyDraft(),
  });
  const [formVersion, setFormVersion] = useState(0);
  const [uploads, setUploads] = useState<GalleryUpload[]>(initialUploads);
  const [isSaving, setIsSaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [previewProject, setPreviewProject] = useState<FigmaProject | null>(null);

  const currentDraft = drafts[uploadMode];
  const uploadProjects = uploads.map(mapUploadToProject);
  const uploadedVideoProjects = uploadProjects.filter(
    (project) => project.uploadKind === "videos",
  );
  const uploadedImageProjects = uploadProjects.filter(
    (project) => project.uploadKind === "images",
  );
  const videoProjects = [...uploadedVideoProjects, ...DEFAULT_PROJECTS];
  const imageProjects = [...uploadedImageProjects, ...DEFAULT_PROJECTS];

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setNotice(null);
    }, 4200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [notice]);

  function updateDraft(tab: GalleryTab, patch: Partial<UploadDraft>) {
    setDrafts((current) => ({
      ...current,
      [tab]: {
        ...current[tab],
        ...patch,
      },
    }));
  }

  function handleTextChange(
    field: "title" | "description" | "link",
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    updateDraft(uploadMode, { [field]: event.target.value } as Partial<UploadDraft>);
  }

  function handleMediaSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      updateDraft(uploadMode, { mediaFile: null });
      return;
    }

    const valid =
      uploadMode === "videos"
        ? file.type.startsWith("video/")
        : file.type.startsWith("image/");

    if (!valid) {
      event.target.value = "";
      setNotice({
        tone: "error",
        message:
          uploadMode === "videos"
            ? "Please choose a video file for the video uploader."
            : "Please choose an image file for the image uploader.",
      });
      return;
    }

    updateDraft(uploadMode, { mediaFile: file });
  }

  function handleThumbnailSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      updateDraft(uploadMode, { thumbnailFile: null });
      return;
    }

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      setNotice({
        tone: "error",
        message: "Thumbnail must be an image file.",
      });
      return;
    }

    updateDraft(uploadMode, { thumbnailFile: file });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentDraft.mediaFile) {
      setNotice({
        tone: "error",
        message:
          uploadMode === "videos"
            ? "Please choose a video file before uploading."
            : "Please choose an image file before uploading.",
      });
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.set("kind", uploadMode);
      formData.set("title", currentDraft.title.trim());
      formData.set("description", currentDraft.description.trim());
      formData.set("link", currentDraft.link.trim());
      formData.set("media", currentDraft.mediaFile);

      if (currentDraft.thumbnailFile) {
        formData.set("thumbnail", currentDraft.thumbnailFile);
      }

      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as {
        item?: GalleryUpload;
        error?: string;
      };

      if (!response.ok || !payload.item) {
        setNotice({
          tone: "error",
          message: payload.error ?? "The upload could not be saved.",
        });
        return;
      }

      setUploads((current) => [payload.item as GalleryUpload, ...current]);
      setDrafts((current) => ({
        ...current,
        [uploadMode]: createEmptyDraft(),
      }));
      setFormVersion((current) => current + 1);
      setActiveTab(uploadMode);
      setNotice({
        tone: "success",
        message:
          uploadMode === "videos"
            ? "Video uploaded and added to the live preview gallery."
            : "Image uploaded and added to the live preview gallery.",
      });
    } catch {
      setNotice({
        tone: "error",
        message: "The upload could not be saved.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemove(projectId: string) {
    const project = uploadProjects.find((item) => item.id === projectId);

    if (!project) {
      return;
    }

    setRemovingId(projectId);

    try {
      const response = await fetch(`/api/admin/gallery?id=${projectId}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setNotice({
          tone: "error",
          message: payload.error ?? "I could not remove that upload.",
        });
        return;
      }

      setUploads((current) => current.filter((upload) => upload.id !== projectId));
      setNotice({
        tone: "success",
        message: `${project.title} was removed from the gallery.`,
      });
    } catch {
      setNotice({
        tone: "error",
        message: "I could not remove that upload.",
      });
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="mt-6 space-y-6 sm:space-y-8">
      <section className="panel overflow-hidden rounded-[34px] p-5 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="min-w-0">
            <span className="mono inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] tracking-[0.18em] text-white/58 uppercase">
              Figma design showcase
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              UI design that feels clean, premium, and ready for real code.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/66 sm:text-lg">
              This page shows how I use Figma for wireframes, polished UI, responsive
              layouts, developer handoff, and live media uploads for design case studies.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {TECHNICAL_TOOLS.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-white/70"
                >
                  {tool}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {isAdmin ? (
                <a
                  href="#figma-uploader"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-92"
                >
                  Admin upload panel
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}
              <a
                href={docsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/5 px-5 py-3 text-sm font-medium text-white/86 transition hover:border-white/22 hover:bg-white/9"
              >
                Figma docs
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(162,89,255,0.22),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(54,183,255,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 sm:p-6">
            <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-[#ff9f68]/14 blur-3xl" />
            <div className="absolute bottom-8 right-0 h-32 w-32 rounded-full bg-[#6ecbff]/14 blur-3xl" />
            <div className="relative z-10 grid gap-4">
              <div className="figma-float rounded-[26px] border border-white/12 bg-black/22 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="mono text-[10px] tracking-[0.16em] text-white/50 uppercase">
                      Design mindset
                    </div>
                    <div className="mt-2 text-lg font-semibold text-white/92">
                      Clarity first, style second
                    </div>
                  </div>
                  <Palette className="h-5 w-5 text-[#f7a15c]" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/68">
                  Every layout is shaped around hierarchy, spacing, usability, and smooth collaboration with development.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="figma-float rounded-[24px] border border-white/12 bg-black/18 p-4 [animation-delay:1.4s]">
                  <div className="mono text-[10px] tracking-[0.16em] text-white/48 uppercase">
                    Uploaded videos
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-white/94">
                    {uploadedVideoProjects.length}
                  </div>
                  <p className="mt-2 text-sm text-white/64">
                    Admin-published motion clips ready inside the main preview gallery.
                  </p>
                </div>
                <div className="figma-float rounded-[24px] border border-white/12 bg-black/18 p-4 [animation-delay:2.4s]">
                  <div className="mono text-[10px] tracking-[0.16em] text-white/48 uppercase">
                    Uploaded images
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-white/94">
                    {uploadedImageProjects.length}
                  </div>
                  <p className="mt-2 text-sm text-white/64">
                    Admin-published image boards and thumbnails in the moving preview rail.
                  </p>
                </div>
              </div>

              <div className="figma-float rounded-[24px] border border-white/12 bg-black/20 p-4 [animation-delay:0.7s]">
                <div className="mono text-[10px] tracking-[0.16em] text-white/48 uppercase">
                  Upload rules
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                    <div className="text-sm font-medium text-white/90">Required</div>
                    <div className="mt-1 text-xs text-white/58">
                      Title, description, link, and the main media file.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                    <div className="text-sm font-medium text-white/90">Optional</div>
                    <div className="mt-1 text-xs text-white/58">
                      Add a thumbnail for both video and image uploads.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                    <div className="text-sm font-medium text-white/90">Instant</div>
                    <div className="mt-1 text-xs text-white/58">
                      New uploads appear immediately in the preview area below.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isAdmin ? (
        <section id="figma-uploader" className="panel rounded-[34px] p-4 sm:p-6 lg:p-8">
          <div className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
            <div className="space-y-5">
              <div>
                <div className="mono text-[11px] tracking-[0.18em] text-white/44 uppercase">
                  Admin upload manager
                </div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Publish video and image projects.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/64 sm:text-base">
                  Admin-only upload is unlocked. New media is written to the site,
                  stored inside the project folder, and shown to all visitors in the
                  gallery below.
                </p>
              </div>

              <div className="rounded-[24px] border border-emerald-300/16 bg-emerald-400/8 p-4">
                <div className="mono text-[10px] tracking-[0.16em] text-emerald-100/72 uppercase">
                  Git-ready storage
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/72">
                  After upload, files are saved directly in
                  `public/figma/uploads/videos`, `public/figma/uploads/images`, or
                  `public/figma/uploads/thumbnails`, and metadata is saved in
                  `data/figma-gallery.json`. That means you can upload, then `git add .`
                  and push the media with the project.
                </p>
              </div>

              <div
                className="inline-flex rounded-2xl border border-white/10 bg-black/24 p-1.5"
                role="tablist"
                aria-label="Upload project type"
              >
                {[
                  { key: "videos" as const, label: "Upload video", Icon: Clapperboard },
                  { key: "images" as const, label: "Upload image", Icon: ImagePlus },
                ].map((tab) => {
                  const isActive = uploadMode === tab.key;

                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setUploadMode(tab.key)}
                      className={[
                        "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition",
                        isActive
                          ? "bg-white text-black"
                          : "text-white/66 hover:bg-white/6 hover:text-white/90",
                      ].join(" ")}
                    >
                      <tab.Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <form
                key={`${uploadMode}-${formVersion}`}
                onSubmit={handleSubmit}
                className="space-y-4 rounded-[28px] border border-white/10 bg-black/18 p-4 sm:p-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-white/84">Title</span>
                    <input
                      type="text"
                      required
                      value={currentDraft.title}
                      onChange={(event) => handleTextChange("title", event)}
                      placeholder={
                        uploadMode === "videos"
                          ? "Luxury Travel App Prototype"
                          : "Dashboard UI Board"
                      }
                      className="w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-white/26"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-white/84">
                      <Link2 className="h-4 w-4 text-white/56" />
                      Link
                    </span>
                    <input
                      type="url"
                      required
                      value={currentDraft.link}
                      onChange={(event) => handleTextChange("link", event)}
                      placeholder="https://www.figma.com/file/..."
                      className="w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-white/26"
                    />
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-white/84">Description</span>
                  <textarea
                    required
                    rows={4}
                    value={currentDraft.description}
                    onChange={(event) => handleTextChange("description", event)}
                    placeholder="Explain what this design project does, what you designed, and why it matters."
                    className="w-full resize-none rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-white/26"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-white/84">
                      {uploadMode === "videos" ? "Video file" : "Image file"}
                    </span>
                    <input
                      type="file"
                      required
                      accept={uploadMode === "videos" ? "video/*" : "image/*"}
                      onChange={handleMediaSelection}
                      className="block w-full rounded-2xl border border-dashed border-white/14 bg-white/[0.03] px-4 py-3 text-sm text-white/70 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black"
                    />
                    <div className="text-xs text-white/46">
                      {currentDraft.mediaFile
                        ? `Selected: ${currentDraft.mediaFile.name}`
                        : uploadMode === "videos"
                          ? "Upload MP4, WebM, or another browser-safe video format."
                          : "Upload PNG, JPG, WebP, or another image format."}
                    </div>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-white/84">
                      Thumbnail image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailSelection}
                      className="block w-full rounded-2xl border border-dashed border-white/14 bg-white/[0.03] px-4 py-3 text-sm text-white/70 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black"
                    />
                    <div className="text-xs text-white/46">
                      {currentDraft.thumbnailFile
                        ? `Selected: ${currentDraft.thumbnailFile.name}`
                        : "Optional for both videos and images. If you skip it, the gallery still creates a preview."}
                    </div>
                  </label>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/64">
                  <div className="flex items-start gap-3">
                    <UploadCloud className="mt-0.5 h-4 w-4 text-white/70" />
                    <p>
                      Title, description, link, and the main file are required.
                      Thumbnail is optional for both video and image uploads.
                    </p>
                  </div>
                  <div className="mt-3 flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300/80" />
                    <p>
                      Uploaded projects are published to the site and become visible
                      to all visitors immediately, while the files stay inside the repo
                      folder for Git push.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {notice ? (
                    <div
                      className={[
                        "rounded-xl border px-4 py-3 text-sm",
                        notice.tone === "success"
                          ? "border-emerald-300/18 bg-emerald-400/10 text-emerald-100"
                          : "border-rose-300/18 bg-rose-400/10 text-rose-100",
                      ].join(" ")}
                    >
                      {notice.message}
                    </div>
                  ) : (
                    <div className="text-sm text-white/42">
                      Signed admin session active.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {isSaving ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <UploadCloud className="h-4 w-4" />
                    )}
                    {isSaving
                      ? "Uploading..."
                      : uploadMode === "videos"
                        ? "Upload video"
                        : "Upload image"}
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] border border-white/10 bg-black/18 p-5">
                <div className="mono text-[10px] tracking-[0.16em] text-white/48 uppercase">
                  Admin control
                </div>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white/94">
                  Only admin can change website media.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/66">
                  Visitors can view the gallery and browse the site, but only the
                  authenticated admin account can publish or remove video and image
                  content.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-black/18 p-4">
                <div className="mono mb-3 text-[10px] tracking-[0.16em] text-white/48 uppercase">
                  Current preview rail
                </div>
                <PreviewRail
                  frames={
                    uploadMode === "videos"
                      ? uploadedVideoProjects[0]?.frames ?? DEFAULT_PROJECTS[0].frames
                      : uploadedImageProjects[0]?.frames ?? DEFAULT_PROJECTS[1].frames
                  }
                  compact
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="panel rounded-[30px] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-[#f7a15c]" />
            <h2 className="text-xl font-semibold tracking-tight text-white/96">
              Design skill abilities
            </h2>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {DESIGN_STRENGTHS.map((item) => (
              <article
                key={item.title}
                className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <item.Icon className="h-5 w-5 text-white/86" />
                  <span className="mono text-[10px] tracking-[0.16em] text-white/42 uppercase">
                    Ability
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white/92">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/64">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="panel rounded-[30px] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Layers3 className="h-5 w-5 text-[#74d7ff]" />
            <h2 className="text-xl font-semibold tracking-tight text-white/96">
              Technical use in Figma
            </h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/66 sm:text-base">
            I use Figma not only for visuals, but to organize the product thinking
            behind every screen: structure, reuse, states, interaction, handoff,
            and showcase-ready media presentation.
          </p>
          <div className="mt-5 space-y-3">
            {[
              "Build reusable components so the interface stays consistent across pages.",
              "Use auto layout and constraints so responsive behavior is already planned.",
              "Prototype core flows to test navigation, transitions, and action priority.",
              "Prepare spacing, state variations, notes, and preview media so development moves faster.",
            ].map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/68"
              >
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="figma-gallery" className="panel rounded-[34px] p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mono text-[11px] tracking-[0.18em] text-white/44 uppercase">
              Projects gallery
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Figma projects with motion-first previews.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/64 sm:text-base">
              Hover a video card to get a quick motion preview, then click to open a
              larger player. Uploaded projects are shown first, then the curated
              showcase designs.
            </p>
          </div>

          <div
            className="inline-flex rounded-2xl border border-white/10 bg-black/24 p-1.5"
            role="tablist"
            aria-label="Figma project gallery"
          >
            {[
              { key: "videos" as const, label: `Videos (${videoProjects.length})`, Icon: Film },
              { key: "images" as const, label: `Images (${imageProjects.length})`, Icon: ImageIcon },
            ].map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.key)}
                  className={[
                    "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-white text-black"
                      : "text-white/66 hover:bg-white/6 hover:text-white/90",
                  ].join(" ")}
                >
                  <tab.Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-6">
          {activeTab === "videos" ? (
            <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
              {videoProjects.map((project) => (
                <VideoProjectCard
                  key={project.id}
                  project={project}
                  onRemove={handleRemove}
                  isRemoving={removingId === project.id}
                  canManage={isAdmin}
                  onOpenPreview={setPreviewProject}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {imageProjects.map((project) => (
                <ImageProjectCard
                  key={project.id}
                  project={project}
                  onRemove={handleRemove}
                  isRemoving={removingId === project.id}
                  canManage={isAdmin}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <GalleryPreviewDialog
        project={previewProject}
        onClose={() => setPreviewProject(null)}
      />
    </div>
  );
}
