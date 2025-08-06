import fs from 'fs';
import { execSync } from 'child_process';

// 检查环境变量
if (!process.env.GITHUB_TOKEN) {
  console.error('错误: GITHUB_TOKEN 环境变量未设置');
  console.error('请使用以下命令设置: export GITHUB_TOKEN=your_token');
  process.exit(1);
}

try {
  // 读取原始 package.json
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

  // 备份原始 package.json
  fs.writeFileSync('./package.json.backup', JSON.stringify(pkg, null, 2));

  // 修改为 GitHub Packages 所需的格式
  pkg.name = '@star-devil/create-vvt';
  pkg.publishConfig = {
    registry: 'https://npm.pkg.github.com',
    access: 'public'
  };

  // 写入修改后的 package.json
  fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));

  console.log('Modified package.json for GitHub Packages');

  // 执行发布
  execSync('npm publish', { stdio: 'inherit' });
  console.log('Published to GitHub Packages successfully!');
} catch (error) {
  console.error('Error:', error);
} finally {
  // 恢复原始 package.json
  if (fs.existsSync('./package.json.backup')) {
    fs.copyFileSync('./package.json.backup', './package.json');
    fs.unlinkSync('./package.json.backup');
    console.log('Restored original package.json');
  }
}
