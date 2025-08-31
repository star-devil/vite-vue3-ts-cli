import Components from 'unplugin-vue-components/vite';

export default function setupAutoImportComponents() {
  return Components({
    dts: false,
    dirs: ['src/**/components'],
    extensions: ['vue', 'tsx', 'jsx'],
    include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
    deep: true // 搜索子目录
  });
}
