export type ColorScheme = 'light' | 'dark';

export interface WatermarkOptions {
  /** 水印文字，支持多行 */
  text: string | string[];
  /** 挂载容器，默认 document.body */
  container?: HTMLElement;
  fontSize?: number;
  fontFamily?: string;
  /** 平铺间距 [x, y] */
  gap?: [number, number];
  /** 旋转角度（度） */
  rotate?: number;
  zIndex?: number;
  /** 浅色模式颜色，alpha 烘焙在颜色值内 */
  lightColor?: string;
  /** 深色模式颜色，alpha 烘焙在颜色值内 */
  darkColor?: string;
  /** 冗余层数量，建议 >= 2 */
  layerCount?: number;
  /** 定时巡检间隔（ms） */
  monitorInterval?: number;
}

export interface WatermarkInstance {
  /** 手动更新文字 */
  updateText: (text: string | string[]) => void;
  /** 销毁水印并释放监听 */
  destroy: () => void;
}

/** 内部使用的层快照，用于篡改比对 */
export interface LayerSnapshot {
  display: string;
  visibility: string;
  backgroundImage: string;
  pointerEvents: string;
  zIndex: string;
}
