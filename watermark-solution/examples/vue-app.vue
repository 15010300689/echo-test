<template>
  <div ref="appRef" class="app">
    <h1>Vue 水印示例</h1>
    <p>系统深浅色切换时水印自动重绘。</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWatermark } from '../adapters/vue';

const appRef = ref<HTMLElement | null>(null);

// 全屏水印
useWatermark({
  text: ['内部资料', '张三 · 2026-05-27'],
});

// 若需局部水印，改用：
// useWatermark({ text: '局部', containerRef: appRef });
</script>

<style scoped>
.app {
  padding: 24px;
}
</style>
