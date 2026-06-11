---
name: cortex-factory
description: Build anything structural as a reusable mould -- separate engine from data, prove the structure on one real case, then duplicate by tool instead of rebuilding by hand.
argument-hint: <what to build, or the mould to duplicate>
---

# Cortex - factory

The user wants to build or duplicate: **$ARGUMENTS**

Nothing structural is built as a one-off. Before and while working, reason it as a mould, in their working language:

1. **Engine vs data.** In what you are about to build, what is GENERIC (the engine: logic, routes, pipeline, layout) and what belongs only to THIS instance (names, catalog, prices, branding, keys)? Are they physically separated -- one config file per instance, engine untouched when the instance changes? If a value specific to one instance sits inside engine code, that is the first thing to fix.

2. **Prove before you mould.** A structure is only a mould once it is PROVEN: green checks, one real end-to-end case delivered. Duplicating an unproven structure multiplies its defects. What is the one real case that validates this structure, and has it actually run?

3. **Duplicate by tool, never by hand.** Duplication is a script with arguments (zero hardcoded paths, names or accounts), which excludes the ephemeral: dependencies, build output, secrets, local state (`node_modules`, `.env*`, `.git`, `.cortex`, workspaces). Does that tool exist? If not, build it BEFORE the second instance, test it on a throwaway copy, and register it where tools are catalogued. Run the instructions it prints, do not reinvent them.

4. **Improvements flow back to the mould.** When an instance teaches you something (a bug, a better default, a missing exclusion), does the fix land in the mould and its tool -- or only in the copy? A mould that does not absorb lessons is just a stale snapshot.

Then proceed: build the engine, prove it, tool the duplication, then duplicate. The second instance should cost minutes, not days.
