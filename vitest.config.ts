import { defineConfig, mergeConfig } from 'vitest/config';
import userConfig from './vite.config';

export default mergeConfig(
  userConfig({ mode: 'test' } as any),
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{ts,tsx,vue}'],
      setupFiles: ['./src/__tests__/setup.ts']
    }
  })
);
