---
description: Enforces global naming conventions, folder consistency, file size limits, and code style for the EA SC Dash project.
---

# Project Coding Standards

As an AI agent working on this repository, you MUST follow these coding standards to ensure maintainability, readability, and consistency across the `ea-sc-dash` project.

## 1. Naming Conventions

Maintain strict, predictable naming formats corresponding to the file's purpose:

- **React Components**: `PascalCase.jsx` (e.g., `Button.jsx`, `UserProfile.jsx`).
- **Standard Functions & Hooks**: `camelCase.js` (e.g., `useAuth.js`, `formatDate.js`).
- **Constants & Configs**: Variables must be `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`).
- **CSS / Styling**: Classes must use lowercase and hyphens (standard Tailwind format). Avoid generic class names if writing custom CSS; use BEM-like specificity if needed.

## 2. Folder Consistency

Code MUST be organized into structural boundaries cleanly:

- `src/components/`: Exclusively for pure, generic, highly-reusable UI elements (Buttons, Inputs). Elements here should NEVER contain domain-specific logic or direct API calls.
- `src/features/`: Complex domain modules. If a feature needs its own components, hooks, or API bindings, keep them grouped inside `src/features/<feature_name>/` rather than bleeding them into the global top-level directories.
- `src/utils/`: For pure functions with zero side-effects and no React dependencies.
- `src/pages/`: For route definitions. Page components should simply compose layouts and features, containing minimal raw logic.

## 3. File Size Limits

To enforce readability and testability:

- **Target Size**: Keep files under **300 lines**.
- **Refactor Threshold**: If your changes push a file past **500 lines**, YOU MUST explicitly pause and split the file into smaller sub-components or extract logic into custom hooks before continuing.
- **Function Size**: Functions should ideally serve a single responsibility and remain under **50-80 lines**. Extract massive JSX blocks into smaller render methods/components.

## 4. Code Style Enforcement

Adhere strongly to established linters and structural patterns:

- **ESLint Integration**: Respect existing ESLint configs. Specifically, fix or remove unused variables immediately (`no-unused-vars` is enforced, except for variables matching `'^[A-Z_]'`).
- **Component Style**: Favor standard function declarations for React components over arrow functions assigned to `const` at the top level, as it improves stack traces and named exports clarity (e.g., `export default function MyComponent() { ... }`).
- **Imports**: Organize imports logically:
  1. React and third-party node_modules (e.g., `react`, `lucide-react`, `axios`).
  2. Absolute/Global paths to features/components.
  3. Relative sister/child paths.
  4. Stylesheets or assets.
- **No Console Logs**: NEVER commit `console.log()` statements related to temporary debugging. Only include errors (`console.error()`) handled strategically.
