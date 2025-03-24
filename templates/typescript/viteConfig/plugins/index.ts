import type { PluginOption } from 'vite';
import setupAutoImport from './autoImport';
import setupCommonPlugins from './common';
import setupStaticPerf from './staticPerf';

export default function () {
  const plugins: PluginOption[] = [
    ...setupCommonPlugins(),
    setupAutoImport(),
    setupStaticPerf()
  ];

  return plugins;
}
