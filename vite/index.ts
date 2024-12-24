/*
 * @Author: wangqiaoling
 * @Date: 2024-12-24 10:44:27
 * @LastEditTime: 2024-12-24 10:48:08
 * @LastEditors: wangqiaoling
 * @Description:
 */
import loadPlugins from './plugins';
import loadViteResolve from './resolve';
import loadViteServer from './server';
import loadViteBuild from './build';
import loadViteCss from './css';

const loadInitLog = () => {
  const colors = {
    reset: '\x1b[0m',
    fg: '\x1b[35m',
    bg: '\x1b[43m'
  };
  const LINK =
    'https://github.com/star-devil/learning-Docs/blob/master/%E4%BB%8E%E5%A4%B4%E6%90%AD%E5%BB%BA%E4%B8%80%E4%B8%AAvite%E9%A1%B9%E7%9B%AE.md';
  console.log(
    `${colors.fg} 😊说明文档在这里==>:🔗${colors.bg}${LINK}${colors.reset}，有问题欢迎指正。`
  );
};
export default {
  loadPlugins,
  loadViteResolve,
  loadViteServer,
  loadViteBuild,
  loadViteCss,
  loadInitLog
};
