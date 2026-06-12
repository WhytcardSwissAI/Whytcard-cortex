#!/usr/bin/env node
// WhytCard-Cortex capability: consolidate.
// Audits a project's Cortex memory (.cortex/memory.md + .cortex/guide.md) for the three rots
// that poison an append-only memory:
//   - future-date          a date later than today (clock drift or transcription error):
//                          recency can no longer be judged, which breaks "freshest wins".
//   - invalidation-marker  a line that declares a replacement/invalidation: the dead layer
//                          it replaces may still be lying around as a second truth.
//   - near-duplicate       two notes saying (almost) the same thing twice.
//
// READ-ONLY by design: it reports, the agent or the user decides what to rewrite. Rewriting
// the canonical memory is a hard-to-undo gesture, and autonomy never includes the
// irreversible (docs/CHEMIN.md). Zero dependencies, plain Node >= 18.
//
// Usage:
//   node capability.mjs [--dir <projectRoot>] [--today YYYY-MM-DD] [--pretty]
//
//   --dir     project root containing .cortex/ (default: $CLAUDE_PROJECT_DIR, else cwd)
//   --today   reference date for future-date checks (default: the system date); lets tests
//             and replays be deterministic
//   --pretty  human summary instead of JSON
//
// Output: a JSON report on stdout: { ok, today, files, findings[], counts, clean }.
// Each finding: { type, file, line, excerpt, hint } (line is 1-based).
// Exit codes: 0 = analysis completed (findings are a report, not a failure); 2 = unusable
// input (missing directory, bad --today).

import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

// ----------------------------------------------------------------------------- args
function parseArgs(argv) {
  const args = { dir: process.env.CLAUDE_PROJECT_DIR || process.cwd(), today: null, pretty: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dir") args.dir = argv[++i];
    else if (a === "--today") args.today = argv[++i];
    else if (a === "--pretty") args.pretty = true;
    else if (a === "--help" || a === "-h") args.help = true;
  }
  return args;
}

function fail(msg) {
  process.stderr.write(`consolidate: ${msg}\n`);
  process.exit(2);
}

// ----------------------------------------------------------------------------- dates
// Recognised formats, word-bounded and validated (month 1-12, day 1-31):
//   DD.MM.YYYY   31.12.2026     (FR/CH style)
//   DD/MM/YYYY   31/12/2026
//   YYYY-MM-DD   2026-12-31     (ISO)
// Dates without a year (e.g. "12.06") are deliberately NOT parsed: guessing the year
// produces false positives, and a report you cannot trust is worse than a narrower one.
const DATE_RES = [
  { re: /(^|[^\d.])(\d{1,2})\.(\d{1,2})\.(\d{4})(?![\d.])/g, d: 2, m: 3, y: 4 },
  { re: /(^|[^\d/])(\d{1,2})\/(\d{1,2})\/(\d{4})(?![\d/])/g, d: 2, m: 3, y: 4 },
  { re: /(^|[^\d-])(\d{4})-(\d{2})-(\d{2})(?![\d-])/g, y: 2, m: 3, d: 4 },
];

function datesIn(line) {
  const out = [];
  for (const { re, d, m, y } of DATE_RES) {
    re.lastIndex = 0;
    let hit;
    while ((hit = re.exec(line)) !== null) {
      const day = parseInt(hit[d], 10);
      const month = parseInt(hit[m], 10);
      const year = parseInt(hit[y], 10);
      if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1990 || year > 9999) continue;
      out.push({ raw: hit[0].replace(/^[^\d]/, ""), iso: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}` });
    }
  }
  return out;
}

// ----------------------------------------------------------------------------- markers
// A line that declares a replacement or an invalidation. The line itself is healthy -- the
// risk is the layer it kills still standing somewhere else as a second truth.
const MARKER_RE = /invalid|obsol|p[ée]rim|remplac|deprecat|supersed|annul[ée]|ne change plus|n'est plus|no longer|outdated/i;

// ----------------------------------------------------------------------------- duplicates
// Token-set similarity (Jaccard) between bullet lines. Only substantial bullets compete
// (>= 6 useful tokens), so headings and short labels never false-positive.
function tokens(line) {
  return new Set(
    line
      .toLowerCase()
      .replace(/[`*_(),;:!?"'\[\]{}<>|]/g, " ")
      .split(/[\s/\\.=-]+/)
      .filter((t) => t.length >= 4)
  );
}

function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}

