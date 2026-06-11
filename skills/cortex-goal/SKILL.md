---
name: cortex-goal
description: Reason backward from a target -- name the stage to reach, derive the path to it, and pressure-test whether the plan is actually well thought out.
argument-hint: <the goal / stage to reach>
---

# Cortex - goal

The user wants to reach this goal: **$ARGUMENTS**

Before doing the work, reason it through out loud, in their working language -- and VERIFY as you go, this is not a questionnaire:

1. **The target, precisely.** State in ONE line the observable end state that proves the goal is reached. If it is fuzzy, sharpen it with the user before anything else.
2. **Work backward.** From that end state, what must be true just before it? And before that? Trace the chain back to where you stand now, so the path is *derived*, not guessed.
3. **Verify the load-bearing assumptions NOW.** List what the path assumes, then actually check each checkable one this turn -- open the real code, run the quick test, read the official docs, inspect the environment. An assumption you could have verified and did not is a defect of the plan, not a footnote. If a structured pass helps, use the reasoning tools at hand (sequential-thinking, clear-thought) out loud.
4. **Pressure-test what survives.** Where would this path break first? Name at least one credible alternative path and say why the chosen one wins -- never the first idea by default.

**Deliverable before executing:** the goal contract (the one-liner), the derived path with each step carrying its proof-of-done, the assumptions with their verification status (checked / unverifiable / to-watch), and the discarded alternative with the reason. Then proceed. The safe minimum is the floor, never the ceiling.
