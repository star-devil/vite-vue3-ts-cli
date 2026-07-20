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

// 根据语言获取文件扩展名
const getExt = (language) => (language === 'typescript' ? '.ts' : '.js');

// 定义可选插件
const PLUGINS = [
  {
    name: 'postcss-pxtorem',
    value: 'pxtorem',
    description: '将 px 单位转换为 rem 单位',
    devDependencies: { 'postcss-pxtorem': '^6.1.0' }
  },
  {
    name: 'tailwindcss（v4.x）',
    value: 'tailwind',
    description: '功能优先的 CSS 框架',
    devDependencies: { 'tailwindcss': '^4.1.11' }
  },
  {
    name: 'vite-svg-loader',
    value: 'svgLoader',
    description: '以组件形式加载 SVG',
    devDependencies: { 'vite-svg-loader': '^5.1.0' }
  }
];

// 语言选项
const LANGUAGES = {
  typescript: {
    name: 'TypeScript',
    value: 'typescript',
    description: '使用 TypeScript 语法（类型安全的 JavaScript 超集）',
    templateDir: 'templates/typescript'
  },
  javascript: {
    name: 'JavaScript',
    value: 'javascript',
    description: '使用 JavaScript 语法（更简洁，无类型检查）',
    templateDir: 'templates/javascript'
  }
};

program
  .name('create-vite-vue3-ts')
  .description('基于 Vite + Vue3 + TypeScript/JavaScript 的项目模板')
  .version('0.4.0')
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
  // 1. 获取项目信息
  const { name, description, author } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '请输入项目名称：',
      default: projectName || 'vite-vue3-project',
      validate: (input) => (input.trim() ? true : '项目名称不能为空')
    },
    {
      type: 'input',
      name: 'description',
      message: '请输入项目描述：',
      default: '基于 Vite + Vue3 的项目模板'
    },
    {
      type: 'input',
      name: 'author',
      message: '请输入作者名称：',
      default: 'egg'
    }
  ]);

  // 2. 选择语言
  const { language } = await inquirer.prompt([
    {
      type: 'list',
      name: 'language',
      message: '请选择开发语言：',
      choices: Object.values(LANGUAGES).map((lang) => ({
        name: `${lang.name} (${lang.description})`,
        value: lang.value
      })),
      default: 'typescript'
    }
  ]);

  const targetDir = path.join(process.cwd(), name);

  // 3. 检查目标目录
  if (fs.existsSync(targetDir)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `目标目录 ${chalk.cyan(name)} 已存在。是否要覆盖？`,
        default: true
      }
    ]);
    if (!overwrite) throw new Error('操作取消');

    const spinner = ora('正在清理目录...').start();
    await fs.promises.rm(targetDir, { recursive: true, force: true });
    spinner.succeed(chalk.green('目录清理完成'));
  }

  // 4. 逐个选择插件
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
    if (install) selectedPlugins.push(plugin.value);
  }

  // 5. 创建项目
  const spinner = ora(chalk.yellow('正在创建项目...')).start();

  try {
    const templateDir = path.resolve(
      __dirname,
      '..',
      LANGUAGES[language].templateDir
    );

    // 复制模板
    await fs.promises.mkdir(targetDir, { recursive: true });
    await copyTemplate(templateDir, targetDir);

    // 更新配置文件
    spinner.text = '正在更新配置文件...';
    await updateProjectFiles(targetDir, selectedPlugins, language);
    await updatePackageJson(targetDir, selectedPlugins, {
      name,
      description,
      author
    });

    spinner.succeed(chalk.green('项目创建成功！'));

    console.log('\n使用说明：');
    console.log(chalk.cyan(`  cd ${name}`));
    console.log(chalk.cyan('  pnpm install'));
    console.log(chalk.cyan('  pnpm dev\n'));
  } catch (error) {
    spinner.fail(chalk.red('项目创建失败：' + error.message));
    throw error;
  }
}

// ---- 模板文件处理 ----

