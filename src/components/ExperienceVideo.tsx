"use client";

import { Pause, Play } from "lucide-react";
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
  const [isPaused, setIsPaused] = useState(false);

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

    return () => {
      video.removeEventListener("play", syncState);
      video.removeEventListener("pause", syncState);
    };
  }, []);

  const onToggle = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      try {
        await video.play();
      } catch {
        // Ignore autoplay/playback issues on restricted browsers.
      }
      return;
    }

    video.pause();
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      className="group brd relative mt-6 h-32 w-full overflow-hidden rounded-xl bg-black/50 text-left sm:mt-10 sm:h-36"
      aria-label={`${title} video preview. Click to ${
        isPaused ? "play" : "pause"
      }.`}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover opacity-80 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`${title} video preview`}
      >
        Your browser does not support the video tag.
      </video>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

      <div className="pointer-events-none absolute left-2 top-2">
        <span className="mono inline-flex items-center gap-1 rounded-md border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] tracking-[0.14em] text-white/80">
          {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          {isPaused ? "PLAY" : "PAUSE"}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-3 pb-2">
        <span className="mono rounded-md border border-emerald-300/30 bg-emerald-400/12 px-2 py-0.5 text-[10px] tracking-[0.14em] text-emerald-100/90">
          {label}
        </span>
      </div>
    </button>
  );
}
