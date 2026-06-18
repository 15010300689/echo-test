# Drill 01 - Setup Standards

## Prompt

帮我给这个 React + TypeScript 项目制定一套前端规范，优先保证团队统一和可落地。

## Checkpoints

- 是否先确认项目栈与当前工具链
- 是否给出可执行的 ESLint/Prettier/TypeScript 基线
- 是否说明“先落地再收紧”的推进顺序

## 标准答案（参考）

### 1) 先确认项目栈与当前工具链

先执行以下命令确认现状：

```bash
npm pkg get dependencies devDependencies
npm pkg get scripts
cat tsconfig.json
```

重点确认：
- React 版本（`react` / `react-dom`）
- TypeScript 是否已启用 `strict`
- 是否已有 ESLint / Prettier
- 是否已有 CI（GitHub Actions / GitLab CI）

### 2) 最小可用规范基线（可直接落地）

安装依赖：

```bash
npm i -D eslint @eslint/js typescript typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y prettier eslint-config-prettier
```

建议 `package.json` scripts：

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check",
    "typecheck": "tsc --noEmit"
  }
}
```

规则策略：
- ESLint 先覆盖正确性和常见坏味道
- Prettier 作为格式唯一来源，避免和 ESLint 格式规则冲突
- TypeScript 以 `strict` 为目标，历史项目可分阶段开启

### 3) 推进顺序（先落地再收紧）

- Phase 1：先接入 `lint`、`format`、`typecheck`，确保全员可跑通
- Phase 2：CI 阻断 `lint` 与 `typecheck`（先不阻断 warning）
- Phase 3：逐步把关键 warning 升级为 error（如 hooks、a11y 核心规则）
- Phase 4：稳定后再引入更细粒度规范（import 顺序、组件边界、性能约束）

### 4) 验收口径

- 能一键运行：`npm run lint && npm run typecheck`
- 团队提交前有统一格式：`npm run format:check`
- CI 对核心质量门禁具备阻断能力
