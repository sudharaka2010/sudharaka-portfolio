"use client";

import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ExperienceVideoProps = {
  src: string;
  title: string;
  label: string;
};

export default function ExperienceVideo({
  src,
  title,
  label,
}: ExperienceVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const syncState = () => {
      setIsPaused(video.paused);
    };

    syncState();
    video.addEventListener("play", syncState);
    video.addEventListener("pause", syncState);
    video.addEventListener("ended", syncState);

    return () => {
      video.removeEventListener("play", syncState);
      video.removeEventListener("pause", syncState);
      video.removeEventListener("ended", syncState);
    };
  }, []);

  const onPlay = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (!hasStarted) {
      setHasStarted(true);
    }

    try {
      await video.play();
    } catch {
      // Ignore blocked playback attempts on restricted browsers.
    }
  };

  return (
    <div className="group brd relative mt-6 h-32 w-full overflow-hidden rounded-xl bg-black/50 text-left sm:mt-10 sm:h-36">
      <video
        ref={videoRef}
        className="h-full w-full object-cover opacity-85 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
        src={src}
        controls={hasStarted}
        playsInline
        preload="metadata"
        aria-label={`${title} video preview`}
      >
        Your browser does not support the video tag.
      </video>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

      {!hasStarted ? (
        <button
          type="button"
          onClick={onPlay}
          className="absolute inset-0 grid place-items-center bg-black/20 transition hover:bg-black/35"
          aria-label={`Play ${title} video`}
        >
          <span className="mono inline-flex items-center gap-2 rounded-md border border-white/25 bg-black/55 px-3 py-1.5 text-[10px] tracking-[0.14em] text-white/90">
            <Play className="h-3.5 w-3.5" />
            PLAY VIDEO
          </span>
        </button>
      ) : null}

      {hasStarted && isPaused ? (
        <button
          type="button"
          onClick={onPlay}
          className="absolute inset-0 grid place-items-center bg-black/15"
          aria-label={`Resume ${title} video`}
        >
          <span className="mono inline-flex items-center gap-2 rounded-md border border-white/25 bg-black/55 px-3 py-1.5 text-[10px] tracking-[0.14em] text-white/90">
            <Play className="h-3.5 w-3.5" />
            RESUME
          </span>
        </button>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-3 pb-2">
        <span className="mono rounded-md border border-emerald-300/30 bg-emerald-400/12 px-2 py-0.5 text-[10px] tracking-[0.14em] text-emerald-100/90">
          {label}
        </span>
      </div>
    </div>
  );
}
