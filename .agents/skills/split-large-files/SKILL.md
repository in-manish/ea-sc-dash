---
name: split-large-files
description: Split source files over 200 lines into feature directories with focused modules. Use when creating features, refactoring oversized files (e.g. Attendees.jsx), or when a file approaches/exceeds the 200-line limit.
---

# Split Large Files (max 200 lines)

## Rule

Each file line max 200. When grows create new file. Create directory put related files in that directory.

## When to use

- Any source file ≥ 200 lines
- Before adding code to a large file (e.g. `src/pages/Attendees.jsx` ~1900 lines)
- New features that would otherwise bloat a page component

## Workflow

1. **Measure** — `wc -l <file>`. If ≥ 200, split before editing.
2. **Map responsibilities** — list UI sections, hooks, API calls, constants, modals.
3. **Create feature directory**

```text
src/features/<FeatureName>/
  constants.js
  api/                 # API wrappers if not already in services/
  domain/              # pure helpers, normalizers
  hooks/               # data + UI state hooks
  ui/                  # presentational / container components
  index.js             # public exports only
  README.md            # file map for agents
```

4. **Extract in order** (safest first)
   - constants / status maps
   - pure helpers (`domain/`)
   - presentational components (`ui/`)
   - hooks (`hooks/`)
   - leave a thin orchestrator (`ui/<Feature>Page.jsx` or page re-export)

5. **Wire imports** — update `src/pages/<Page>.jsx` to re-export or compose the feature entry.
6. **Verify** — every new file ≤ 200 lines; behavior unchanged; no circular imports.

## Attendees split target (example)

```text
src/features/Attendees/
  constants.js
  domain/previewHelpers.js
  hooks/useAttendeeList.js
  hooks/useAttendeeSearch.js
  hooks/useAttendeeSelection.js
  ui/AttendeesPage.jsx          # thin orchestrator
  ui/AttendeeSearchToolbar.jsx
  ui/AttendeeTable.jsx
  ui/AttendeeRow.jsx
  ui/FilterDrawer.jsx
  ui/WhatsAppModal.jsx
  ui/EBadgeModal.jsx
  index.js
  README.md
src/pages/Attendees.jsx         # re-export only
```

## Anti-patterns

- Adding more logic to a 500+ line file “just this once”
- Dumping unrelated helpers into `utils.js`
- Vague names (`helpers`, `misc`, `common2`, `stuff`)
- Barrel `index.js` that re-exports everything and hides structure
- Circular imports between `ui/` and `hooks/`

## Naming

Always give **meaningful** file and directory names that describe ownership:

- ✅ `AttendeeSearchToolbar.jsx`, `useEBadgeJobs.js`, `whatsappPreview.js`
- ❌ `helpers.js`, `utils2.js`, `misc.jsx`, `Component1.jsx`

## Checklist

- [ ] No file over 200 lines
- [ ] Related files colocated in one feature directory
- [ ] Page file is thin (compose or re-export)
- [ ] Feature `README.md` lists what each file owns
