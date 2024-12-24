/*
 * @Author: wangqiaoling
 * @Date: 2024-12-24 10:17:41
 * @LastEditTime: 2024-12-24 10:26:06
 * @LastEditors: wangqiaoling
 * @Description: 公共插件,包括按需导入等
 */
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import eslint from 'vite-plugin-eslint2';
// import vueJsx from '@vitejs/plugin-vue-jsx';
// import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
// import VueDevTools from 'vite-plugin-vue-devtools';
export default function setupCommonPlugins() {
  return [
    vue(),
    eslint({ lintOnStart: true, cache: false, fix: true }),
    // vueJsx(),
    // VueDevTools(), // 按需导入组件库
    Components({
      // 配置type文件生成位置
      dts: 'types/components.d.ts',
      dirs: ['src/**/components'],
      extensions: ['vue', 'tsx', 'jsx'],
      include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
      deep: true // 搜索子目录
      // resolvers: [
      //   AntDesignVueResolver({
      //     importStyle: false // css in js
      //   })
      // ]
    })
  ];
}
