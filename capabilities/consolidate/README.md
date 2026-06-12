# Capability: consolidate

Read-only audit of a project's Cortex memory (`.cortex/memory.md` + `.cortex/guide.md`). It hunts the three rots that poison an append-only memory:

| Finding | What it means | Why it matters |
|---|---|---|
| `future-date` | A date later than today (clock drift, transcription error). | "Freshest wins" breaks when dates cannot be trusted. |
| `invalidation-marker` | A line declaring a replacement/invalidation (INVALIDÉE, obsolete, remplace, deprecated...). | The dead layer it kills may still stand elsewhere as a second truth. One subject, one truth. |
| `near-duplicate` | Two substantial bullets saying nearly the same thing (token similarity >= 0.6). | The same fact written twice always ends up diverging. |

## Usage

```bash
node capability.mjs [--dir <projectRoot>] [--today YYYY-MM-DD] [--pretty]
```

- `--dir` -- project root containing `.cortex/` (default: `$CLAUDE_PROJECT_DIR`, else cwd)
- `--today` -- reference date for the future-date check (default: system date). Pass it for deterministic replays and tests.
- `--pretty` -- human summary instead of JSON

## Output

JSON on stdout: `{ ok, today, files, findings[], counts, clean }`. Each finding carries `type`, `file`, `line` (1-based), `excerpt`, `hint` (and `otherLine` for duplicates).

Exit codes: `0` analysis completed (findings are a report, not a failure), `2` unusable input (missing dir, bad `--today`, no `.cortex` files).

## Guarantees and limits

- **Read-only, always.** It never modifies the audited files: rewriting canonical memory is a hard-to-undo gesture, and autonomy never includes the irreversible (`docs/CHEMIN.md`). The agent reads the report, proposes the cleanup, the human validates.
- **Generic.** No hardcoded paths or project names; everything flows through `--dir`. Works on any project that has a `.cortex/`.
- **Dates without a year are deliberately ignored** (`12.06`): guessing the year produces false positives, and a report you cannot trust is worse than a narrower one. Recognised formats: `DD.MM.YYYY`, `DD/MM/YYYY`, `YYYY-MM-DD` (validated, word-bounded).
- **The judgment stays with the agent.** The tool surfaces candidates (lines, hints); deciding which layer is the truth is reasoning work, not parsing work.

## Test

```bash
node --test capability.test.mjs
```
