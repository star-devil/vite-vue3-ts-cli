/*
 * @Author: wangqiaoling
 * @Date: 2024-12-24 10:06:41
 * @LastEditTime: 2024-12-24 10:10:08
 * @LastEditors: wangqiaoling
 * @Description: 配置模块解析规则(别名)
 */
import path from 'path';
import { AliasOptions, ResolveOptions } from 'vite';

type Resolve = ResolveOptions & {
  alias?: AliasOptions;
};

export default function (): Resolve {
  // 别名配置相对于当前文件路径
  const alias: AliasOptions = {
    '@': path.resolve(__dirname, 'src'),
    '@assets': path.resolve(__dirname, 'src/assets')
  };
  return { alias };
}
