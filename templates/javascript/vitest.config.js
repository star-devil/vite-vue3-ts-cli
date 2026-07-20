import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfigFn from './vite.config';

// 调用工厂函数拿到实际的 Vite 配置对象
const baseConfig = viteConfigFn({ mode: 'test', command: 'serve' });

export default defineConfig(
  mergeConfig(baseConfig, {
    test: {
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,jsx,vue}'],
      setupFiles: ['./src/_test_/setup.js']
    }
  })
);
