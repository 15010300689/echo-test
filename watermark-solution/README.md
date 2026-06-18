# 前端水印方案（存档）

一套可跨框架复用的前端水印实现，重点解决：

1. **跟随系统深浅色模式**（`prefers-color-scheme`）
2. **降低 DevTools 删除 / 改透明度风险**（多层冗余 + 无 CSS opacity + 篡改检测）
3. **多框架接入**（Vanilla / React / Vue / Next.js）

> 说明：前端水印只能**提高篡改成本**，无法 100% 防住本地完全可控的浏览器环境。本方案目标是让普通用户通过 Elements 面板删节点、改 `opacity` 难以长期生效。

---

## 目录结构

```
watermark-solution/
├── README.md                 # 本说明
├── core/
│   ├── types.ts              # 类型定义
│   ├── draw.ts               # Canvas 绘制（颜色/透明度 baked-in）
│   ├── theme.ts              # 系统主题检测
│   └── watermark.ts          # 核心引擎（防篡改 + 生命周期）
├── adapters/
│   ├── vanilla.ts            # 原生 JS 接入
│   ├── react.tsx             # React Hook / 组件
│   ├── vue.ts                # Vue 3 composable
│   └── nextjs.tsx            # Next.js App Router 示例
└── examples/
    ├── vanilla.html
    ├── react-app.tsx
    ├── vue-app.vue
    └── nextjs-layout.tsx
```

---

## 构建（给原生 HTML 直接用）

在 `watermark-solution/` 目录执行：

```bash
npm install
npm run build
```

构建产物：

- `dist/vanilla.iife.js`：浏览器全局变量版本（`window.WatermarkSolution`）
- `dist/vanilla.esm.js`：ESM 版本

`examples/vanilla.html` 默认引用 `../dist/vanilla.iife.js`，build 后可直接打开验证。

---

## 设计原则

### 1. 透明度不暴露为 CSS `opacity`

❌ 不推荐：

```css
.watermark { opacity: 0.12; } /* DevTools 一改就失效 */
```

✅ 推荐：在 Canvas 绘制时直接写入 alpha：

```ts
ctx.fillStyle = `rgba(0, 0, 0, 0.12)`; // 烘焙进像素
```

最终水印以 `background-image: url(data:image/png;base64,...)` 挂在容器上，**没有独立文字节点**，也没有可调 `opacity` 的 CSS 属性。

### 2. 多层冗余

同时维护 **3 层**水印容器（主层 + 2 个备份层），任一层被删改，其余层仍可见；`MutationObserver` + 定时巡检会触发重建。

### 3. 篡改检测与自愈

监听以下行为并自动恢复：

| 行为 | 检测方式 |
|------|----------|
| 删除水印节点 | `MutationObserver`（childList） |
| 改 `display` / `visibility` / `background-image` | `MutationObserver`（attributes） |
| 改 `style.opacity`（若误用） | attribute 监听 + 样式快照比对 |
| 父容器被清空 | 定时 `requestAnimationFrame` 巡检 |

### 4. 系统主题适配

```ts
const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
// light: rgba(0,0,0,0.12)   dark: rgba(255,255,255,0.16)
```

主题切换时自动重绘，无需刷新页面。

### 5. 不影响交互

```css
pointer-events: none;
user-select: none;
```

---

## 快速接入

### Vanilla JS

```ts
import { createWatermark } from './adapters/vanilla';

const wm = createWatermark({
  text: '张三 · 2026-05-27',
  container: document.body,
});

// 销毁
wm.destroy();
```

### React

```tsx
import { Watermark } from './adapters/react';

<Watermark text="张三 · 2026-05-27">
  <YourApp />
</Watermark>
```

### Vue 3

```vue
<script setup>
import { useWatermark } from './adapters/vue';
useWatermark({ text: '张三 · 2026-05-27' });
</script>
```

### Next.js（App Router）

见 `examples/nextjs-layout.tsx`：客户端组件包一层，在 `layout.tsx` 引入。

---

## 配置项

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `text` | `string \| string[]` | 必填 | 水印文字，数组时每行一条 |
| `fontSize` | `number` | `14` | 字号 px |
| `gap` | `[number, number]` | `[200, 160]` | 平铺间距 |
| `rotate` | `number` | `-22` | 旋转角度 |
| `zIndex` | `number` | `9999` | 层级 |
| `lightColor` | `string` | `rgba(0,0,0,0.12)` | 浅色模式颜色（含 alpha） |
| `darkColor` | `string` | `rgba(255,255,255,0.16)` | 深色模式颜色（含 alpha） |
| `layerCount` | `number` | `3` | 冗余层数 |
| `monitorInterval` | `number` | `2000` | 巡检间隔 ms |

---

## 安全边界（务必阅读）

| 能防 | 不能防 |
|------|--------|
| Elements 删 DOM 节点 | 禁用 JS / 改源码 |
| 改 CSS `opacity` / `display` | 截图后 PS |
| 简单 CSS 覆盖 | 浏览器扩展注入 |
| 短时间隐藏 | 完全离线逆向 |

**建议组合**：前端水印 + 服务端日志（用户 ID / IP / 时间戳）+ 敏感操作二次鉴权。

---

## 选型对比

| 方案 | 主题适配 | 防删改 | 框架耦合 | 推荐 |
|------|----------|--------|----------|------|
| 纯 DOM + CSS opacity | 需手写 | 弱 | 低 | ❌ |
| Canvas background-image | 易 | 中 | 低 | ✅ 本方案 |
| SVG foreignObject | 易 | 中 | 低 | 可选 |
| WebGL 纹理 | 难 | 高 | 高 | 过度设计 |

---

## License

内部存档，按需复制到业务项目使用。
