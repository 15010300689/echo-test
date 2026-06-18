import type { ColorScheme } from './types';

/** 读取当前系统颜色方案 */
export function getSystemColorScheme(): ColorScheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** 监听系统主题变化，返回取消订阅函数 */
export function watchColorScheme(onChange: (scheme: ColorScheme) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent | MediaQueryList) => {
    const matches = 'matches' in e ? e.matches : mq.matches;
    onChange(matches ? 'dark' : 'light');
  };

  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}

/** 根据主题返回对应颜色 */
export function resolveThemeColor(
  scheme: ColorScheme,
  lightColor: string,
  darkColor: string,
): string {
  return scheme === 'dark' ? darkColor : lightColor;
}
