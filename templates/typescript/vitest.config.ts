import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfigFn from './vite.config';

// 调用工厂函数拿到实际的 Vite 配置对象
const baseConfig = viteConfigFn({ mode: 'test', command: 'serve' } as any);

export default defineConfig(
  mergeConfig(baseConfig as any, {
    test: {
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{ts,tsx,vue}'],
      setupFiles: ['./src/_test_/setup.ts']
    }
  })
);
