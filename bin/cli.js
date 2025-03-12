#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const program = new Command();

// 定义可选插件
const PLUGINS = [
  {
    name: 'postcss-pxtorem',
    value: 'pxtorem',
    description: '将 px 单位转换为 rem 单位',
    devDependencies: {
      'postcss-pxtorem': '^6.1.0'
    }
  },
  {
    name: 'tailwindcss（v3.x）',
    value: 'tailwind',
    description: '功能优先的 CSS 框架',
    devDependencies: {
      tailwindcss: '3'
    }
  },
  {
    name: 'vite-svg-loader',
    value: 'svgLoader',
    description: '以组件形式加载 SVG',
    devDependencies: {
      'vite-svg-loader': '^5.1.0'
    }
  }
];

program
  .name('create-vite-vue3-ts')
  .description('基于 Vite + Vue3 + TypeScript 的项目模板')
  .version('0.1.0')
  .argument('[project-name]', '项目名称')
  .action(async (projectName) => {
    try {
      await createProject(projectName);
    } catch (error) {
      console.error(chalk.red('错误：') + error.message);
      process.exit(1);
    }
  });
program.parse(process.argv);

async function createProject(projectName) {
  try {
    // 获取项目名称
    const { name, description, author } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '请输入项目名称：',
        default: projectName || 'vite-vue3-ts-project',
        validate: (input) => {
          if (!input.trim()) {
            return '项目名称不能为空';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'description',
        message: '请输入项目描述：',
        default: '基于 Vite + Vue3 + TypeScript 的项目模板'
      },
      {
        type: 'input',
        name: 'author',
        message: '请输入作者名称：',
        default: 'egg'
      }
    ]);

    const targetDir = path.join(process.cwd(), name);

    // 检查目录是否存在
    if (fs.existsSync(targetDir)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `目标目录 ${chalk.cyan(name)} 已存在。是否要覆盖？`,
          default: true
        }
      ]);

      if (!overwrite) {
        throw new Error('操作取消');
      }

      const spinner = ora('正在清理目录...').start();

      await fs.promises.rm(targetDir, { recursive: true, force: true });
      spinner.succeed(chalk.green('目录清理完成'));
    }

    // 逐个选择插件
    const selectedPlugins = [];
    for (const plugin of PLUGINS) {
      const { install } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'install',
          message: `是否安装 ${plugin.name}（${plugin.description}）？`,
          default: false
        }
      ]);
      if (install) {
        selectedPlugins.push(plugin.value);
      }
    }

    // 创建项目
    const spinner = ora(chalk.bgYellow('正在创建项目...')).start();

    // 复制模板
    const templateDir = path.resolve(__dirname, '../template');
    fs.mkdirSync(targetDir, { recursive: true });
    await copyTemplate(templateDir, targetDir);

    // 更新配置文件
    spinner.text = '正在更新配置文件...';
    await updateProjectFiles(targetDir, selectedPlugins, {
      name,
      description,
      author
    });
    await updatePackageJson(targetDir, selectedPlugins, {
      name,
      description,
      author
    });

    spinner.succeed(chalk.green('项目创建成功！'));

    // 输出使用说明
    console.log('\n使用说明：');
    console.log(chalk.cyan(`  cd ${name}`));
    console.log(chalk.cyan('  pnpm install'));
    console.log(chalk.cyan('  pnpm dev\n'));
  } catch (error) {
    const spinner = ora();
    spinner.fail(chalk.red('项目创建失败：' + error.message));
    throw error;
  }
}

