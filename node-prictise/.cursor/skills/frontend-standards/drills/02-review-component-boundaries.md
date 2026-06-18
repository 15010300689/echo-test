# Drill 02 - Review Component Boundaries

## Prompt

按前端规范帮我 review 这个组件，重点看命名、职责边界和可维护性。

## Checkpoints

- 是否按严重级别输出（🔴/🟡/🟢）
- 是否指出“单一职责”和“组件拆分”问题
- 建议是否具体到可修改的方向

## Frontend Standards Review

### Scope
- Stack: React + TypeScript（假设）
- Focus: 命名、职责边界、可维护性
- Files: 当前组件及其直接子组件（假设）

### Findings
- 🔴 职责混杂：同一个组件同时处理数据请求、状态编排和复杂展示逻辑，违反单一职责，后续改动风险高。
- 🔴 边界不清：业务判断分散在 JSX 分支中，导致渲染层和业务层耦合，测试难度增加。
- 🟡 命名语义弱：如 `handleData`、`tempList`、`item2` 等命名无法表达意图，阅读成本高。
- 🟡 可复用性不足：重复的 UI 片段没有抽为子组件或公共渲染函数，维护时容易漏改。
- 🟢 结构可优化：可按“容器组件 + 展示组件 + hooks”分层，提升可读性与协作效率。

### Suggested Fixes
1. 先拆职责：将“请求与状态管理”移到 `useXxxData` hook，组件仅保留渲染职责。
2. 再拆视图：把重复 UI 区块拆成 `ItemRow` 或 `SectionBlock` 等展示组件，props 显式传入。
3. 统一命名：事件函数用 `handleXxx`，布尔状态用 `is`/`has`/`can` 前缀，集合名用业务语义（如 `taskList`）。
4. 收敛条件分支：把复杂条件提前整理成派生变量（如 `showEmptyState`），避免 JSX 内嵌套判断。
5. 补测试点：至少覆盖加载态、空态、错误态、主流程渲染，保证拆分后行为不回归。

### Validation
- Lint: 命名与复杂度规则通过（建议）
- Type check: `npm run typecheck` 通过（建议）
- Test: 关键渲染分支与交互路径通过（建议）
