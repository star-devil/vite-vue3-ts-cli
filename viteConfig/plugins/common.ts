/*
 * @Description: 公共插件,包括按需导入等
 */
import vue from '@vitejs/plugin-vue';
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
  ];
}
