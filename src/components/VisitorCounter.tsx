"use client";

import { useEffect, useState } from "react";
import { Eye, LoaderCircle } from "lucide-react";

type VisitorPayload = {
  totalVisitors?: number;
  unavailable?: boolean;
};

const VISITOR_CACHE_KEY = "sl-visitor-count-cache";
const VISITOR_REQUEST_TIMEOUT_MS = 5000;

function normalizeVisitorCount(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function readCachedVisitorCount() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return normalizeVisitorCount(window.localStorage.getItem(VISITOR_CACHE_KEY));
  } catch {
    return null;
  }
}

function writeCachedVisitorCount(value: number) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(VISITOR_CACHE_KEY, String(value));
  } catch {
    // Ignore storage errors.
  }
}

export default function VisitorCounter({ className = "" }: { className?: string }) {
  const [totalVisitors, setTotalVisitors] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, VISITOR_REQUEST_TIMEOUT_MS);
    let disposed = false;

    const loadVisitorCount = async () => {
      try {
        const response = await fetch("/api/visitors", {
          method: "POST",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Visitor count request failed.");
        }

        const payload = (await response.json()) as VisitorPayload;
        const nextValue = normalizeVisitorCount(payload.totalVisitors);

        if (nextValue === null || payload.unavailable) {
          throw new Error("Visitor count is unavailable.");
        }

        if (!disposed) {
          setTotalVisitors(nextValue);
          setIsLoading(false);
          writeCachedVisitorCount(nextValue);
        }
      } catch {
        if (disposed) {
          return;
        }

        const cachedValue = readCachedVisitorCount();
        setTotalVisitors(cachedValue);
        setIsLoading(false);
      }
      window.clearTimeout(timeoutId);
    };

    void loadVisitorCount();

    return () => {
      disposed = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className={[
        "mono inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-white/60",
        className,
      ].join(" ")}
    >
      <Eye className="h-3.5 w-3.5 text-white/42" />
      <span>Visitors</span>
      {isLoading ? (
        <LoaderCircle className="h-3.5 w-3.5 animate-spin text-white/50" />
      ) : totalVisitors === null ? (
        <span className="text-white/62">--</span>
      ) : (
        <span className="text-white/84">{totalVisitors.toLocaleString()}</span>
      )}
    </div>
  );
}
