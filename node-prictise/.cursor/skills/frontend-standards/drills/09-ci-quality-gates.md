# Drill 09 - CI Quality Gates

## Prompt

请按前端规范给一份 CI 质量门禁建议（lint、typecheck、test），要求渐进式上线。

## Checkpoints

- 是否区分“立即执行”和“分阶段收紧”
- 是否覆盖失败策略与团队迁移成本
- 是否给出清晰的门禁顺序

## Frontend Standards Review

### Scope
- Goal: 给出 `lint`/`typecheck`/`test` 的 CI 质量门禁方案
- Constraint: 渐进式上线，避免一次性阻断历史存量问题
- Focus: 门禁顺序、失败策略、团队迁移成本

### 立即执行（Week 1）
- 上线最小门禁流水线：`lint` -> `typecheck` -> `test`
- 只阻断新增改动中的高置信问题（语法错误、类型错误、测试失败）
- 保留历史问题清单，不因历史包袱阻断主线交付

### 分阶段收紧（Week 2-6）
1. Phase 1（稳定接入）
   - 阻断：`typecheck` 失败、测试失败
   - `lint` 允许 warning，先不阻断
2. Phase 2（质量抬升）
   - 关键 lint 规则升级为 error（hooks、明显坏味道、基础 a11y）
   - 仅对变更文件启用严格门禁
3. Phase 3（全量治理）
   - 扩展到全仓库 lint 阻断
   - 增加覆盖率底线（关键模块优先）
4. Phase 4（持续优化）
   - 引入性能或包体积阈值（可选）
   - 建立例外审批机制，避免规则被随意绕过

### 门禁顺序（推荐）
1. `lint`（快，尽早失败）
2. `typecheck`（中速，类型安全）
3. `test`（较慢，行为回归）
4. `build`（可选，发布前必过）

### 失败策略
- Fail fast：任一阻断项失败即中断，节约 CI 资源
- 可读日志：错误输出需定位到文件、规则或测试用例
- 重试策略：仅对 flaky 测试做有限重试，避免掩盖真实问题
- 豁免机制：临时豁免需工单、负责人和过期时间

### 团队迁移成本控制
- 先增量治理再全量治理，避免一次性改造冲击开发节奏
- 提供本地同构命令：`npm run lint && npm run typecheck && npm test`
- 在 PR 模板中增加自检项，减少 CI 往返
- 对高频失败规则做团队宣导并提供自动修复建议

### Validation
- 2 周内：CI 红灯主要来自真实问题而非历史噪音
- 4 周内：新增 PR 的 lint/type/test 通过率稳定提升
- 6 周内：关键规则从建议平滑升级为阻断
