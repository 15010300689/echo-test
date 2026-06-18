---
name: frontend-standards
description: Enforce frontend coding standards for React and TypeScript projects, covering naming conventions, component design, state handling, API usage, accessibility, and lint/format workflows. Use when users ask for frontend code规范, style consistency, ESLint or Prettier setup, component best practices, or frontend code review.
---

# Frontend Standards

## When To Use

Apply this skill when the user asks for:
- Frontend code style conventions
- React or TypeScript project规范
- ESLint, Prettier, or Stylelint recommendations
- Frontend code review with actionable fixes

## Quick Workflow

Use this checklist and keep it updated:

```markdown
Task Progress:
- [ ] Step 1: Confirm project stack and constraints
- [ ] Step 2: Define enforceable standards
- [ ] Step 3: Translate standards into lint/format rules
- [ ] Step 4: Review code against checklist
- [ ] Step 5: Propose or apply targeted fixes
```

## Step 1: Confirm Stack

Capture:
- Framework: React, Vue, or others
- Language: JavaScript or TypeScript
- Styling: CSS Modules, Tailwind, Styled Components, etc.
- Current tooling: ESLint, Prettier, Stylelint, Husky, CI

If unknown, ask concise clarifying questions first.

## Step 2: Define Standards

Use one consistent term set in all feedback:
- "component"
- "props"
- "state"
- "side effect"
- "API layer"

Prioritize these areas:
1. Naming and file organization
2. Component boundaries and reusability
3. State ownership and side-effect control
4. Error handling and async safety
5. Accessibility and semantic HTML
6. Formatting and lint consistency

## Step 3: Translate Into Tooling

Default recommendations:
- ESLint for correctness and best practices
- Prettier for formatting
- TypeScript strict mode when possible
- Stylelint when CSS complexity is non-trivial

Rule strategy:
- Prefer a strict default with explicit exceptions
- Avoid "too many options"; pick one primary pattern
- Keep auto-fixable rules enabled where safe

## Step 4: Review Checklist

Check code in this order:
1. Correctness and edge cases
2. Readability and maintainability
3. Accessibility and UX safety
4. Performance pitfalls
5. Consistency with tooling rules

Review output format:
- 🔴 Critical: Must fix before merge
- 🟡 Suggestion: Strongly recommended
- 🟢 Nice to have: Optional improvement

## Step 5: Fix Loop

After making changes:
1. Run lint/format/type checks
2. If checks fail, fix and re-run
3. Only finish when checks pass or blockers are explained clearly

## Output Template

Use this structure for responses:

```markdown
## Frontend Standards Review

### Scope
- Stack:
- Files:

### Findings
- 🔴 ...
- 🟡 ...
- 🟢 ...

### Suggested Fixes
1. ...
2. ...

### Validation
- Lint:
- Type check:
- Build/Test:
```

## Additional Resources

- For detailed standards baseline, see [reference.md](reference.md)
- For example prompts and outputs, see [examples.md](examples.md)
