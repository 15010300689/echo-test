import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
          imports: ['vue', 'vue-router', 'pinia']
        }),
    ],
    resolve: {
      extensions: ['.js', '.vue', '.json', '.ts'],
      // 别名配置
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
  },
})
