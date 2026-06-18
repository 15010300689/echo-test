# Drill 05 - List Rendering Performance

## Prompt

按前端规范评审这段列表渲染代码，看看有没有性能和可读性问题。

## Checkpoints

- 是否检查 key 稳定性与重渲染风险
- 是否区分“必要优化”和“过度优化”
- 是否兼顾可读性与性能的平衡


## Frontend Standards Review

### Scope
- Focus: 列表渲染的性能与可读性
- Files: 当前列表组件及其 item 子组件（假设）

### Findings
- 🔴 `key` 不稳定：使用数组索引或临时值作为 `key`，在插入或排序后会导致错误复用与额外重渲染。
- 🔴 渲染热路径有高成本计算：在 `map` 内直接做复杂计算或格式化，列表变大时卡顿明显。
- 🟡 props 引用不稳定：给 item 传入内联对象或函数，导致子组件难以命中 memo。
- 🟡 无差别优化倾向：对小列表提前引入大量 `memo`/`useMemo`/`useCallback`，增加复杂度但收益有限。
- 🟢 可读性可提升：渲染分支和数据转换混在一起，建议拆“数据预处理”和“UI 渲染”。

### Suggested Fixes
1. 先修 `key`：使用稳定业务主键（如 `id`），禁止 index key（除静态只读列表）。
2. 预处理数据：把昂贵计算移到渲染外，必要时使用 `useMemo`，`map` 内只做轻量拼装。
3. 收敛引用抖动：将 item 事件处理提到组件外层并稳定引用，减少无效子项更新。
4. 按规模做优化：小列表优先可读性；大列表或高频更新场景再引入 memo 或虚拟列表。
5. 结构分层：`ListContainer` 负责数据与状态，`ListItem` 负责展示，提升维护性和测试性。

### Validation
- Lint: 检查列表 key 与渲染规则（建议补充相关规则）
- Runtime: 切换筛选或排序时滚动与交互流畅，无明显掉帧
- Profiling: React DevTools Profiler 中提交次数下降、耗时热点减少
- Readability: 评审中能快速区分数据处理层与展示层
