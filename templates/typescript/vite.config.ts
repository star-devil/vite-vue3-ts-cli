import { type ConfigEnv, loadEnv, type UserConfigExport } from 'vite';
import viteConfig from './viteConfig';
import { alias, root, wrapperEnv, __APP_INFO__ } from './viteConfig/utils';

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const env = loadEnv(mode, root);
  const {
    VITE_PORT,
    VITE_COMPRESSION,
    VITE_PUBLIC_PATH,
    VITE_PROXY,
    VITE_SERVER_URL
  } = wrapperEnv(env);

  const {
    loadPlugins,
    loadViteCss,
    loadViteServer,
    loadViteBuild,
    loadOptimizeDeps
  } = viteConfig;

  return {
    base: VITE_PUBLIC_PATH,
    root,
    // 插件配置
    plugins: loadPlugins(VITE_COMPRESSION),
    // 解析配置
    resolve: {
      alias
    },
    // css 配置
    css: loadViteCss(),
    // 开发服务器配置
    server: loadViteServer(VITE_PORT, VITE_PROXY, VITE_SERVER_URL),
    // 移除所有console+debugger,使用默认的esbuild,比 terser 快 20-40倍,压缩率只差 1%-2%。
    esbuild: {
      drop: mode !== 'development' ? ['console', 'debugger'] : []
    },
    // 依赖预构建配置
    optimizeDeps: loadOptimizeDeps,
    // 构建配置
    build: loadViteBuild(),
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
};
