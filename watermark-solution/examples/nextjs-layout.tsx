/**
 * Next.js App Router 接入示例
 *
 * 文件位置建议：app/layout.tsx
 */
import './global.css';
import { NextWatermark } from '../adapters/nextjs';

export const metadata = {
  title: '带水印的应用',
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        {/* 客户端组件：挂到 body，不影响 SSR 内容 */}
        <NextWatermark
          text={['内部预览', `${new Date().toISOString().slice(0, 10)}`]}
          gap={[200, 160]}
          rotate={-22}
        />
        {children}
        {modal}
      </body>
    </html>
  );
}

/**
 * 若水印文字来自登录用户（需客户端获取）：
 *
 * 'use client';
 * import { useNextWatermark } from '../adapters/nextjs';
 *
 * export function UserWatermark({ userName }: { userName: string }) {
 *   useNextWatermark({ text: [`${userName}`, new Date().toLocaleDateString('zh-CN')] });
 *   return null;
 * }
 */
