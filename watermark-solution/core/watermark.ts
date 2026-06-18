import { drawWatermarkDataUrl } from './draw';
import { getSystemColorScheme, watchColorScheme } from './theme';
import type { LayerSnapshot, WatermarkInstance, WatermarkOptions } from './types';

const LAYER_ATTR = 'data-wm-layer';
const ROOT_ATTR = 'data-wm-root';

const DEFAULTS = {
  fontSize: 14,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  gap: [200, 160] as [number, number],
  rotate: -22,
  zIndex: 9999,
  lightColor: 'rgba(0, 0, 0, 0.12)',
  darkColor: 'rgba(255, 255, 255, 0.16)',
  layerCount: 3,
  monitorInterval: 2000,
};

function createLayerStyle(backgroundImage: string, zIndex: number): Partial<CSSStyleDeclaration> {
  return {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    userSelect: 'none',
    backgroundImage: `url("${backgroundImage}")`,
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto',
    zIndex: String(zIndex),
    // 故意不设 opacity —— alpha 已在 Canvas 像素中
    display: 'block',
    visibility: 'visible',
  };
}

function snapshotLayer(el: HTMLElement): LayerSnapshot {
  const s = el.style;
  return {
    display: s.display || 'block',
    visibility: s.visibility || 'visible',
    backgroundImage: s.backgroundImage || '',
    pointerEvents: s.pointerEvents || 'none',
    zIndex: s.zIndex || '',
  };
}

function applySnapshot(el: HTMLElement, snap: LayerSnapshot) {
  Object.assign(el.style, snap);
}

/**
 * 水印核心引擎
 * - Canvas 绘制 + background-image 挂载（无文字 DOM）
 * - 多层冗余
 * - MutationObserver + 定时巡检自愈
 */
export function createWatermarkEngine(options: WatermarkOptions): WatermarkInstance {
  const config = { ...DEFAULTS, ...options };
  const container = config.container ?? document.body;

  let text = options.text;
  let destroyed = false;
  let dataUrl = '';
  const layers: HTMLElement[] = [];
  const snapshots: LayerSnapshot[] = [];

  const root = document.createElement('div');
  root.setAttribute(ROOT_ATTR, 'true');
  Object.assign(root.style, {
    position: 'fixed',
    inset: '0',
    pointerEvents: 'none',
    zIndex: String(config.zIndex),
    overflow: 'hidden',
  });

  function renderLayers() {
    const scheme = getSystemColorScheme();
    dataUrl = drawWatermarkDataUrl({
      text,
      fontSize: config.fontSize,
      fontFamily: config.fontFamily,
      gap: config.gap,
      rotate: config.rotate,
      lightColor: config.lightColor,
      darkColor: config.darkColor,
      colorScheme: scheme,
    });

    const style = createLayerStyle(dataUrl, config.zIndex);

    // 确保层数
    while (layers.length < config.layerCount) {
      const layer = document.createElement('div');
      layer.setAttribute(LAYER_ATTR, String(layers.length));
      Object.assign(layer.style, style);
      root.appendChild(layer);
      layers.push(layer);
      snapshots.push(snapshotLayer(layer));
    }

    layers.forEach((layer, i) => {
      Object.assign(layer.style, style);
      snapshots[i] = snapshotLayer(layer);
    });
  }

  function ensureMounted() {
    if (destroyed) return;
    if (!container.contains(root)) {
      container.appendChild(root);
    }
  }

  function restoreTampered() {
    if (destroyed) return;

    ensureMounted();

    // 层被删则重建
    if (layers.some((l) => !root.contains(l))) {
      root.innerHTML = '';
      layers.length = 0;
      snapshots.length = 0;
      renderLayers();
      return;
    }

    // 样式被改则恢复
    layers.forEach((layer, i) => {
      const current = snapshotLayer(layer);
      const expected = snapshots[i];
      if (
        current.display !== expected.display ||
        current.visibility !== expected.visibility ||
        current.backgroundImage !== expected.backgroundImage ||
        current.pointerEvents !== expected.pointerEvents
      ) {
        // 若 backgroundImage 被清空，用最新 dataUrl 重绘
        if (!current.backgroundImage || current.backgroundImage === 'none') {
          applySnapshot(layer, {
            ...expected,
            backgroundImage: `url("${dataUrl}")`,
          });
        } else {
          applySnapshot(layer, expected);
        }
      }
    });
  }

  // --- observers ---
  let observer: MutationObserver | null = null;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  const unwatchTheme = watchColorScheme(() => {
    renderLayers();
  });

  function startMonitor() {
    observer = new MutationObserver(() => {
      restoreTampered();
    });

    observer.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

    intervalId = setInterval(restoreTampered, config.monitorInterval);
  }

  // --- init ---
  renderLayers();
  ensureMounted();
  startMonitor();

  return {
    updateText(newText: string | string[]) {
      text = newText;
      renderLayers();
    },
    destroy() {
      destroyed = true;
      observer?.disconnect();
      observer = null;
      if (intervalId) clearInterval(intervalId);
      unwatchTheme();
      root.remove();
      layers.length = 0;
      snapshots.length = 0;
    },
  };
}
