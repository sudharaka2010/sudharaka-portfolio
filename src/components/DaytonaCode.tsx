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
    <div className="code-shell rounded-2xl overflow-hidden">
      {/* top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>
          <span className="mono text-xs text-white/60">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          {(leftBadges ?? []).map((b) => (
            <span
              key={b}
              className="mono text-[11px] px-2 py-1 rounded-md brd bg-white/5 text-white/70"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* code */}
      <div className="p-6">
        <div className="code-pre rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[52px_1fr]">
            <div className="code-ln mono text-[12px] py-5 pl-4 pr-3 select-none">
              {lines.map((_, i) => (
                <div key={i} className="leading-7">
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="mono text-[13.5px] text-white/80 py-5 pr-5 overflow-auto">
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
