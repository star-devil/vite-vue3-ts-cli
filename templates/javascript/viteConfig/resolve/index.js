import path from 'path';

export default function () {
  // 获取项目根目录路径
  const projectRoot = process.cwd();

  // 别名配置相对于当前文件路径
  const alias = {
    '@': path.resolve(projectRoot, 'src'),
    '@assets': path.resolve(projectRoot, 'src/assets')
  };
  return { alias };
}
