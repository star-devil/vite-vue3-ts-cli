# Vite + Vue3 + TypeScript 脚手架

一个开箱即用的现代化前端开发脚手架，基于 Vite + Vue 3 + TypeScript 构建。

## 技术栈

| 类别        | 技术                                               |
| ----------- | -------------------------------------------------- |
| 构建工具    | [Vite 5](https://v5.vite.dev/)                     |
| 前端框架    | [Vue 3.5](https://vuejs.org/)                      |
| 类型系统    | [TypeScript 5.7](https://www.typescriptlang.org/)  |
| 路由        | [Vue Router 4](https://router.vuejs.org/)          |
| 状态管理    | [Pinia 3](https://pinia.vuejs.org/)                |
| CSS 方案    | [Tailwind CSS v4](https://tailwindcss.com/) + SCSS |
| HTTP 客户端 | [Axios](https://axios-http.com/)                   |
| 代码规范    | ESLint 9 + Prettier + Stylelint                    |
| 提交规范    | Husky + lint-staged + Commitlint                   |
| 测试        | [Vitest](https://vitest.dev/) + Vue Test Utils     |
| 包管理器    | [pnpm](https://pnpm.io/)                           |

## 快速开始

### 环境要求

- **Node.js** >= 18.12.0
- **pnpm** >= 8.0.0

### 安装与启动

```bash
# 克隆项目
git clone https://github.com/star-devil/vite-vue3-ts-cli.git

# 进入目录
cd vite-vue3-ts-cli

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 可用脚本

| 命令                 | 说明                               |
| -------------------- | ---------------------------------- |
| `pnpm dev`           | 启动开发服务器                     |
| `pnpm build`         | 开发模式构建                       |
| `pnpm build:prod`    | 生产模式构建（含代码压缩）         |
| `pnpm preview`       | 预览构建产物                       |
| `pnpm typecheck`     | TypeScript 类型检查                |
| `pnpm lint`          | 运行 ESLint + Prettier + Stylelint |
| `pnpm test`          | 启动 Vitest 测试（watch 模式）     |
| `pnpm test:run`      | 运行所有测试（单次）               |
| `pnpm test:coverage` | 运行测试并生成覆盖率报告           |
| `pnpm clean:cache`   | 清理缓存并重装依赖                 |
| `pnpm svgo`          | SVG 优化                           |

## 目录结构

```
├── .editorconfig           # 跨编辑器一致性配置
├── .env.development        # 开发环境变量
├── .env.production         # 生产环境变量
├── .husky/                 # Git hooks
├── .vscode/                # VS Code 配置
├── nginx/                  # Nginx 配置
├── public/                 # 静态资源
├── src/
│   ├── assets/             # 资源文件
│   ├── components/         # 公共组件
│   ├── router/             # 路由配置（模块化）
│   ├── stores/             # Pinia 状态管理
│   ├── styles/             # 全局样式
│   ├── utils/              # 工具函数
│   │   ├── https/          # Axios 封装
│   │   ├── crypt.ts        # AES 加密
│   │   ├── encryptCookie.ts # Cookie 加密
│   │   ├── encryptLocal.ts  # localStorage/sessionStorage 加密
│   │   ├── errorHandler.ts  # 全局错误处理
│   │   ├── progress.ts     # NProgress 配置
│   │   ├── remUnit.ts      # rem 自适应
│   │   └── tools.ts        # 通用工具
│   └── __tests__/          # 测试文件
├── types/                  # 全局类型定义
├── viteConfig/             # Vite 配置模块
│   ├── plugins/            # 插件配置
│   ├── build/              # 构建配置
│   ├── css/                # CSS/PostCSS 配置
│   ├── server/             # 开发服务器配置
│   └── optimizeDeps/       # 依赖预构建
├── Dockerfile              # Docker 部署配置
├── commitlint.config.ts    # 提交信息规范
├── eslint.config.js        # ESLint 配置
├── vitest.config.ts        # Vitest 测试配置
└── tsconfig.json           # TypeScript 配置
```

## 环境变量

| 变量                  | 说明                                   | 默认值   |
| --------------------- | -------------------------------------- | -------- |
| `VITE_PORT`           | 开发服务器端口                         | `5173`   |
| `VITE_PUBLIC_PATH`    | 部署路径                               | `/`      |
| `VITE_ROUTER_HISTORY` | 路由模式 (`hash` / `html5`)            | `hash`   |
| `VITE_COMPRESSION`    | 构建压缩 (`none` / `gzip` / `deflate`) | `gzip`   |
| `VITE_PROXY`          | API 代理前缀                           | `/proxy` |
| `VITE_SERVER_URL`     | 代理目标地址                           | —        |

## 主要特性

- **自动导入**: Vue / Vue Router / Pinia API 无需手动 import
- **组件自动注册**: `src/components/` 下的组件自动注册
- **SVG 组件化**: 以 Vue 组件形式导入 SVG
- **HTTP 封装**: 支持请求拦截、错误处理、文件上传/下载
- **加密存储**: 支持 AES 加密的 localStorage / sessionStorage / Cookie
- **rem 自适应**: 基于视口宽度的动态 rem 缩放
- **代码质量**: ESLint flat config + Prettier + Stylelint 三重保障
- **Git 提交规范**: Conventional Commits + 交互式提交提示
- **Docker 部署**: 多阶段构建 + Nginx 静态服务

## 提交规范

项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范，支持的提交类型：

- `feat` — 新增功能
- `fix` — 修复缺陷
- `docs` — 文档更新
- `style` — 代码格式
- `refactor` — 代码重构
- `perf` — 性能优化
- `test` — 测试相关
- `build` — 构建/依赖变更
- `ci` — CI 配置
- `chore` — 其他杂项

## License

[MIT](LICENSE)