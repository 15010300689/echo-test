# Drill 08 - Split Large Component

## Prompt

帮我把这个"巨型组件"按前端规范拆分成更合理的组件结构，并说明拆分依据。注意不要在项目里拆，单独列出来需要改动点。

## Checkpoints

- 是否给出拆分原则（职责、复用、状态归属）
- 是否提供可执行的分步拆分计划
- 是否说明拆分后的目录与边界


## Frontend Standards Review

### Scope
- Focus: 巨型组件拆分方案设计（不落地改代码）
- Constraint: 仅输出改动点、目录方案、边界说明
- Goal: 提升可维护性、复用性、测试性

### 拆分原则
- 职责单一：容器负责数据与状态，展示组件只负责 UI。
- 复用优先：重复 UI 或交互抽离为可复用子组件。
- 状态归属最小化：局部状态留在子组件，共享状态由容器或上层管理。
- 副作用隔离：请求、订阅、埋点等副作用统一放到 hooks 或容器层。
- 边界清晰：通过 `props` 与回调通信，避免子组件直接依赖页面上下文。

### 分步拆分计划（可执行）
1. 识别模块边界：标注数据获取区、筛选区、列表区、详情区、操作区、弹窗区。
2. 抽离展示组件：先拆纯 UI（无副作用）部分，确保输入输出只依赖 `props`。
3. 抽离业务 hooks：将请求、状态编排、派生逻辑迁移到 `useXxx` hooks。
4. 收敛状态与回调：明确状态归属，统一事件回调命名与流向。
5. 补充验证清单：对比拆分前后渲染与交互行为一致性。
6. 最后清理：删除冗余状态、重复计算与无用分支，统一命名和导入结构。

### 建议目录与边界（示例）

```text
src/features/xxx/
  page/
    XxxPage.tsx                 # 容器：组装数据、协调状态、路由交互
  components/
    XxxFilterBar.tsx            # 展示：筛选 UI
    XxxList.tsx                 # 展示：列表容器（无请求）
    XxxListItem.tsx             # 展示：列表项
    XxxDetailPanel.tsx          # 展示：详情面板
    XxxActionBar.tsx            # 展示：操作区
  hooks/
    useXxxData.ts               # 数据请求与缓存策略
    useXxxFilters.ts            # 筛选状态与派生逻辑
    useXxxActions.ts            # 业务动作与副作用
  types/
    xxx.ts                      # 类型定义
  utils/
    mapper.ts                   # 数据映射与格式化
```

### 需要改动点（不实际改代码）
- 将原组件中的请求逻辑迁移到 `useXxxData`。
- 将筛选状态与派生逻辑迁移到 `useXxxFilters`。
- 将重复 JSX 区块拆为 `XxxFilterBar`、`XxxList`、`XxxDetailPanel`。
- 将原内联事件函数改为容器统一回调后下发。
- 将格式化或映射逻辑从 JSX 内移到 `utils/mapper.ts`。
- 建立统一 `types`，减少隐式 `any` 与跨组件类型漂移。

### Validation
- 行为一致：主流程、空态、错误态、加载态不回归。
- 结构清晰：页面文件行数显著下降，组件职责可一句话描述。
- 可测性提升：hooks 与展示组件可独立测试。
- 可维护性提升：新增功能只改对应层，不跨层连锁修改。
