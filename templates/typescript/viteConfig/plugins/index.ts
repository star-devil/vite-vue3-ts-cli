import type { PluginOption } from 'vite';
import setupAutoImport from './autoImport';
import setupCommonPlugins from './common';
import setupStaticPerf from './staticPerf';
import setupAutoImportComponents from './autoComponents';
import setupConfigCompressPlugin from './compress';
import setupViteBuildInfo from './buildInfo';

export default function (VITE_COMPRESSION: ViteCompression) {
  const plugins: PluginOption[] = [
    ...setupCommonPlugins(),
    setupAutoImport(),
    setupAutoImportComponents(),
    ...setupStaticPerf(),
    ...setupConfigCompressPlugin(VITE_COMPRESSION),
    setupViteBuildInfo()
  ];

  return plugins;
}
