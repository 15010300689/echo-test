// core/theme.ts
function getSystemColorScheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function watchColorScheme(onChange) {
  if (typeof window === "undefined") return () => {
  };
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = (e) => {
    const matches = "matches" in e ? e.matches : mq.matches;
    onChange(matches ? "dark" : "light");
  };
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}
function resolveThemeColor(scheme, lightColor, darkColor) {
  return scheme === "dark" ? darkColor : lightColor;
}

// core/draw.ts
var DEFAULT_TILE = 280;
function drawWatermarkDataUrl(options) {
  const lines = Array.isArray(options.text) ? options.text : [options.text];
  const color = resolveThemeColor(
    options.colorScheme,
    options.lightColor,
    options.darkColor
  );
  const [gapX, gapY] = options.gap;
  const tileW = gapX + DEFAULT_TILE;
  const tileH = gapY + DEFAULT_TILE;
  const canvas = document.createElement("canvas");
  canvas.width = tileW;
  canvas.height = tileH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.clearRect(0, 0, tileW, tileH);
  ctx.translate(tileW / 2, tileH / 2);
  ctx.rotate(options.rotate * Math.PI / 180);
  ctx.font = `${options.fontSize}px ${options.fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lineHeight = options.fontSize * 1.4;
  const totalHeight = (lines.length - 1) * lineHeight;
  lines.forEach((line, i) => {
    const y = i * lineHeight - totalHeight / 2;
    ctx.fillText(line, 0, y);
  });
  return canvas.toDataURL("image/png");
}

// core/watermark.ts
var LAYER_ATTR = "data-wm-layer";
var ROOT_ATTR = "data-wm-root";
var DEFAULTS = {
  fontSize: 14,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  gap: [200, 160],
  rotate: -22,
  zIndex: 9999,
  lightColor: "rgba(0, 0, 0, 0.12)",
  darkColor: "rgba(255, 255, 255, 0.16)",
  layerCount: 3,
  monitorInterval: 2e3
};
function createLayerStyle(backgroundImage, zIndex) {
  return {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    userSelect: "none",
    backgroundImage: `url("${backgroundImage}")`,
    backgroundRepeat: "repeat",
    backgroundSize: "auto",
    zIndex: String(zIndex),
    // 故意不设 opacity —— alpha 已在 Canvas 像素中
    display: "block",
    visibility: "visible"
  };
}
function snapshotLayer(el) {
  const s = el.style;
  return {
    display: s.display || "block",
    visibility: s.visibility || "visible",
    backgroundImage: s.backgroundImage || "",
    pointerEvents: s.pointerEvents || "none",
    zIndex: s.zIndex || ""
  };
}
function applySnapshot(el, snap) {
  Object.assign(el.style, snap);
}
function createWatermarkEngine(options) {
  const config = { ...DEFAULTS, ...options };
  const container = config.container ?? document.body;
  let text = options.text;
  let destroyed = false;
  let dataUrl = "";
  const layers = [];
  const snapshots = [];
  const root = document.createElement("div");
  root.setAttribute(ROOT_ATTR, "true");
  Object.assign(root.style, {
    position: "fixed",
    inset: "0",
    pointerEvents: "none",
    zIndex: String(config.zIndex),
    overflow: "hidden"
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
      colorScheme: scheme
    });
    const style = createLayerStyle(dataUrl, config.zIndex);
    while (layers.length < config.layerCount) {
      const layer = document.createElement("div");
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
    if (layers.some((l) => !root.contains(l))) {
      root.innerHTML = "";
      layers.length = 0;
      snapshots.length = 0;
      renderLayers();
      return;
    }
    layers.forEach((layer, i) => {
      const current = snapshotLayer(layer);
      const expected = snapshots[i];
      if (current.display !== expected.display || current.visibility !== expected.visibility || current.backgroundImage !== expected.backgroundImage || current.pointerEvents !== expected.pointerEvents) {
        if (!current.backgroundImage || current.backgroundImage === "none") {
          applySnapshot(layer, {
            ...expected,
            backgroundImage: `url("${dataUrl}")`
          });
        } else {
          applySnapshot(layer, expected);
        }
      }
    });
  }
  let observer = null;
  let intervalId = null;
  const unwatchTheme = watchColorScheme(() => {
    renderLayers();
  });
  function startMonitor() {
    observer = new MutationObserver(() => {
      restoreTampered();
    });
    observer.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class"] });
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class"] });
    intervalId = setInterval(restoreTampered, config.monitorInterval);
  }
  renderLayers();
  ensureMounted();
  startMonitor();
  return {
    updateText(newText) {
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
    }
  };
}

// adapters/vanilla.ts
function createWatermark(options) {
  return createWatermarkEngine(options);
}
function createContainerWatermark(container, options) {
  const prev = container.style.position;
  if (!prev || prev === "static") {
    container.style.position = "relative";
  }
  return createWatermarkEngine({ ...options, container });
}
export {
  createContainerWatermark,
  createWatermark
};
//# sourceMappingURL=vanilla.esm.js.map