async function updateProjectFiles(root, selectedPlugins, language) {
  const ext = getExt(language);
  const mainPath = path.join(root, `src/main${ext}`);
  const cssConfigPath = path.join(root, `viteConfig/css/index${ext}`);
  const pluginsIndexPath = path.join(root, `viteConfig/plugins/index${ext}`);
  const tailwindPluginPath = path.join(
    root,
    `viteConfig/plugins/tailwindcss${ext}`
  );
  const staticPerfPath = path.join(root, `viteConfig/plugins/staticPerf${ext}`);

  // 读取需要修改的文件
  let mainContent = await readFile(mainPath);
  let cssConfig = await readFile(cssConfigPath);
  const pluginsIndex = await readFile(pluginsIndexPath);
  let pluginsIndexContent = pluginsIndex;
  let staticPerfConfig = await readFile(staticPerfPath);

  // ---- 处理 postcss-pxtorem 插件 ----
  if (!selectedPlugins.includes('pxtorem')) {
    // 删除 remUnit 文件
    const remUnitPath = path.join(root, `src/utils/remUnit${ext}`);
    await removeFile(remUnitPath);
    await removeEmptyDir(path.dirname(remUnitPath));

    // TS 模板中移除 @ts-expect-error 注释
    if (language === 'typescript') {
      cssConfig = cssConfig.replace(/\/\/ @ts-expect-error postcss-pxtorem.*\n/g, '');
    }
    // 移除 pxtorem import 和配置
    cssConfig = cssConfig.replace(/import pxtorem[^;]*;\n/, '');
    cssConfig = cssConfig.replace(/\s*pxtorem\([^)]+\)\s*,?\s*\n?/, '');
    // 移除 main 中的 remUnit import
    mainContent = mainContent.replace(
      /import '\.\/utils\/remUnit';\n/,
      ''
    );
  }

  // ---- 处理 tailwindcss 插件 ----
  if (!selectedPlugins.includes('tailwind')) {
    // 删除相关文件
    const tailwindCssPath = path.join(root, 'src/styles/tailwind.css');
    await removeFile(tailwindCssPath);
    await removeFile(tailwindPluginPath);

    // 移除 tailwind.css import
    mainContent = mainContent.replace(
      /import '\.\/styles\/tailwind\.css';\n/,
      ''
    );
    // 移除 plugins/index 中的 tailwindcss 导入和调用
    pluginsIndexContent = pluginsIndexContent
      .replace(/import setupTailwindcss from '\.\/tailwindcss';\n/, '')
      .replace(/,?\s*setupTailwindcss\(\)/, '');
  }

  // ---- 处理 vite-svg-loader 插件 ----
  if (!selectedPlugins.includes('svgLoader')) {
    // 替换 App.vue 中 SVG 组件引用为 img 标签
    const appVuePath = path.join(root, 'src/App.vue');
    if (fs.existsSync(appVuePath)) {
      let appContent = await readFile(appVuePath);
      appContent = appContent
        .replace(
          /import VueView from '@assets\/icons\/vue\.svg';\n/,
          ''
        )
        .replace(
          /import ViteView from '@assets\/icons\/vite\.svg';\n/,
          ''
        )
        .replace(
          /<ViteView width="40" height="40" class="logo" \/>/,
          '<img src="./assets/icons/vite.svg" width="40" height="40" class="logo" alt="Vite logo" />'
        )
        .replace(
          /<VueView width="40" height="40" class="logo" \/>/,
          '<img src="./assets/icons/vue.svg" width="40" height="40" class="logo vue" alt="Vue logo" />'
        );
      await writeFile(appVuePath, appContent);
    }

    // 移除 staticPerf 中的 svgLoader import 和调用
    staticPerfConfig = staticPerfConfig
      .replace(/import.*vite-svg-loader.*;\n/, '')
      .replace(/\s*svgLoader\([^)]*\),?\n?/, '');
  }

  // ---- 统一写入修改后的文件 ----
  await writeFile(mainPath, mainContent);
  await writeFile(cssConfigPath, cssConfig);
  await writeFile(pluginsIndexPath, pluginsIndexContent);
  await writeFile(staticPerfPath, staticPerfConfig);
}

// ---- package.json 更新 ----

async function updatePackageJson(root, selectedPlugins, projectInfo) {
  const pkgPath = path.join(root, 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath));

  // 写入用户提供的项目信息
  Object.assign(pkg, {
    name: projectInfo.name,
    description: projectInfo.description,
    author: projectInfo.author
  });

  // 合并选中插件的依赖
  for (const plugin of PLUGINS.filter((p) =>
    selectedPlugins.includes(p.value)
  )) {
    Object.assign(pkg.devDependencies, plugin.devDependencies);
  }

  // 移除未选中插件的依赖
  for (const plugin of PLUGINS) {
    if (!selectedPlugins.includes(plugin.value)) {
      for (const dep of Object.keys(plugin.devDependencies)) {
        delete pkg.dependencies[dep];
        delete pkg.devDependencies[dep];
      }
    }
  }

  await writeFile(pkgPath, JSON.stringify(pkg, null, 2));
}

// ---- 文件操作工具 ----

async function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`找不到文件: ${filePath}`);
  }
  return fs.promises.readFile(filePath, 'utf-8');
}

async function writeFile(filePath, content) {
  await fs.promises.writeFile(filePath, content, 'utf-8');
}

async function removeFile(filePath) {
  try {
    await fs.promises.unlink(filePath);
  } catch {
    // 文件不存在则忽略
  }
}

async function removeEmptyDir(dirPath) {
  try {
    const files = await fs.promises.readdir(dirPath);
    if (files.length === 0) {
      await fs.promises.rmdir(dirPath);
    }
  } catch {
    // 目录不存在则忽略
  }
}

async function copyTemplate(src, dest) {
  const stat = await fs.promises.stat(src);
  if (stat.isDirectory()) {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src);
    await Promise.all(
      entries.map((file) =>
        copyTemplate(path.resolve(src, file), path.resolve(dest, file))
      )
    );
  } else {
    await fs.promises.copyFile(src, dest);
  }
}
