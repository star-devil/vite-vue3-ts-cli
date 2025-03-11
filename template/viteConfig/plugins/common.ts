import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import eslint from 'vite-plugin-eslint2';
import tailwindcss from '@tailwindcss/vite';

export default function setupCommonPlugins() {
  return [
    vue(),
    eslint({ lintOnStart: true, cache: false, fix: true }),
    Components({
      // 配置type文件生成位置
      dts: 'types/components.d.ts',
      dirs: ['src/**/components'],
      extensions: ['vue', 'tsx', 'jsx'],
      include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
      deep: true // 搜索子目录
    }),
    tailwindcss()
  ];
}
