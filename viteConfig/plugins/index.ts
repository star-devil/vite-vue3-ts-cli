/*
 * @Author: wangqiaoling
 * @Date: 2024-12-24 10:41:23
 * @LastEditTime: 2024-12-24 10:43:44
 * @LastEditors: wangqiaoling
 * @Description: 插件配置
 */
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
