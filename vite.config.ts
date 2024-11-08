/** @format */

import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';

// 在启动项目和打包代码时进行代码检查, 如果检查有error类型的问题就启动或打包失败, warn类型的问题不影响启动和打包
import eslint from 'vite-plugin-eslint2';
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), eslint({ lintOnStart: true, cache: true, fix: true })],
  resolve: {
    alias: {
      '@': path.resolve('./src') // @代替src
    }
  }
});
