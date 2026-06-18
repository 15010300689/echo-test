import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { createWatermarkEngine } from '../core/watermark';
import type { WatermarkInstance, WatermarkOptions } from '../core/types';

export type { WatermarkOptions, WatermarkInstance };

type UseWatermarkOptions = Omit<WatermarkOptions, 'container'> & {
  /** 可选：挂到 ref 指向的容器，否则 document.body */
  containerRef?: Ref<HTMLElement | null>;
};

/**
 * Vue 3 composable
 *
 * @example
 * // 全屏
 * useWatermark({ text: '内部资料' });
 *
 * // 局部
 * const box = ref<HTMLElement | null>(null);
 * useWatermark({ text: '局部水印', containerRef: box });
 */
export function useWatermark(options: UseWatermarkOptions) {
  let instance: WatermarkInstance | null = null;

  const mount = () => {
    const container = options.containerRef?.value ?? document.body;
    instance?.destroy();
    instance = createWatermarkEngine({ ...options, container });
  };

  onMounted(() => {
    mount();

    if (options.containerRef) {
      watch(options.containerRef, () => mount());
    }

    watch(
      () => options.text,
      (text) => {
        if (text !== undefined) instance?.updateText(text);
      },
    );
  });

  onUnmounted(() => {
    instance?.destroy();
    instance = null;
  });

  return {
    updateText: (text: string | string[]) => instance?.updateText(text),
  };
}
