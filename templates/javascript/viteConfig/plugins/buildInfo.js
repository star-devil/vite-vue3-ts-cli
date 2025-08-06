import { getPackageSize } from '../utils';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const colors = {
  reset: '\x1b[0m',
  fg: '\x1b[35m',
  bg: '\x1b[43m',
  magenta: '\x1b[35m'
};
const LINK =
  'https://github.com/star-devil/learning-Docs/blob/master/%E7%BB%84%E4%BB%B6%E5%BC%80%E5%8F%91%E4%BD%BF%E7%94%A8/%E6%90%AD%E5%BB%BA%E4%B8%80%E4%B8%AAvue%E8%84%9A%E6%89%8B%E6%9E%B6.md';

export default function setupViteBuildInfo() {
  let config;
  let startTime;
  let endTime;
  let outDir;
  return {
    name: 'vite:buildInfo',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      outDir = resolvedConfig.build?.outDir ?? 'dist';
    },
    buildStart() {
      console.log(
        `${colors.fg} 😊说明文档在这里==>:🔗${colors.bg}${decodeURIComponent(LINK)}${colors.reset}，有问题欢迎指正。`
      );
      if (config.command === 'build') {
        startTime = dayjs(new Date());
      }
    },
    closeBundle() {
      if (config.command === 'build') {
        endTime = dayjs(new Date());
        getPackageSize({
          folder: outDir,
          callback: (size) => {
            const buildDuration = dayjs
              .duration(endTime.diff(startTime))
              .format('mm分ss秒');
            const message = `🎉 恭喜打包完成（总用时${buildDuration}，打包后的大小为${size}）`;

            // 可以使用 boxen 和 gradient替换，输出样式更好看，该框架没有安装
            console.log(`${colors.magenta}${message}${colors.reset}`);
          }
        });
      }
    }
  };
}
