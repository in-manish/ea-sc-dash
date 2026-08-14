---
name: ai-friendly-code-structure
description: Defines AI-friendly code organization, refactoring boundaries, and navigation metadata. Use when creating or refactoring code, when files are large, or when agents need the project map (AI_INDEX.md / AI_FILE_MAP.yaml) for task-to-file discovery. Always consult the map first; update it after file or module changes.
---

# AI-Friendly Code Structure

Follow this skill to keep code easy for AI agents and humans to navigate, modify, and review.

## When to use this skill

- Use this when creating new features or modules.
- Use this when refactoring oversized files or mixed-responsibility code.
- Use this when improving discoverability so agents can find the right files quickly.
- Use this when adding architecture or repository navigation documentation.

## How to use it

Execute the workflow below in order.

### 1) Apply pre-edit decision tree

Organize code so an agent can:

- find the correct files quickly,
- make small, safe edits,
- avoid scanning unrelated large files,
- preserve architecture decisions.

**Consult the project map first** (`AI_INDEX.md` + `AI_FILE_MAP.yaml`). Follow the `project-map` skill. Do not glob/search the repo until the map has been read.

Use this before editing:

1. Read `AI_INDEX.md`, then the matching `tasks` / `features` entry in `AI_FILE_MAP.yaml` (and the feature README). Navigate to those files only.
2. Is the target file over **200 lines**?
- Yes: split by responsibility into a feature directory before adding new logic. Follow the `split-large-files` skill.
- No: continue.
3. Is new logic feature-specific?
- Yes: place under that feature folder.
- No: place in shared only if reused by at least 2 features.
4. Does the change touch sensitive paths?
- Yes: verify `critical_paths` in `AI_FILE_MAP.yaml` and keep edits minimal.
- No: continue.

### 2) Enforce structure conventions

- Prefer feature-first organization.
- Keep one primary responsibility per file.
- Use predictable names over clever names.
- Keep side effects at boundaries (API/IO/framework edges).
- Keep domain logic pure where possible.
- Avoid circular imports.

Suggested layout:

```text
src/
  features/
    <feature>/
      api/
      domain/
      hooks/
      ui/
      tests/
      README.md
  shared/
```

### 3) Enforce file and function size limits

- **Hard max file size: 200 lines.** Never grow past this; create a new file and feature directory instead.
- Soft target: keep new files closer to 100–150 lines when practical.
- Target function size: 60 lines or less.
- Warning threshold: over 100 lines in a function, split into helpers.

### 4) Maintain required navigation files

These two files are the **canonical project map**. Do not create a competing format. Consult them at task start; update them at task end. Details: `project-map` skill.

1. `AI_INDEX.md`
- Human/agent navigation map.
- Include: project purpose, entry points, feature map, common tasks -> files, test commands, sensitive files.

2. `AI_FILE_MAP.yaml`
- Machine-readable task-to-file map.
- Include sections:
  - `tasks`
  - `features`
  - `critical_paths`
  - `glossary`

Maintain feature-level guide:

3. `src/features/<feature>/README.md`
- Include ownership, key files, data flow, and common edit paths.

Maintain architecture history:

4. `DECISIONS.md` (or ADRs)
- Record non-obvious architecture constraints.

If the map has no match, search once, then add the missing task/feature entry in the same change.

### 5) Reject anti-patterns

- God files mixing unrelated concerns (e.g. 1800+ line page components).
- Oversized `utils` files with business logic from many domains.
- Cross-feature imports that bypass feature boundaries.
- Hidden behavior in barrel `index` files.
- Duplicate business rules in multiple modules.

### 6) Apply refactor and PR rules

- If touching a file over 200 lines, split in the same change (or as the first commit in the work) — do not pile on more logic.
- After **every** task that adds, moves, or renames files/modules, update the project map in the same change:
  - `AI_INDEX.md`
  - `AI_FILE_MAP.yaml`
  - `src/features/<feature>/README.md`
- Preserve behavior with tests whenever refactoring.

### 7) Use scripts as black boxes

If this skill includes scripts in `scripts/`, run script help first:

```bash
./scripts/<script-name> --help
```

Treat scripts as black boxes unless modification is required.

## Output checklist

Before finishing, verify:

- Project map was consulted **before** exploring, and updated **after** if files/modules changed.
- New or changed code is in the correct feature/shared location.
- **No source file exceeds 200 lines.**
- Navigation docs match actual file locations.
- Architecture constraints remain respected.
