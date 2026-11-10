import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Product principles 1-3 (docs/PLAN.md section 3): no guilt, no streaks,
 * no scores. This scans every screen and component for words that would
 * break them, so they can't slip in unnoticed.
 */
const BANNED = [
  /\bstreaks?\b/i,
  /\bscores?\b/i,
  /\bleaderboards?\b/i,
  /\byou missed\b/i,
  /\boverdue\b/i,
  /\bhaven'?t connected\b/i,
  /\bfailed to connect\b/i,
  /\bcomplete (today'?s|your) task\b/i,
];

function filesIn(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return filesIn(path);
    return /\.(tsx|ts)$/.test(name) ? [path] : [];
  });
}

/** Only the text people see: JSX text and string literals, not code comments. */
function visibleText(source: string) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "");
}

describe("tone of voice", () => {
  const files = [
    ...filesIn("app"),
    ...filesIn("components"),
    ...filesIn("lib/auth"),
    ...filesIn("lib/couple"),
    ...filesIn("lib/about-me"),
  ];

  it.each(files)("%s has no guilt or scoring words", (file) => {
    const text = visibleText(readFileSync(file, "utf8"));
    const hits = BANNED.filter((pattern) => pattern.test(text)).map(String);
    expect(hits).toEqual([]);
  });
});
