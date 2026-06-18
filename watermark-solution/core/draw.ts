import type { ColorScheme } from './types';
import { resolveThemeColor } from './theme';

export interface DrawOptions {
  text: string | string[];
  fontSize: number;
  fontFamily: string;
  gap: [number, number];
  rotate: number;
  lightColor: string;
  darkColor: string;
  colorScheme: ColorScheme;
}

const DEFAULT_TILE = 280;

/**
 * 在 Canvas 上绘制平铺水印，返回 base64 PNG。
 * 透明度通过 fillStyle 的 rgba alpha 通道写入，不依赖 CSS opacity。
 */
export function drawWatermarkDataUrl(options: DrawOptions): string {
  const lines = Array.isArray(options.text) ? options.text : [options.text];
  const color = resolveThemeColor(
    options.colorScheme,
    options.lightColor,
    options.darkColor,
  );

  const [gapX, gapY] = options.gap;
  const tileW = gapX + DEFAULT_TILE;
  const tileH = gapY + DEFAULT_TILE;

  const canvas = document.createElement('canvas');
  canvas.width = tileW;
  canvas.height = tileH;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.clearRect(0, 0, tileW, tileH);
  ctx.translate(tileW / 2, tileH / 2);
  ctx.rotate((options.rotate * Math.PI) / 180);
  ctx.font = `${options.fontSize}px ${options.fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lineHeight = options.fontSize * 1.4;
  const totalHeight = (lines.length - 1) * lineHeight;
  lines.forEach((line, i) => {
    const y = i * lineHeight - totalHeight / 2;
    ctx.fillText(line, 0, y);
  });

  return canvas.toDataURL('image/png');
}
