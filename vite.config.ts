/*
 * @Author: wangqiaoling
 * @Date: 2024-11-28 10:24:01
 * @LastEditTime: 2024-12-19 17:15:29
 * @LastEditors: wangqiaoling
 * @Description:
 */
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import eslint from 'vite-plugin-eslint2';
import Components from 'unplugin-vue-components/vite';
import autoprefixer from 'autoprefixer';
// @ts-expect-error postcss-pxtorem还没有官方的ts包
import pxtorem from 'postcss-pxtorem';
import tailwindcss from 'tailwindcss';

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
        additionalData: '$color: red;'
      }
    },
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: [
            'Android 4.1',
            'iOS 7.1',
            'Chrome > 31',
            'ff > 31',
            'ie >= 8',
            'last 2 versions'
          ],
          grid: true
        }),
        pxtorem({
          rootValue: 14, // 1rem = 14px
          propList: ['*', '!border'], // 需要转换的属性，除 border 外所有px 转 rem
          exclude: '/node_modules/*', // 排除node_modules
          mediaQuery: false, // 是否要在媒体查询中转换px
          minPixelValue: 2 // 设置要转换的最小像素值
        }),
        tailwindcss()
      ]
    }
  },

  resolve: {
    alias: {
      '@': path.resolve('./src') // @代替src
    }
  }
});
