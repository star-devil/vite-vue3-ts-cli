import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import eslint from 'vite-plugin-eslint2';

export default function setupCommonPlugins() {
  return [
    vue(),
    eslint({ lintOnStart: true, cache: false, fix: true }),
    Components({
      dirs: ['src/**/components'],
      extensions: ['vue', 'jsx'],
      include: [/\.vue$/, /\.vue\?vue/, /\.jsx$/],
      deep: true // 搜索子目录
    })
  ];
}
