# Drill 06 - Accessibility Form Review

## Prompt

请从可访问性角度 review 这个表单页面，按严重级别给出问题和修复建议。

## Checkpoints

- 是否先关注语义化与表单标签关联
- 是否覆盖键盘可达、焦点可见、错误提示可感知
- 是否能输出可直接修改的建议

## Frontend Standards Review

### Scope
- Focus: 表单页面可访问性（a11y）
- Standard: 语义化优先，兼顾键盘操作与读屏可理解性
- Files: 当前表单页及其表单控件组件（假设）

### Findings
- 🔴 标签关联缺失：`input`/`select`/`textarea` 缺少可见 `label` 或 `htmlFor`/`id` 关联，读屏难以识别字段含义。
- 🔴 错误提示不可感知：校验失败仅有颜色变化或占位文本，未通过 `aria-describedby` 或 `aria-invalid` 关联到错误信息。
- 🟡 键盘可达性不完整：自定义下拉或日期控件仅支持鼠标操作，Tab 顺序与交互行为不完整。
- 🟡 焦点可见性不足：焦点样式被全局样式覆盖，键盘用户难以定位当前控件。
- 🟢 语义结构可优化：相关字段未使用 `fieldset`/`legend` 分组，复杂表单理解成本偏高。

### Suggested Fixes
1. 补齐标签语义：每个表单控件提供可见 `label`，并通过 `id + htmlFor` 建立一一关联。
2. 完善错误可感知链路：错误时设置 `aria-invalid="true"`，错误文案加 `id` 并挂到控件 `aria-describedby`。
3. 保证键盘可操作：自定义控件支持 Tab 进入、Enter 或 Space 触发、Esc 关闭、方向键导航。
4. 恢复可见焦点：不要移除 `outline`；若自定义焦点样式，确保对比度与可见性明显。
5. 优化表单分组：语义相关字段使用 `fieldset + legend`，提升读屏和结构理解体验。

### Validation
- Keyboard: 不用鼠标可完成填写、提交、查看错误、修正全流程
- Screen Reader: 字段名、必填状态、错误信息可被正确朗读
- Visual: 焦点态清晰、错误态不只依赖颜色
- Lint/Rule: 启用并通过 `jsx-a11y` 相关规则
