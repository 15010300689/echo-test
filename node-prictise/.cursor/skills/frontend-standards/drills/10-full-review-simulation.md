# Drill 10 - Full Review Simulation

## Prompt

模拟一次完整的前端代码评审输出：评审范围限定为本次需求改动文件，必要时仅扩展到直接关联文件；历史问题单列，不作为本次阻断项。**注意**不要直接修改我的源代码，只需输出一份 review 报告。

## Checkpoints

- 输出结构是否完整（Scope / Findings / Fixes / Validation）
- 问题分级是否清晰，且有可执行建议
- 验证项是否可落地（lint/typecheck/test/build）

## Frontend Standards Review

### Scope
- Primary Scope：本次改动文件（必评）
- Related Scope：被改动文件直接影响的上下游（按需抽查）
- Out of Scope：历史问题仅记录，不阻断本次交付（除非是 P0 风险）

### Findings
- 🔴 请求竞态导致数据回退：快速切换筛选条件时，旧请求返回覆盖新结果，列表出现闪回。
- 🔴 组件职责混杂：页面组件同时承担请求、状态编排、渲染和交互逻辑，变更风险高且测试困难。
- 🟡 列表 key 不稳定：使用 index 作为 `key`，排序或插入后可能触发错误复用和无效重渲染。
- 🟡 可访问性缺口：筛选表单缺少 `label` 关联，错误提示未与控件建立 `aria-describedby`。
- 🟢 规则一致性可提升：存在少量命名不统一和内联回调过多问题，影响可读性与协作效率。

### Fixes
1. 先修正确性：请求层加入 `AbortController` 与 `requestId` 校验，仅允许最新请求回写状态。
2. 再拆职责：将请求与状态编排迁移到 `useTaskList`，页面组件仅负责组装与渲染。
3. 修复列表稳定性：改用业务主键（如 `task.id`）作为 `key`，禁止 index key。
4. 补齐 a11y：为表单控件补 `label + htmlFor/id`，错误态补 `aria-invalid + aria-describedby`。
5. 统一代码风格：收敛命名规范，减少渲染热路径中的内联对象或函数，必要处再做 memo。

### Validation
- `lint`: `npm run lint` 通过（含 hooks 与 a11y 关键规则）
- `typecheck`: `npm run typecheck` 通过（无新增类型错误）
- `test`: `npm test` 通过（新增竞态与状态分支用例）
- `build`: `npm run build` 通过（无打包错误，功能行为不回归）
