import type { Plugin } from 'vite';
import { getPackageSize } from '../utils';
import dayjs, { type Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const colors = {
  reset: '\x1b[0m',
  fg: '\x1b[35m',
  bg: '\x1b[43m',
  magenta: '\x1b[35m'
};
const LINK =
  'https://github.com/star-devil/learning-Docs/blob/master/%E4%BB%8E%E5%A4%B4%E6%90%AD%E5%BB%BA%E4%B8%80%E4%B8%AAvite%E9%A1%B9%E7%9B%AE.md';

export default function setupViteBuildInfo(): Plugin {
  let config: { command: string };
  let startTime: Dayjs;
  let endTime: Dayjs;
  let outDir: string;
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
          callback: (size: string | number) => {
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
