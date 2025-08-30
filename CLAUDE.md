# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing two packages:
- **packages/cli**: CLI工具包，提供`ccd`命令行工具用于项目初始化
- **packages/server**: Nuxt 4 web应用，基于Vitesse模板构建

## Architecture

### CLI Package (`packages/cli/`)
- 基于`cac`构建的命令行工具
- 主要功能：项目初始化(`init`命令)和版本查看(`version`命令)
- 构建工具：`unbuild`
- 测试框架：`vitest`
- 入口文件：`src/index.ts`
- 输出可执行文件：`dist/index.mjs`

### Server Package (`packages/server/`)
- Nuxt 4应用，使用Vue 3 + TypeScript
- 核心模块：
  - `@vueuse/nuxt`: Vue组合式API工具集
  - `@unocss/nuxt`: 原子化CSS框架
  - `@pinia/nuxt`: 状态管理
  - `@nuxtjs/color-mode`: 主题切换
  - `@vite-pwa/nuxt`: PWA支持
- 主要目录结构：
  - `app/`: Vue应用代码
  - `server/api/`: 服务端API路由
  - `public/`: 静态资源

## Development Commands

### Root Level Commands
```bash
# 安装依赖（使用pnpm workspace）
pnpm install

# 查看workspace包
pnpm list -r
```

### CLI Package Commands (`packages/cli/`)
```bash
# 开发模式（带监听）
pnpm dev

# 构建CLI
pnpm build

# 运行构建后的CLI
pnpm start

# 代码检查
pnpm lint

# 类型检查
pnpm typecheck

# 运行测试
pnpm test

# 发布准备
pnpm release
```

### Server Package Commands (`packages/server/`)
```bash
# 开发服务器
pnpm dev

# PWA开发模式
pnpm dev:pwa

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview

# 生成静态站点
pnpm generate

# 启动生产服务器
pnpm start

# 启动静态站点服务器
pnpm start:generate

# 代码检查
pnpm lint

# 类型检查
pnpm typecheck

# Nuxt准备
pnpm prepare
```

## Key Configuration Files

- `pnpm-workspace.yaml`: pnpm workspace配置
- `packages/server/nuxt.config.ts`: Nuxt应用配置
- `packages/cli/build.config.ts`: CLI构建配置
- `packages/*/eslint.config.js`: ESLint配置（使用@antfu/eslint-config）

## Testing

- CLI包使用vitest进行单元测试
- 测试文件位于`packages/cli/test/`目录
- 运行测试：`pnpm test`（在CLI包目录下）

## Build Process

- CLI包通过unbuild构建成ESM格式的可执行文件
- Server包通过Nuxt构建成生产应用或静态站点
- 支持Docker部署（有Dockerfile配置）