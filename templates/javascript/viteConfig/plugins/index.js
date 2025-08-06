import setupAutoImport from './autoImport';
import setupCommonPlugins from './common';
import setupStaticPerf from './staticPerf';
import setupAutoImportComponents from './autoComponents';
import setupConfigCompressPlugin from './compress';
import setupViteBuildInfo from './buildInfo';
import setupTailwindcss from './tailwindcss';

export default function (VITE_COMPRESSION) {
  const plugins = [
    ...setupCommonPlugins(),
    setupAutoImport(),
    setupAutoImportComponents(),
    ...setupStaticPerf(),
    ...setupConfigCompressPlugin(VITE_COMPRESSION),
    setupViteBuildInfo(),
    setupTailwindcss()
  ];

  return plugins;
}
