import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import eslint from 'vite-plugin-eslint2';
import Components from 'unplugin-vue-components/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslint({ lintOnStart: true, cache: false, fix: true }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: './auto-import.d.ts',
      eslintrc: {
        // 已存在文件设置默认 false，需要更新时再打开，防止每次更新都重新生成
        enabled: false,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true
      }
    }),
    Components({
      dirs: ['src/**/components'],
      extensions: ['vue'],
      dts: 'src/components.d.ts',
      deep: true // 搜索子目录
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: "$color: red'"
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve('./src') // @代替src
    }
  }
});