const DUP_THRESHOLD = 0.6;

// ----------------------------------------------------------------------------- analysis
function analyze(text, file, todayIso) {
  const findings = [];
  const lines = text.split(/\r?\n/);
  const excerptOf = (l) => l.trim().slice(0, 120);

  // future dates + invalidation markers, line by line
  lines.forEach((line, i) => {
    if (!line.trim() || /^\s*#/.test(line)) return;
    for (const d of datesIn(line)) {
      if (d.iso > todayIso) {
        findings.push({
          type: "future-date",
          file,
          line: i + 1,
          excerpt: excerptOf(line),
          hint: `date ${d.raw} is after today (${todayIso}): clock drift or transcription error -- fix it, or recency cannot be judged`,
        });
      }
    }
    if (MARKER_RE.test(line)) {
      findings.push({
        type: "invalidation-marker",
        file,
        line: i + 1,
        excerpt: excerptOf(line),
        hint: "this line declares a replacement/invalidation: check the dead layer it replaces is gone (one truth per subject), then drop the marker if it no longer serves",
      });
    }
  });

  // near-duplicates among substantial bullets
  const bullets = [];
  lines.forEach((line, i) => {
    if (!/^\s*-\s+/.test(line)) return;
    const tk = tokens(line);
    if (tk.size >= 6) bullets.push({ i, tk, line });
  });
  for (let a = 0; a < bullets.length; a++) {
    for (let b = a + 1; b < bullets.length; b++) {
      const sim = jaccard(bullets[a].tk, bullets[b].tk);
      if (sim >= DUP_THRESHOLD) {
        findings.push({
          type: "near-duplicate",
          file,
          line: bullets[a].i + 1,
          otherLine: bullets[b].i + 1,
          excerpt: excerptOf(bullets[a].line),
          hint: `lines ${bullets[a].i + 1} and ${bullets[b].i + 1} say nearly the same thing (similarity ${sim.toFixed(2)}): keep one truth, merge or drop the other`,
        });
      }
    }
  }

  return findings;
}

// ----------------------------------------------------------------------------- main
const args = parseArgs(process.argv.slice(2));

if (args.help) {
  process.stdout.write(
    "Usage: node capability.mjs [--dir <projectRoot>] [--today YYYY-MM-DD] [--pretty]\n" +
      "Read-only audit of .cortex/memory.md + guide.md: future dates, invalidation markers, near-duplicates.\n"
  );
  process.exit(0);
}

if (!args.dir || !existsSync(args.dir) || !statSync(args.dir).isDirectory()) {
  fail(`--dir is not a directory: ${args.dir}`);
}

let todayIso;
if (args.today) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.today)) fail(`--today must be YYYY-MM-DD, got: ${args.today}`);
  todayIso = args.today;
} else {
  todayIso = new Date().toISOString().slice(0, 10);
}

const targets = [join(args.dir, ".cortex", "memory.md"), join(args.dir, ".cortex", "guide.md")];
const files = [];
let findings = [];
for (const f of targets) {
  if (!existsSync(f)) continue;
  let text;
  try {
    text = readFileSync(f, "utf8");
  } catch {
    continue; // unreadable file: skip rather than crash -- the report covers what it could read
  }
  const label = f.replace(/\\/g, "/").split("/").slice(-2).join("/");
  files.push(label);
  findings = findings.concat(analyze(text, label, todayIso));
}

if (files.length === 0) fail(`no .cortex/memory.md or guide.md under: ${args.dir}`);

const counts = {};
for (const f of findings) counts[f.type] = (counts[f.type] || 0) + 1;

const report = { ok: true, today: todayIso, files, findings, counts, clean: findings.length === 0 };

if (args.pretty) {
  const lines = [`consolidate -- ${files.join(", ")} -- today ${todayIso}`];
  if (report.clean) {
    lines.push("clean: no future dates, no invalidation markers, no near-duplicates.");
  } else {
    for (const f of findings) lines.push(`[${f.type}] ${f.file}:${f.line} ${f.excerpt}\n    -> ${f.hint}`);
    lines.push(`total: ${findings.length} finding(s) (${Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(", ")})`);
  }
  process.stdout.write(lines.join("\n") + "\n");
} else {
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
}
process.exit(0);
