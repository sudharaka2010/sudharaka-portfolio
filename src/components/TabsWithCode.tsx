"use client";

import React, { useMemo, useState } from "react";
import { Asterisk, Database, GitBranch, BookOpen, Copy } from "lucide-react";

import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-java";
import "prismjs/components/prism-bash";

type TabId = "process" | "db" | "git" | "docs";

type Tab = {
  id: TabId;
  label: string;
  text: string;
  icon: React.ReactNode;
  filename: string;
  code: string;
};

function langFromFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "py":
      return "python";
    case "sql":
      return "sql";
    case "yml":
    case "yaml":
      return "yaml";
    case "java":
      return "java";
    case "sh":
    case "bash":
      return "bash";
    case "md":
      return "markup";
    default:
      return "markup";
  }
}

function CodeBlock({ filename, code }: { filename: string; code: string }) {
  const language = useMemo(() => langFromFilename(filename), [filename]);
  const highlighted = useMemo(() => {
    type PrismLanguages = typeof Prism.languages;
    const grammar =
      Prism.languages[language as keyof PrismLanguages] ?? Prism.languages.markup;
    return Prism.highlight(code, grammar, language);
  }, [code, language]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore
    }
  };

  return (
    <div className="daytona-panel min-w-0 overflow-hidden rounded-2xl">
      {/* top bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
          <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
          <span className="w-2 h-2 rounded-full bg-[#28c840]" />
          <div className="mono ml-2 max-w-[140px] truncate text-[12px] text-white/60 sm:max-w-none sm:text-[13px]">
            {filename}
          </div>
        </div>

        <button
          type="button"
          onClick={onCopy}
          className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10 sm:h-9 sm:w-9"
          aria-label="Copy code"
          title="Copy"
        >
          <Copy className="w-4 h-4 text-white/70" />
        </button>
      </div>

      {/* code */}
      <pre className="max-h-[360px] overflow-auto px-3 py-3 text-[12.5px] leading-[1.7] sm:max-h-[420px] sm:px-5 sm:py-4 sm:text-[13.5px] sm:leading-[1.85]">
        <code
          className={`language-${language} mono text-white/80`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}

export default function TabsWithCode() {
  const tabs: Tab[] = useMemo(
    () => [
      {
        id: "process",
        label: "Process Execution",
        text: "Execute code and commands in isolated envs with real-time output streaming.",
        icon: <Asterisk className="h-4 w-4" />,
        filename: "process.py",
        code: `from daytona import Daytona

daytona = Daytona()
sandbox = daytona.create()

response = sandbox.process.code_run('print("Hello World!")')
print(response.result)

response = sandbox.process.exec('echo "Hello World from exec!"', cwd="/home/daytona", timeout=10)
print(response.result)

daytona.remove(sandbox)
`,
      },
      {
        id: "db",
        label: "Database Operations",
        text: "Manage schemas, queries, and persistence workflows for APIs and services.",
        icon: <Database className="h-4 w-4" />,
        filename: "schema.sql",
        code: `-- Applications table (example)
CREATE TABLE applications (
  id BIGSERIAL PRIMARY KEY,
  company VARCHAR(120) NOT NULL,
  position VARCHAR(120) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_applications_status ON applications(status);
`,
      },
      {
        id: "git",
        label: "Git Integration",
        text: "Native Git operations and secure credential handling.",
        icon: <GitBranch className="h-4 w-4" />,
        filename: "git.md",
        code: `# Clean Git flow (example)

git checkout -b feature/api-validation
git add .
git commit -m "Add validation + error handling"
git push -u origin feature/api-validation

# Open a PR, request review, merge to main
`,
      },
      {
        id: "docs",
        label: "Builtin LSP Support",
        text: "Language server features with multi-language completion and real-time analysis.",
        icon: <BookOpen className="h-4 w-4" />,
        filename: "docs.java",
        code: `@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

  @PostMapping
  public ResponseEntity<Application> create(
      @Valid @RequestBody ApplicationRequest req
  ) {
    return ResponseEntity.ok(service.create(req));
  }
}
`,
      },
    ],
    []
  );

  const [active, setActive] = useState<TabId>("process");
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div className="mt-8 grid grid-cols-1 items-start gap-6 sm:mt-10 sm:gap-10 lg:grid-cols-[minmax(300px,420px)_1fr]">
      {/* LEFT */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {tabs.map((t) => {
          const isActive = t.id === active;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={[
                "w-full text-left",
                "py-4 sm:py-6",
                "border-b border-white/10 last:border-b-0",
                "transition-colors",
                isActive ? "bg-white/10" : "hover:bg-white/5",
              ].join(" ")}
            >
              <div className="flex items-start gap-3 px-4 sm:gap-4 sm:px-6">
                {/* EXACT 16x16 icon */}
                <span
                  className={[
                    "mt-[2px] shrink-0",
                    "inline-flex items-center justify-center",
                    "h-4 w-4",
                    "[&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
                    isActive ? "text-white" : "text-white/50",
                  ].join(" ")}
                >
                  {t.icon}
                </span>

                <div className="min-w-0">
                  <div className="mono text-base font-medium tracking-tight text-white sm:text-[17px]">
                    {t.label}
                  </div>

                  <div className="mt-2.5 max-w-none text-[13.5px] leading-relaxed text-white/55 sm:mt-3 sm:max-w-[340px] sm:text-[14.5px]">
                    {t.text}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* RIGHT */}
      <CodeBlock filename={current.filename} code={current.code} />
    </div>
  );
}
