"use client";

import React from "react";

type Line = { html: string };

export default function DaytonaCode({
  title,
  leftBadges,
  lines,
}: {
  title: string;
  leftBadges?: string[];
  lines: Line[];
}) {
  return (
    <div className="code-shell min-w-0 overflow-hidden rounded-2xl">
      {/* top bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/5 px-3 py-2.5 sm:px-5 sm:py-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>
          <span className="mono max-w-[150px] truncate text-[11px] text-white/60 sm:max-w-none sm:text-xs">
            {title}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {(leftBadges ?? []).map((b) => (
            <span
              key={b}
              className="mono brd rounded-md bg-white/5 px-2 py-1 text-[10px] text-white/70 sm:text-[11px]"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* code */}
      <div className="p-3 sm:p-6">
        <div className="code-pre rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[42px_1fr] sm:grid-cols-[52px_1fr]">
            <div className="code-ln mono select-none py-4 pl-3 pr-2 text-[11px] sm:py-5 sm:pl-4 sm:pr-3 sm:text-[12px]">
              {lines.map((_, i) => (
                <div key={i} className="leading-7">
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="mono overflow-auto py-4 pr-3 text-[12.5px] text-white/80 sm:py-5 sm:pr-5 sm:text-[13.5px]">
              {lines.map((l, i) => (
                <div
                  key={i}
                  className="leading-7 whitespace-pre"
                  dangerouslySetInnerHTML={{ __html: l.html }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
