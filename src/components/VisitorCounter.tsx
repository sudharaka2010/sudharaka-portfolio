"use client";

import { useEffect, useState } from "react";
import { Eye, LoaderCircle } from "lucide-react";

type VisitorPayload = {
  totalVisitors?: number;
};

let visitorRequest: Promise<number | null> | null = null;

export default function VisitorCounter({ className = "" }: { className?: string }) {
  const [totalVisitors, setTotalVisitors] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    if (!visitorRequest) {
      visitorRequest = (async () => {
        const response = await fetch("/api/visitors", {
          method: "POST",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Visitor count request failed.");
        }

        const payload = (await response.json()) as VisitorPayload;
        return typeof payload.totalVisitors === "number" ? payload.totalVisitors : null;
      })().catch(() => null);
    }

    void visitorRequest.then((value) => {
      if (!controller.signal.aborted) {
        setTotalVisitors(value);
      }
    });

    return () => {
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
      {totalVisitors === null ? (
        <LoaderCircle className="h-3.5 w-3.5 animate-spin text-white/50" />
      ) : (
        <span className="text-white/84">{totalVisitors.toLocaleString()}</span>
      )}
    </div>
  );
}
