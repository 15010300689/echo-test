# 多框架接入指南

本目录 `watermark-solution` 与具体框架解耦：**核心逻辑在 `core/`，各框架只做薄封装**。

---

## 接入步骤（通用）

1. 复制整个 `watermark-solution/` 到业务仓库（或发布为内部 npm 包）
2. 在应用**根节点**挂载水印（`document.body` 或 layout 容器）
3. 传入用户标识 + 日期等业务字段作为 `text`
4. 按需调整 `lightColor` / `darkColor` 的 alpha 值

---

## Vanilla / 静态页

1. 在 `watermark-solution/` 执行：

```bash
npm install
npm run build
```

2. 在原生 HTML 引入 `dist/vanilla.iife.js`：

```html
<script src="./watermark-solution/dist/vanilla.iife.js"></script>
<script>
  const wm = window.WatermarkSolution.createWatermark({
    text: ['机密', 'user@example.com', new Date().toLocaleDateString('zh-CN')],
  });
  window.addEventListener('beforeunload', () => wm.destroy());
</script>
```

> 如果你使用模块化构建器（Vite/Rollup/Webpack），可改用 `dist/vanilla.esm.js`。

---

## React（CRA / Vite）

| 场景 | 用法 |
|------|------|
| 整站包裹 | `<Watermark text="..."><App /></Watermark>` |
| 已有布局不想多包一层 | `useWatermark({ text: '...' })` 在根组件调用 |

注意：`Watermark` 与 `useWatermark` 均需在**客户端**执行（含 `document` / `window`）。

---

## Vue 3

```vue
<script setup>
import { useWatermark } from '@/watermark-solution/adapters/vue';

useWatermark({ text: ['机密', '张三'] });
</script>
```

局部水印：给容器加 `ref`，传入 `containerRef`，并确保容器 `position: relative`。

---

## Next.js App Router

1. 使用 `adapters/nextjs.tsx` 导出的 `NextWatermark`（已带 `'use client'`）
2. 在 `app/layout.tsx` 的 `<body>` 内引入
3. **不要**在 Server Component 里直接 `import core/watermark`（会访问 `document`）

动态用户信息：

```tsx
'use client';
import { useNextWatermark } from '@/watermark-solution/adapters/nextjs';

export function AuthWatermark({ name }: { name: string }) {
  useNextWatermark({ text: [name, new Date().toLocaleDateString('zh-CN')] });
  return null;
}
```

---

## Nuxt 3

与 Vue 相同，在 `app.vue` 或 layout 中：

```vue
<script setup>
import { useWatermark } from '~/watermark-solution/adapters/vue';
useWatermark({ text: '...' });
</script>
```

确保仅在客户端执行（`onMounted` 已在 composable 内处理）。

---

## Angular

无专用 adapter，在 `AppComponent.ngAfterViewInit` 中：

```ts
import { createWatermark } from './watermark-solution/adapters/vanilla';

ngAfterViewInit() {
  this.wm = createWatermark({ text: '...' });
}

ngOnDestroy() {
  this.wm?.destroy();
}
```

---

## 微前端（qiankun / Module Federation）

- **主应用统一加水印**：在主 shell 的 layout 挂载一次即可
- **子应用独立加水印**：各子应用根组件调用 `createWatermark` / `useWatermark`
- 避免重复：约定仅主应用或仅当前激活子应用挂载

---

## SSR 注意事项

| 框架 | 说明 |
|------|------|
| Next.js | 水印必须放在 Client Component |
| Nuxt | composable 在 `onMounted` 后执行，SSR 安全 |
| Remix | 在 `useEffect` 或 client-only 路由中挂载 |

水印不参与 SEO，无需服务端渲染。

---

## 与 UI 库共存

- `zIndex` 默认 `9999`，若 Modal 更高可调大
- 水印 `pointer-events: none`，不阻挡点击
- 不影响 `antd` / `element-plus` 等组件交互

---

## 复制清单

最小可用只需：

```
watermark-solution/
├── core/          # 必需
└── adapters/      # 按框架选一个
```

`examples/` 与 `README.md` 可仅作参考，不必打进生产包。
