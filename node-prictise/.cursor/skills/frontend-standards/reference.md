---
title: frontend-standards-reference
---

# Frontend Standards Reference

This file contains a practical standards baseline that can be adapted per project.

## 1) Naming And Structure

- Use `PascalCase` for React component files and component names.
- Use `camelCase` for functions, variables, and hooks.
- Use `UPPER_SNAKE_CASE` for exported constants.
- Co-locate component-specific styles/tests with the component.
- Keep folder depth reasonable; avoid over-nesting.

## 2) Component Design

- One component should solve one clear UI responsibility.
- Keep presentational components pure when possible.
- Pass data through explicit `props`; avoid hidden coupling.
- Prefer composition over deeply nested condition branches.
- Break components when JSX or logic becomes hard to scan.

## 3) State And Effects

- Keep state as local as possible; lift only when needed.
- Derive values from existing state instead of duplicating state.
- Handle async side effects with clear loading/error/empty states.
- Always clean up subscriptions, timers, and listeners.
- Avoid effect misuse for pure computation.

## 4) API And Error Handling

- Access backend through a dedicated API layer.
- Normalize API errors into a predictable shape.
- Handle request cancellation where race conditions are possible.
- Never swallow errors silently.
- Show user-friendly fallback messages in UI.

## 5) Accessibility

- Prefer semantic HTML before ARIA.
- Ensure form controls have associated labels.
- Ensure keyboard navigation works for interactive elements.
- Provide discernible text for icon-only buttons.
- Maintain visible focus states and adequate color contrast.

## 6) Performance Baseline

- Avoid unnecessary re-renders from unstable props.
- Memoize only when profiling indicates benefit.
- Lazy-load route-level heavy components.
- Avoid large inline object/function props in hot paths.
- Keep bundle growth observable in CI where possible.

## 7) Tooling Baseline

- ESLint: correctness + maintainability + framework best practices
- Prettier: formatting source of truth
- TypeScript: `strict` preferred
- Stylelint: required for larger CSS codebases
- CI: run lint + typecheck + tests before merge

## Recommended References

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)
- [typescript-eslint Rules](https://typescript-eslint.io/rules/)
- [Prettier Docs](https://prettier.io/docs/en/)
- [Stylelint User Guide](https://stylelint.io/user-guide/get-started)
- [MDN Web Docs](https://developer.mozilla.org/)
- [WCAG Overview](https://www.w3.org/WAI/standards-guidelines/wcag/)
