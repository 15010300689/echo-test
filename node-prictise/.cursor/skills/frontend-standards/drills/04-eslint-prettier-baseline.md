# Drill 04 - ESLint And Prettier Baseline

## Prompt

我想接入 ESLint + Prettier，按前端规范给我最小可用配置方案。

## Checkpoints

- 是否给出最小可用而非过度复杂的方案
- 是否包含 npm scripts 与执行顺序
- 是否说明和 TypeScript 配合的关键点


## Frontend Standards Review

### Scope
- Goal: 接入 ESLint + Prettier 的最小可用方案
- Stack: React + TypeScript（假设）
- Constraint: 优先可落地、可维护，不做过度配置

### Baseline Plan (Minimal)
- 安装最小依赖：`eslint`、`@eslint/js`、`typescript`、`typescript-eslint`、`prettier`、`eslint-config-prettier`
- 先不加过多插件（如 import 排序、复杂风格规则），避免首期接入成本过高
- 目标是先统一“正确性 + 格式化”，后续再逐步收紧

### npm scripts 与执行顺序

建议脚本：

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check",
    "typecheck": "tsc --noEmit",
    "check": "npm run lint && npm run typecheck && npm run format:check"
  }
}
```

执行顺序建议：
1. 本地开发：`lint:fix` -> `format`
2. 提交前或 CI：`check`（`lint` -> `typecheck` -> `format:check`）

### TypeScript 配合关键点
- 使用 `typescript-eslint` 做 TS 语法与规则解析，不要只用纯 JS ESLint 配置
- `tsconfig.json` 建议至少保证 `noEmit: true`，并逐步开启 `strict`
- 为避免 ESLint 与 Prettier 冲突，将 `eslint-config-prettier` 放在 ESLint 配置末尾
- 分工建议：ESLint 管代码质量，TypeScript 管类型正确性，Prettier 管格式统一

### Validation
- 能运行：`npm run check`
- 新代码默认遵守规范，旧代码可分批治理
- CI 可稳定阻断明显质量问题
