# 2026-09-01 Nuxt SSR i18n 多版本依赖冲突

## 1. 问题现象

- `nuxt dev` 启动后页面全部 500，报 `registerMessageResolver is not a function`。

## 2. 实际根因

- `@intlify/core-base` 同时存在 9.x 与 11.x；pnpm 隔离解析命中了不匹配的旧版本。放开 hoist 后又暴露旧 Sass 版本冲突。

## 3. 关键误导点

- 反复调整 `vite.ssr.noExternal`、alias、dedupe 等配置，实际问题在 workspace 依赖树而不是 Vite 绕过层。

## 4. 有效修复

- 用 `.npmrc` 与 `pnpm-workspace.yaml` overrides 统一 `@intlify/*` 和 Sass 版本，升级根 `vue-i18n`，并在外部终端执行安装。

## 5. 验证方式

- fresh 启动页面均返回 200，并检查 `node_modules/@intlify/core-base/package.json` 为统一目标版本。

## 6. 后续约束

- 遇到 SSR `is not a function`，先 `pnpm why` 排查多版本，再决定 overrides；不要先堆 Vite 配置。
