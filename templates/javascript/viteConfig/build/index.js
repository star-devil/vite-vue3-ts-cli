import { pathResolve } from '../utils';

export default function () {
  const build = {
    target: ['esnext'],
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      input: {
        index: pathResolve('../../index.html', import.meta.url)
      },
      // 配置打包文件分类输出
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        // ⚠️ 注意：如果一些资源在打包后无法找到文件（浏览器无法正确处理），那么需要在这里取消 hash 命名，使文件保持原名
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        // 将 node_modules 中的依赖打包到单独的 chunk 中
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  };
  return build;
}