async function updateProjectFiles(root, selectedPlugins, projectInfo) {
  const pkgPath = path.join(root, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  // 更新项目信息
  pkg.name = projectInfo.name;
  pkg.description = projectInfo.description;
  pkg.author = projectInfo.author;

  const mainPath = path.join(root, 'src/main.ts');
  let mainContent = fs.readFileSync(mainPath, 'utf-8');

  const cssConfigPath = path.join(root, 'viteConfig/css/index.ts');
  // 根据选择的插件修改配置
  if (fs.existsSync(cssConfigPath)) {
    let cssConfig = fs.readFileSync(cssConfigPath, 'utf-8');
    // 处理 pxtorem 插件
    if (!selectedPlugins.includes('pxtorem')) {
      const remUnitPath = path.join(root, 'src/lib/remUnit.ts');
      if (fs.existsSync(remUnitPath)) {
        fs.unlinkSync(remUnitPath);
        // 如果 lib 目录为空，也删除该目录
        const libDir = path.dirname(remUnitPath);
        if (fs.readdirSync(libDir).length === 0) {
          fs.rmdirSync(libDir);
        }
      }
      cssConfig = cssConfig.replace(/\/\/ @ts-expect-error.*\n/, '');
      cssConfig = cssConfig.replace(/import pxtorem.*;\n/, '');
      cssConfig = cssConfig.replace(/\s*pxtorem\({[^}]+}\),?\n?/, '');
      mainContent = mainContent.replace(/import '\.\/lib\/remUnit';\n/, '');
    }

    // 处理 tailwindcss 插件
    if (!selectedPlugins.includes('tailwind')) {
      cssConfig = cssConfig.replace(/import tailwindcss.*;\n/, '');
      cssConfig = cssConfig.replace(/\s*tailwindcss\(\),?\n?/, '');
      mainContent = mainContent.replace(/import '\.\/tailwind.css';\n/, '');

      const tailwindPath = path.join(root, 'src/tailwind.css');
      if (fs.existsSync(tailwindPath)) {
        fs.unlinkSync(tailwindPath);
      }

      const tailwindConfigPath = path.join(root, 'tailwind.config.ts');
      if (fs.existsSync(tailwindConfigPath)) {
        fs.unlinkSync(tailwindConfigPath);
      }
    }

    fs.writeFileSync(cssConfigPath, cssConfig);
    fs.writeFileSync(mainPath, mainContent);
  }

  const commonPluginsPath = path.join(root, 'viteConfig/plugins/common.ts');
  if (fs.existsSync(commonPluginsPath)) {
    let commonPlugins = fs.readFileSync(commonPluginsPath, 'utf-8');
    // 处理 tailwindcss 插件
    if (!selectedPlugins.includes('tailwind')) {
      commonPlugins = commonPlugins.replace(
        /import '@tailwindcss\/vite';\n/,
        ''
      );
      commonPlugins = commonPlugins.replace(/\s*tailwindcss\(\),?\n?/, '');
      mainContent = mainContent.replace(/import '\.\/tailwind.css';\n/, '');

      const tailwindPath = path.join(root, 'src/tailwind.css');
      if (fs.existsSync(tailwindPath)) {
        fs.unlinkSync(tailwindPath);
      }

      fs.writeFileSync(commonPluginsPath, commonPlugins);
      fs.writeFileSync(mainPath, mainContent);
    } else {
      // 如果安装了 tailwindcss，删除 autoprefixer 插件（tw4自带）
      if (fs.existsSync(cssConfigPath)) {
        let cssConfig = fs.readFileSync(cssConfigPath, 'utf-8');
        cssConfig = cssConfig.replace(/import autoprefixer.*;\n/, '');
        cssConfig = cssConfig.replace(/\s*autoprefixer\({[^}]+}\),?\n?/, '');
        fs.writeFileSync(cssConfigPath, cssConfig);
      }
    }
  }

  const staticPerfConfigPath = path.join(
    root,
    'viteConfig/plugins/staticPerf.ts'
  );

  if (fs.existsSync(staticPerfConfigPath)) {
    let staticPerfConfig = fs.readFileSync(staticPerfConfigPath, 'utf-8');
    // 处理 svgLoader 插件
    if (!selectedPlugins.includes('svgLoader')) {
      const appVuePath = path.join(root, 'src/App.vue');
      if (fs.existsSync(appVuePath)) {
        let appContent = fs.readFileSync(appVuePath, 'utf-8');
        // 删除 import 语句
        appContent = appContent.replace(/import VueView.*;\n/, '');
        appContent = appContent.replace(/import ViteView.*;\n/, '');
        // 删除<script>标签
        appContent = appContent.replace(/<script>[\s\S]*?<\/script>/, '');
        // 替换 SVG 组件为 img 标签
        appContent = appContent.replace(
          /<ViteView width="40" height="40" class="logo" \/>/,
          '<img src="./assets/icons/vite.svg" width="40" height="40" class="logo" alt="Vite logo" />'
        );
        appContent = appContent.replace(
          /<VueView width="40" height="40" class="logo" \/>/,
          '<img src="./assets/icons/vue.svg" width="40" height="40" class="logo vue" alt="Vue logo" />'
        );
        fs.writeFileSync(appVuePath, appContent);
      }
      staticPerfConfig = staticPerfConfig.replace(
        /import.*vite-svg-loader.*;\n/,
        ''
      );
      staticPerfConfig = staticPerfConfig.replace(
        /\s*svgLoader\([^)]*\),?\n?/,
        ''
      );
    }
    fs.writeFileSync(staticPerfConfigPath, staticPerfConfig);
  }
}

async function updatePackageJson(root, selectedPlugins) {
  const pkgPath = path.join(root, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  // 获取选中插件的依赖
  const devDependencies = {};
  for (const plugin of PLUGINS.filter((p) =>
    selectedPlugins.includes(p.value)
  )) {
    Object.assign(devDependencies, plugin.devDependencies);
  }

  // 更新 package.json
  pkg.devDependencies = {
    ...pkg.devDependencies,
    ...devDependencies
  };

  // 移除未选中插件的依赖
  PLUGINS.forEach((plugin) => {
    if (!selectedPlugins.includes(plugin.value)) {
      Object.keys(plugin.devDependencies).forEach((dep) => {
        delete pkg.dependencies[dep];
        delete pkg.devDependencies[dep];
      });
    }
  });

  // 如果安装了 tailwindcss，删除 autoprefixer 插件（tw4自带）
  selectedPlugins.includes('tailwind') &&
    delete pkg.devDependencies.autoprefixer;

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

function copyTemplate(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copyTemplate(srcFile, destFile);
  }
}
