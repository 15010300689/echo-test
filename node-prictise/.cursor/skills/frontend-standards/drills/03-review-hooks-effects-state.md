# Drill 03 - Review Hooks Effects And State

## Prompt

请检查这段 hooks 代码是否符合前端规范，重点看副作用和状态管理。

## Checkpoints

- 是否识别副作用滥用（如把纯计算放在 effect）
- 是否关注状态重复、状态归属、清理逻辑
- 是否提出可验证的修复建议


## Frontend Standards Review

### Scope
- Focus: hooks 副作用与状态管理
- Files: 当前组件中的 hooks 逻辑（假设）

### Findings
- 🔴 副作用滥用：`useEffect` 内包含纯计算或同步派生逻辑，导致不必要重跑与心智负担。
- 🔴 状态重复：存在“可由已有 state 推导”的冗余 state，容易出现不同步和显示错乱。
- 🟡 状态归属不当：页面级共享状态放在局部组件中，或局部瞬时状态被提升过高，边界不清。
- 🟡 清理不完整：异步请求、定时器、事件监听未在 effect cleanup 中释放，存在泄漏和竞态风险。
- 🟢 依赖项可收敛：effect 依赖过宽或过窄，建议通过稳定引用和拆分 effect 改善可预测性。

### Suggested Fixes
1. 纯计算移出 effect：把可同步计算改为渲染期计算，或在昂贵计算场景使用 `useMemo`。
2. 消除冗余 state：只保留源状态，派生值按需计算，避免双写和同步问题。
3. 按职责拆 effect：数据请求、订阅监听、DOM 交互分别独立 effect，减少耦合。
4. 补齐 cleanup：为请求增加 `AbortController`，为 `setInterval`/`addEventListener` 返回清理函数。
5. 稳定依赖引用：必要时使用 `useCallback` 或 `useMemo` 稳定依赖，避免误触发。

### Validation
- Lint: `react-hooks/exhaustive-deps`、`rules-of-hooks` 通过（建议）
- Type check: `npm run typecheck` 通过（建议）
- Runtime: 快速切换筛选或路由时无旧请求覆盖新状态（建议）
- Test: 覆盖 loading/error/success 与卸载清理场景（建议）
