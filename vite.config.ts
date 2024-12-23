import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint2';
// 自动导入
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
// css（样式）相关
import autoprefixer from 'autoprefixer';
// @ts-expect-error postcss-pxtorem还没有官方的ts包
import pxtorem from 'postcss-pxtorem';
import tailwindcss from 'tailwindcss';
// 静态资源优化
import viteImagemin from 'vite-plugin-imagemin';
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap';

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
    }),
    viteImagemin({
      verbose: false,
      optipng: {
        // 优化级别：
        optimizationLevel: 7
      },
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      mozjpeg: {
        quality: 20
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    }),
    VitePluginSvgSpritemap('./src/assets/icons/*.svg', {
      prefix: 'sprites_icon-',
      output: {
        view: true,
        use: true
      }
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
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets')
    }
  }
});
