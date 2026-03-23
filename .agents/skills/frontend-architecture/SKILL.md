---
name: frontend-architecture
description: Guidelines for frontend architecture, UI/UX patterns, scaling strategy, and design system thinking for the EA SC Dash project. Use this when initializing new features, deciding on file structure, or reviewing UI implementation choices.
---

# Frontend Architecture & Design Strategy

This skill defines the core architecture, design system, and scaling strategies for the React frontend. It ensures consistency, performance, and long-term maintainability for the EA SC Dash project.

## 1. Architecture Decisions

Organize code cleanly across layers to maximize readability and separation of concerns:

- **Layered / Feature-Sliced Structure:**
  - `src/features/`: Encapsulate domain-specific logic. Each feature can contain its own `api`, `components`, and `hooks`.
  - `src/pages/`: Route-level entry points. These should be thin, mostly composing features and layouts.
  - `src/components/`: Shared, domain-agnostic UI primitives (e.g., Button, Modal, Card).
  - `src/layouts/`: Global page structures (e.g., Sidebar, Header, Main App Layout).
  - `src/services/` & `src/utils/`: Global API configurations (like Axios instances) and pure utility functions.
  - `src/contexts/`: Global state providers that span the entire application (e.g., Auth, Theme).
- **State Management:**
  - Keep state as close to the UI as possible.
  - Rely on Context API only for global, mostly-static state.
  - Prefer server-state management methodologies (custom hooks encapsulating Axios requests, or libraries like React Query) over massive global stores for data fetching.

## 2. Design System Thinking

Implement UI elements systematically rather than directly applying raw style values:

- **Token-Based Styling:**
  - The project utilizes CSS Variables integrated intricately with TailwindCSS (e.g., `var(--color-bg-primary)` mapped to `bg-bg-primary`).
  - **Rule:** Always use defined theme colors (`text-primary`, `bg-secondary`, `border-hover`, `accent`) instead of hardcoded hex values to support dark mode and theming effortlessly.
- **Reusable Component Library:**
  - Build UI primitives in `src/components/` that accept standard HTML attributes (`...props`) and structured variants.
  - Do not apply external layout positioning (margins, absolute positioning) to reusable components; let the parent layout dictate spacing.
- **Consistent Typographic & Spacing Scales:**
  - Stick rigidly to configured Tailwind extensions (`text-sm`, `text-lg`, `rounded-md`, `shadow-sm`).

## 3. UI/UX Patterns

UX must feel state-of-the-art and robust under all conditions:

- **Feedback & States:**
  - Always provide loading states (skeletons or spinners) for asynchronous operations.
  - Show clear error messages or toast notifications for failed actions, rather than silent console errors.
  - Handle empty states gracefully with explanatory text or illustrations, encouraging user action.
- **Micro-interactions:**
  - Implement dynamic hover, active, and focus states for all interactive elements using Tailwind (e.g., `hover:bg-accent-hover`, `focus:ring focus:ring-accent`).
  - Use subtle transitions (e.g., `transition-colors duration-200 ease-in-out`) to make the interface feel responsive and alive.
- **Responsiveness:**
  - Build mobile-first. Ensure all complex tables, grids, and layouts scale cleanly to smaller devices using Tailwind's breakpoint system (`md:`, `lg:`).

## 4. When to Split Files

File size and complexity boundaries should heavily dictate code splitting:

- **File Size Limit:** Strongly consider splitting files that exceed 250-300 lines of code.
- **Component Complexity:** If a single component handles API fetching, complex local state, and massive JSX rendering, split it:
  - Extract the data lifecycle/logic into a custom hook (`useFeatureData.js`).
  - Extract complex sub-trees into distinct local sub-components.
- **Reusability Identification:** If a piece of UI or logic in a specific feature is suddenly needed by another feature, extract it immediately to `src/components/` (if UI) or `src/utils/` (if logic).
- **One Component per File:** Generally, export only one primary React component per file, unless grouping tightly-coupled, tiny subcomponents (e.g., a `List` and `ListItem` in the same file).

## 5. Scaling Strategy

Ensure the application performance stays excellent as it grows:

- **Code Splitting:**
  - Use `React.lazy()` and `Suspense` for route-level code splitting so the initial bundle remains small and extremely fast to load.
- **Performance Optimization:**
  - Use `useMemo` for expensive synchronous data transformations locally.
  - Use `useCallback` for functions passed to deeply nested children or complex dependency arrays, but avoid premature optimization for simple inline handlers.
- **API Optimization:**
  - Implement debouncing for search/filter inputs.
  - Use pagination or infinite scrolling for large dataset visualization.
- **Future-proofing:**
  - Keep business logic decoupled from UI components where possible to simplify unit testing and future framework upgrades.

## Output Checklist

Before completing tasks involving frontend changes, verify:
- [ ] Are design system tokens used instead of arbitrary stylistic values?
- [ ] Is feature-specific logic properly isolated in `src/features/` rather than mixed into generic folders?
- [ ] Are files kept reasonably sized under the threshold (<300 lines)?
- [ ] Are dynamic states (loading, error, empty) intentionally handled and presented?
- [ ] Has responsiveness been maintained across basic breakpoints?
