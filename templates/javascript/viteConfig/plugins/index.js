import setupAutoImport from './autoImport';
import setupCommonPlugins from './common';
import setupStaticPerf from './staticPerf';

export default function () {
  const plugins = [
    ...setupCommonPlugins(),
    setupAutoImport(),
    setupAutoImportComponents(),
    ...setupStaticPerf()
  ];

  return plugins;
}
