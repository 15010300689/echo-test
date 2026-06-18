import { createWatermarkEngine } from '../core/watermark';
import type { WatermarkInstance, WatermarkOptions } from '../core/types';

export type { WatermarkOptions, WatermarkInstance };

/**
 * 原生 JS 接入
 *
 * @example
 * const wm = createWatermark({ text: '内部资料' });
 * wm.destroy();
 */
export function createWatermark(
  options: Omit<WatermarkOptions, 'container'> & { container?: HTMLElement },
): WatermarkInstance {
  return createWatermarkEngine(options);
}

/**
 * 挂载到指定容器（如某个 div 内局部水印）
 */
export function createContainerWatermark(
  container: HTMLElement,
  options: Omit<WatermarkOptions, 'container'>,
): WatermarkInstance {
  // 局部水印：容器需 position: relative
  const prev = container.style.position;
  if (!prev || prev === 'static') {
    container.style.position = 'relative';
  }
  return createWatermarkEngine({ ...options, container });
}
