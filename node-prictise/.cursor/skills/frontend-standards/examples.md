# Frontend Standards Examples

## Example 1: Ask For Rules Setup

Input:

```text
帮我给 React + TS 项目配置前端规范，要求统一代码风格并接入 CI。
```

Expected behavior:
- Identify stack and existing tooling first
- Propose lint/format/typecheck baseline
- Output actionable steps and file-level suggestions

Expected output shape:

```markdown
## Frontend Standards Review

### Scope
- Stack: React + TypeScript
- Files: package.json, eslint config, prettier config, CI workflow

### Findings
- 🔴 Missing lint gate in CI
- 🟡 TypeScript strict mode disabled
- 🟢 Consider adding Stylelint if CSS scales up

### Suggested Fixes
1. Add ESLint + Prettier + typecheck scripts
2. Add CI job to run lint and typecheck
3. Enable `strict` and fix incremental errors

### Validation
- Lint: pass
- Type check: pass
- Build/Test: pass
```

## Example 2: Component Review Request

Input:

```text
请按前端规范 review 这个组件，重点看可维护性和可访问性。
```

Expected behavior:
- Review with severity levels
- Focus on component boundary, semantic HTML, and event handling
- Provide concise, fix-oriented feedback

Expected output snippet:

```markdown
### Findings
- 🔴 Button rendered with non-interactive element and click handler only
- 🟡 Component mixes data fetching and presentational rendering
- 🟢 Extract repeated className combinations to helper
```

## Example 3: Async State Pattern

Input:

```text
这个页面请求接口后偶发数据显示错乱，帮我按规范给修复建议。
```

Expected behavior:
- Check race conditions and stale updates
- Recommend cancellation or request identity guards
- Ensure loading/error/empty states are explicit

Expected output snippet:

```markdown
### Suggested Fixes
1. Add AbortController for in-flight request cancellation
2. Guard state updates by latest request token
3. Split `loading`, `error`, `data` into explicit render branches
```
