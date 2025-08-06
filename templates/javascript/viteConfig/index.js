import loadPlugins from './plugins';
import loadViteServer from './server';
import loadViteBuild from './build';
import loadViteCss from './css';
import loadOptimizeDeps from './optimizeDeps';

export default {
  loadPlugins, // 插件
  loadViteServer, // 服务器
  loadViteBuild, // 构建
  loadViteCss, // css
  loadOptimizeDeps // 依赖预构建
};
