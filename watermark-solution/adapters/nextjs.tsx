'use client';

/**
 * Next.js App Router 专用客户端组件
 * 在 layout.tsx 中引入即可全局生效
 *
 * @example layout.tsx
 * import { NextWatermark } from '@/watermark-solution/adapters/nextjs';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <NextWatermark text={['NextGram', '内部预览']} />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 */
export { Watermark as NextWatermark, useWatermark as useNextWatermark } from './react';
