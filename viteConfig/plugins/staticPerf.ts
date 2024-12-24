/*
 * @Author: wangqiaoling
 * @Date: 2024-12-24 10:24:08
 * @LastEditTime: 2024-12-24 10:26:41
 * @LastEditors: wangqiaoling
 * @Description: 静态资源优化
 */
import viteImagemin from 'vite-plugin-imagemin';
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap';

export default function setupStaticPerf() {
  return [
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
  ];
}
