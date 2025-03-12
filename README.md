# create-vvt(vite-vue3-ts)

一个基于 Vite + Vue3 + TypeScript 的项目模板脚手架，集成了多个实用的功能和最佳实践。

## 特性

- 🚀 基于 Vite 构建，开发体验极致
- 💪 Vue 3 + TypeScript，类型安全
- 📦 开箱即用的组件自动导入
- 🎨 可选的工具集成：
  - PostCSS px 转 rem
  - TailwindCSS 支持
  - 🎯 SVG 组件化支持
- 🔍 ESLint + Prettier + Stylelint 代码规范
- 📝 Git Commit 信息规范化
- 💾 基于 Pinia 的状态管理，支持持久化
- 🛠 完善的构建优化配置

## 快速开始

```bash
# 使用 npm
npm create vvt@latest [项目名称]

# 使用 yarn
yarn create vvt [项目名称]

# 使用 pnpm（推荐使用）
pnpm create vvt [项目名称]
```

### 按照提示完成项目配置

1. 输入项目名称（默认：vite-vue3-ts-project）
2. 输入项目描述
3. 输入作者名称
4. 选择需要的插件功能

#### 可选插件

- postcss-pxtorem
将 px 单位自动转换为 rem 单位，适配移动端开发。

- tailwindcss
功能强大的 CSS 框架，提供丰富的原子化 CSS 类。

- vite-svg-loader
将 SVG 文件作为 Vue 组件导入使用。

## 项目结构

```plaintext
├── .husky/            # Git Hooks
├── .vscode/           # VS Code 配置
├── lib/               # 工具库
├── public/            # 公共资源
├── src/
│   ├── assets/         # 静态资源
│   ├── components/     # 公共组件
│   ├── router/         # 路由配置
│   ├── scss/           # SCSS 样式
│   ├── stores/         # Pinia 状态管理
│   ├── App.vue         # 根组件
│   ├── main.ts         # 入口文件
│   ├── tailwind.css?   # TailwindCSS 配置(安装了tailwindcss时才会有)
│   └── vite-env.d.ts   # Vite 类型声明
├── types/             # 类型声明文件(主要是自动导入的声明)
├── viteConfig/        # Vite 配置模块
├── .env.*             # 环境变量配置
├── .eslintrc-auto-import.json   # ESLint 自动导入配置
├── .gitignore         # Git 忽略文件
├── .prettierignore    # Prettier 忽略文件
├── .prettierrc        # Prettier 配置
├── .stylelintrc.json  # Stylelint 配置
├── commitlint.config.ts    # Git Commit 信息规范化配置
├── eslint.config.js   # ESLint 配置
├── index.html         # 入口 HTML 文件
├── package.json       # 项目依赖和脚本
├── tailwind.config.ts # TailwindCSS 配置(安装了tailwindcss时才会有)
├── tsconfig.app.json  # TypeScript 配置
├── tsconfig.json      # TypeScript 配置
├── tsconfig.node.json # TypeScript 配置
└── vite.config.ts     # Vite 配置文件
 ```

## 提交规范

项目集成了 commitlint，提交信息需要符合规范：

- feat: 新功能
- fix: 修复问题
- docs: 文档变更
- style: 代码格式修改
- refactor: 代码重构
- perf: 性能优化
- test: 测试相关
- build: 构建相关
- ci: CI 配置相关
- chore: 其他修改
- revert: 回退代码
