/** 统一导出入口（按需 tree-shake） */
export type { WatermarkOptions, WatermarkInstance, ColorScheme } from './core/types';
export { createWatermarkEngine } from './core/watermark';
export { getSystemColorScheme, watchColorScheme } from './core/theme';
export { createWatermark, createContainerWatermark } from './adapters/vanilla';
