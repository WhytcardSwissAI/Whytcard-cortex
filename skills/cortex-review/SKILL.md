---
name: cortex-review
description: Analyse the current Cortex pipeline and guide, and suggest how to converge toward a sharper, conflict-free set of rules.
allowed-tools: Bash(node:*)
---

The current Cortex state (JSON):

!`node "${CLAUDE_PLUGIN_ROOT}/cortex.mjs" status`

Audit it for the user, in their working language -- against the EVIDENCE, not just the rule list. First gather the ground truth:
- read `.cortex/log.jsonl` (tail is enough): which reflexes actually fire here, which stay silent, what kinds of prompts and failures recur;
- read `.cortex/memory.md`: is durable understanding accumulating, or has nothing been captured since the last review;
- recall this very conversation: frictions the user voiced, corrections they made, preferences they keep restating.

Then audit the guide rules against that evidence:
- rules that overlap or duplicate each other (propose a merge),
- rules that contradict one another (surface the conflict, ask which one wins),
- rules that are vague, not actionable, or visibly not changing behaviour in the log (propose a sharper wording or the cut),
- rules that look stale or one-off (ask whether to drop them),
- gaps -- frictions present in the log or the conversation that no rule addresses yet.

**Deliverable:** a short audit stating what the evidence shows (reflex activity, memory growth, recurring frictions), then concrete edits as `cortex-add` / `cortex-forget` commands; do NOT apply them without the user's go-ahead. Keep it short and honest: fewer, sharper rules beat a long list. The goal is the user's "perfect" pipeline, not a big one.
