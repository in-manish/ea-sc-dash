---
name: project-map
description: Creates and maintains the canonical project map (AI_INDEX.md + AI_FILE_MAP.yaml). Use at the start of every task to consult the map before exploring the codebase, and after completing work to update modules, ownership, key files, APIs, hooks, UI, and domain. Mandatory for any coding, refactor, or navigation task.
---

# Project Map

Canonical instructions: [`.agents/skills/project-map/SKILL.md`](../../../.agents/skills/project-map/SKILL.md)

Read that file and follow it. Do not create a second map format.

- Human index: `AI_INDEX.md`
- Machine map: `AI_FILE_MAP.yaml`
- Always-on rule: `.cursor/rules/project-map.mdc` (`alwaysApply: true`)
