# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/lang/zh-CN/).

## [0.4.0] - Unreleased

### Changed

- 放宽 Node.js 版本要求至 >= 18.12.0，pnpm >= 8.0.0
- 移除 NODE_OPTIONS 内存限制，提升跨平台兼容性
- 移除硬编码的 npm 镜像源配置
- TypeScript target 更新为 ESNext
- TypeScript 版本更新至 ~5.7.0

### Added

- 添加 Vitest 测试框架及示例测试
- 添加 .editorconfig 跨编辑器一致性配置
- 添加全局错误处理器
- 添加路由守卫（NProgress + 页面标题更新）
- 添加 .env.production 环境配置文件
- 添加 CHANGELOG.md

### Fixed

- 修复 Router 未响应 VITE_ROUTER_HISTORY 环境变量的问题
- 修复 Dockerfile 中 build:test 脚本不存在的问题
- 修复 @types/nprogress 错误放置在 dependencies 中的问题
- 修复 ESLint 配置中引用未安装插件导致的警告
- 修复 commitlint.config.ts 使用 CJS 导出语法的问题

### Removed

- 移除 vite-plugin-minipic（依赖 sharp 原生二进制，影响跨平台安装兼容性）
- 移除 browserslist 配置（Vite 通过 esbuild.target 管理转译目标）
- 移除 .npmrc 中硬编码的区域性镜像源
- 移除 .vscode/settings.json 中的个人偏好设置

## [0.3.0] - Initial Release

- 基于 Vite 5 + Vue 3.5 + TypeScript 的项目模板
- ESLint v9 flat config + Prettier + Stylelint 代码规范
- Husky + lint-staged + commitlint 提交规范
- Tailwind CSS v4 + SCSS 样式方案
- Pinia 状态管理 + pinia-plugin-persistedstate 持久化
- Axios 封装（拦截器、错误处理、文件上传下载）
- 加密存储工具（AES 加密 cookie/localStorage/sessionStorage）
- PostCSS pxtorem + rem 自适应方案
- SVG 组件化支持
- Docker 多阶段构建 + Nginx 配置