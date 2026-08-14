---
name: project-map
description: Creates and maintains the canonical project map (AI_INDEX.md + AI_FILE_MAP.yaml). Use at the start of every task to consult the map before exploring the codebase, and after completing work to update modules, ownership, key files, APIs, hooks, UI, and domain. Mandatory for any coding, refactor, or navigation task.
---

# Project Map

Canonical files at repo root. **Do not create a second map format.**

| File | Role |
|------|------|
| `AI_INDEX.md` | Human/agent index: purpose, entry points, feature table, common tasks → files |
| `AI_FILE_MAP.yaml` | Machine map: `tasks`, `features`, `critical_paths`, `glossary` |
| `src/features/<Feature>/README.md` | Feature ownership, key files, edit paths |

Cursor rule `.cursor/rules/project-map.mdc` (`alwaysApply: true`) makes consult-first / update-after mandatory.

## Mandatory workflow

```text
1. Consult map FIRST (never skip)
2. Navigate to the listed module/file
3. Do the task (respect 200-line / feature-directory rules)
4. UPDATE the map in the same change
```

Copy this checklist:

```text
Project map:
- [ ] Read AI_INDEX.md
- [ ] Read matching tasks.* and features.* in AI_FILE_MAP.yaml
- [ ] Read src/features/<Feature>/README.md if that feature is involved
- [ ] Open only mapped files (narrow search only if map miss)
- [ ] After work: patch INDEX + FILE_MAP + feature README
```

## If the map is missing

Create both root files in the **same** change. Do **not** dump every file in the repo.

1. Write `AI_INDEX.md` with: purpose, entry points, feature table, common tasks → files, constraints.
2. Write `AI_FILE_MAP.yaml` with: `tasks`, `features`, `critical_paths`, `glossary`.
3. Add `src/features/<Feature>/README.md` when creating or splitting a feature.

Keep maps **task-oriented**, not a full file inventory.

## Structure

### `AI_INDEX.md`

- Short **How to use** (consult first, update after)
- Entry points (`App.jsx`, layouts, `src/services/`)
- Feature table: name, `src/features/<Name>/`, one-line notes
- Common tasks → start-here files (API / hooks / UI / domain / page)
- Constraints (200-line max, thin pages)

### `AI_FILE_MAP.yaml`

```yaml
tasks:
  <task_key>:
    files: []      # ownership: api, domain, hooks, ui, pages
    routes: []     # optional
    notes: >       # API contracts / gotchas
features:
  <FeatureName>:
    root: src/features/<FeatureName>/
    entry: src/pages/<Page>.jsx
    # optional: *_api, routes, detail_entry
critical_paths:
  - src/App.jsx    # high-blast-radius files; keep edits minimal
glossary:
  <term>: <one-line meaning>
```

Map **modules**, not every file. List files an agent must open for that task.

### Feature README

Ownership + layout of `api/`, `domain/`, `hooks/`, `ui/`, `index.js`, thin page in `src/pages/`.

## Consult first (do not skip)

For **any** task (bug, feature, refactor, question):

1. Read `AI_INDEX.md` — pick the feature row and task row.
2. Read that `tasks.<key>` (and `features.<Name>`) in `AI_FILE_MAP.yaml`.
3. If `critical_paths` includes a target, keep the edit minimal.
4. Only then open files. Repo-wide grep/glob is a **fallback** after a map miss.

## Navigate from the map

1. Feature `root` → feature `README.md`
2. Task `files` in order: `api/` → `domain/` → `hooks/` → `ui/` → page
3. Routes in the YAML entry for URL / router work
4. Shared HTTP clients: `src/services/` (see INDEX entry points)

## Update after (same change)

Patch when you add, move, rename, delete, or change ownership of modules/files, or add routes/APIs.

| Change | Update |
|--------|--------|
| New feature directory | INDEX feature table + FILE_MAP `features` + feature README |
| New task / flow | INDEX “Common tasks” + FILE_MAP `tasks.<key>.files` |
| New/moved file on an existing task | That task’s `files` list (and README layout) |
| New API / contract | `notes` and/or `*_api` on the feature; glossary if named |
| Sensitive / high-blast file | `critical_paths` |
| Split over 200 lines | Map points at **new** files, not the old god file |

Do **not** list every extracted helper—only files needed to start the task.

If the map already has the module, **edit in place**. Never duplicate a task key or a second index file.

## Sync with file-size / feature dirs

- Source files ≤ **200** lines; function body ≤ **60**. See `.cursor/rules/file-size-and-structure.mdc`.
- New feature logic lives under `src/features/<Name>/{api,domain,hooks,ui}/`.
- Thin route pages stay in `src/pages/` and are the `entry` in YAML.
- After a split, remap `files` / `entry` to the new paths in the same change.

## Anti-patterns

- Exploring `src/` before reading the map
- A third map (`ARCHITECTURE.md`, duplicate INDEX, generated full-tree dump)
- Stale paths after a move/split
- Listing every file in the repo under `tasks`

## Additional resources

- Organization: `.agents/skills/ai-friendly-code-structure/SKILL.md`
- Splits: `.agents/skills/split-large-files/SKILL.md`
