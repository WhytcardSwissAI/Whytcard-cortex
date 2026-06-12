// WhytCard-Cortex capability tests: consolidate.
// The capability is exercised as a real process (argv in, stdout/exit out), exactly as an
// agent runs it. Deterministic via --today. Proves the rule of entry to the catalogue:
// generic (no hardcoded paths -- everything through --dir), documented, and test-green.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const capability = join(dirname(fileURLToPath(import.meta.url)), "capability.mjs");

function run(args) {
  const res = spawnSync(process.execPath, [capability, ...args], { encoding: "utf8" });
  let json = null;
  try {
    json = JSON.parse(res.stdout);
  } catch {
    json = null;
  }
  return { out: res.stdout, err: res.stderr, code: res.status, json };
}

// A throwaway project with a .cortex/ memory seeded from the given content.
function withProject(memory, guide, fn) {
  const proj = mkdtempSync(join(tmpdir(), "cortex-consolidate-"));
  try {
    mkdirSync(join(proj, ".cortex"), { recursive: true });
    if (memory != null) writeFileSync(join(proj, ".cortex", "memory.md"), memory);
    if (guide != null) writeFileSync(join(proj, ".cortex", "guide.md"), guide);
    return fn(proj);
  } finally {
    rmSync(proj, { recursive: true, force: true });
  }
}

const TODAY = "2026-06-11";

test("consolidate: flags a future date (DD.MM.YYYY and ISO)", () => {
  withProject(
    [
      "# Cortex memory",
      "",
      "- STRUCTURE.md créé le 12.06.2026, loi de rangement.",
      "- Audit du dépôt fait le 2026-06-15, rien à signaler.",
      "- Décision prise le 10.06.2026 : base propre.",
    ].join("\n"),
    null,
    (proj) => {
      const r = run(["--dir", proj, "--today", TODAY]);
      assert.equal(r.code, 0);
      const future = r.json.findings.filter((f) => f.type === "future-date");
      assert.equal(future.length, 2, "exactly the two future dates are flagged");
      assert.deepEqual(future.map((f) => f.line).sort(), [3, 4]);
      assert.ok(future.every((f) => f.hint.includes(TODAY)));
    }
  );
});

test("consolidate: flags invalidation markers whose dead layer may remain", () => {
  withProject(
    [
      "# Cortex memory",
      "",
      "- Catalogue v1 FONDÉ MARCHÉ, 55 points sourcés.",
      "- Étude v1 = INVALIDÉE sur la cible, refonte en cours.",
      "- L'ancienne consigne ne change plus rien, elle est obsolète.",
    ].join("\n"),
    null,
    (proj) => {
      const r = run(["--dir", proj, "--today", TODAY]);
      const markers = r.json.findings.filter((f) => f.type === "invalidation-marker");
      assert.deepEqual(markers.map((f) => f.line).sort(), [4, 5]);
    }
  );
});

test("consolidate: flags near-duplicate bullets, not short labels", () => {
  withProject(
    [
      "# Cortex memory",
      "",
      "- Le déploiement Vercel passe toujours par le repo GitHub, jamais par la CLI locale en direct.",
      "- Le déploiement Vercel passe toujours par le repo GitHub et jamais par la CLI locale.",
      "- Tests verts.",
      "- CI verte.",
    ].join("\n"),
    null,
    (proj) => {
      const r = run(["--dir", proj, "--today", TODAY]);
      const dups = r.json.findings.filter((f) => f.type === "near-duplicate");
      assert.equal(dups.length, 1, "one duplicate pair");
      assert.equal(dups[0].line, 3);
      assert.equal(dups[0].otherLine, 4);
    }
  );
});

test("consolidate: clean memory yields a clean report", () => {
  withProject(
    [
      "# Cortex memory",
      "",
      "- Décision du 10.06.2026 : base propre, repartir de zéro.",
      "- Le build exige Node 18 minimum, vérifié en CI.",
    ].join("\n"),
    null,
    (proj) => {
      const r = run(["--dir", proj, "--today", TODAY]);
      assert.equal(r.code, 0);
      assert.equal(r.json.clean, true);
      assert.equal(r.json.findings.length, 0);
    }
  );
});

test("consolidate: audits guide.md too", () => {
  withProject(
    "# Cortex memory\n",
    "# Cortex guide\n\n- Règle posée le 13.06.2026 : toujours vérifier.\n",
    (proj) => {
      const r = run(["--dir", proj, "--today", TODAY]);
      const future = r.json.findings.filter((f) => f.type === "future-date");
      assert.equal(future.length, 1);
      assert.match(future[0].file, /guide\.md/);
    }
  );
});

test("consolidate: read-only -- the audited files are not modified", () => {
  withProject("# Cortex memory\n\n- Audit fait le 15.06.2026.\n", null, (proj) => {
    const file = join(proj, ".cortex", "memory.md");
    const before = readFileSync(file, "utf8");
    run(["--dir", proj, "--today", TODAY]);
    assert.equal(readFileSync(file, "utf8"), before);
  });
});

test("consolidate: --pretty renders a human summary", () => {
  withProject("# Cortex memory\n\n- Fait daté du 20.06.2026 à corriger.\n", null, (proj) => {
    const r = run(["--dir", proj, "--today", TODAY, "--pretty"]);
    assert.equal(r.code, 0);
    assert.match(r.out, /future-date/);
    assert.match(r.out, /total: 1 finding/);
  });
});

test("consolidate: no false positive on version numbers and year-less dates", () => {
  withProject(
    "# Cortex memory\n\n- Plugin passé en 0.5.2026 jamais -- version 0.5.2, et rdv le 12.06 sans année.\n",
    null,
    (proj) => {
      const r = run(["--dir", proj, "--today", TODAY]);
      assert.equal(r.json.findings.filter((f) => f.type === "future-date").length, 0);
    }
  );
});

test("consolidate: exit 2 on a missing directory or bad --today", () => {
  const bad = run(["--dir", join(tmpdir(), "definitely-not-here-cortex")]);
  assert.equal(bad.code, 2);
  withProject("# Cortex memory\n", null, (proj) => {
    const badToday = run(["--dir", proj, "--today", "12.06.2026"]);
    assert.equal(badToday.code, 2);
  });
});

test("consolidate: exit 2 when no .cortex files exist", () => {
  const proj = mkdtempSync(join(tmpdir(), "cortex-consolidate-empty-"));
  try {
    const r = run(["--dir", proj, "--today", TODAY]);
    assert.equal(r.code, 2);
  } finally {
    rmSync(proj, { recursive: true, force: true });
  }
});
