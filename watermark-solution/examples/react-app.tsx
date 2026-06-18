/**
 * React 接入示例（CRA / Vite / Next.js Pages Router 均适用）
 */
import { Watermark, useWatermark } from '../adapters/react';

// --- 方式 A：组件包裹 ---
export function AppWithWatermark() {
  return (
    <Watermark text={['内部资料', '张三 · 2026-05-27']}>
      <main>
        <h1>业务页面</h1>
      </main>
    </Watermark>
  );
}

// --- 方式 B：Hook 全屏挂载（不额外包 DOM） ---
export function AppWithHook() {
  useWatermark({
    text: ['内部资料', '张三 · 2026-05-27'],
    gap: [180, 140],
    rotate: -20,
  });

  return (
    <main>
      <h1>业务页面</h1>
    </main>
  );
}
