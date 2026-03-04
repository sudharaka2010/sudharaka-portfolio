"use client";

import { useEffect, useMemo, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";

type Slide = {
  badge: string;
  filename: string;
  language: "java" | "cpp";
  code: string;
};

const TYPE_DELAY_MS = 24;
const SLIDE_HOLD_MS = 1600;

const CODE_SLIDES: Slide[] = [
  {
    badge: "Java",
    filename: "ApplicationController.java",
    language: "java",
    code: `@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
  @PostMapping
  public ResponseEntity<Application> create(
      @Valid @RequestBody ApplicationRequest req
  ) {
    return ResponseEntity.ok(service.create(req));
  }
}`,
  },
  {
    badge: "C++",
    filename: "main.cpp",
    language: "cpp",
    code: `#include <iostream>
#include <vector>

int main() {
  std::vector<std::string> skills = {"C++", "OOP", "DSA"};
  for (const auto& skill : skills) {
    std::cout << "Learning: " << skill << std::endl;
  }
  return 0;
}`,
  },
];

export default function HeroCodeSlider() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const current = CODE_SLIDES[slideIndex];
  const totalChars = current.code.length;

  useEffect(() => {
    if (charCount < totalChars) {
      const typingTimer = window.setTimeout(() => {
        setCharCount((prev) => Math.min(prev + 1, totalChars));
      }, TYPE_DELAY_MS);

      return () => window.clearTimeout(typingTimer);
    }

    const holdTimer = window.setTimeout(() => {
      setSlideIndex((prev) => (prev + 1) % CODE_SLIDES.length);
      setCharCount(0);
    }, SLIDE_HOLD_MS);

    return () => window.clearTimeout(holdTimer);
  }, [charCount, totalChars]);

  const visibleCode = current.code.slice(0, charCount);
  const lineCount = current.code.split("\n").length;

  const highlightedCode = useMemo(() => {
    const grammar =
      current.language === "cpp"
        ? Prism.languages.cpp
        : Prism.languages.java;

    const safeGrammar =
      grammar ?? Prism.languages.clike ?? Prism.languages.markup;

    return Prism.highlight(visibleCode || " ", safeGrammar, current.language);
  }, [current.language, visibleCode]);

  return (
    <div className="code-shell min-w-0 overflow-hidden rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/5 px-3 py-2.5 sm:px-5 sm:py-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>
          <span className="mono max-w-[180px] truncate text-[11px] text-white/60 sm:max-w-none sm:text-xs">
            {current.filename}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="mono brd rounded-md bg-white/5 px-2 py-1 text-[10px] text-white/70 sm:text-[11px]">
            {current.badge}
          </span>
          <span className="mono brd rounded-md bg-white/5 px-2 py-1 text-[10px] text-white/70 sm:text-[11px]">
            Auto
          </span>
        </div>
      </div>

      <div className="p-3 sm:p-6">
        <div className="code-pre overflow-hidden rounded-2xl">
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
      </div>
    </div>
  );
}
