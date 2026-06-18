'use client';

import { useEffect, useRef } from 'react';
import { createWatermarkEngine } from '../core/watermark';
import type { WatermarkInstance, WatermarkOptions } from '../core/types';

export type { WatermarkOptions, WatermarkInstance };

type WatermarkProps = Omit<WatermarkOptions, 'container'> & {
  children?: React.ReactNode;
  className?: string;
};

/**
 * React 组件：包裹业务内容，全屏水印
 *
 * @example
 * <Watermark text="张三 · 2026-05-27">
 *   <App />
 * </Watermark>
 */
export function Watermark({ children, className, ...options }: WatermarkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<WatermarkInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    instanceRef.current = createWatermarkEngine({
      ...options,
      container: containerRef.current,
    });

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, []); // 仅挂载一次，文字变更走下方 effect

  useEffect(() => {
    if (options.text !== undefined) {
      instanceRef.current?.updateText(options.text);
    }
  }, [options.text]);

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', minHeight: '100%' }}>
      {children}
    </div>
  );
}

/**
 * React Hook：直接挂到 document.body（适合已有布局、不想包一层的情况）
 *
 * @example
 * useWatermark({ text: '内部资料' });
 */
export function useWatermark(options: Omit<WatermarkOptions, 'container'>) {
  const instanceRef = useRef<WatermarkInstance | null>(null);

  useEffect(() => {
    instanceRef.current = createWatermarkEngine(options);
    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (options.text !== undefined) {
      instanceRef.current?.updateText(options.text);
    }
  }, [options.text]);
}
