import Components from 'unplugin-vue-components/vite';

export default function setupAutoImportComponents() {
  return Components({
    // 配置type文件生成位置
    dts: 'types/components.d.ts',
    dirs: ['src/**/components'],
    extensions: ['vue', 'tsx', 'jsx'],
    include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
    deep: true // 搜索子目录
  });
}
