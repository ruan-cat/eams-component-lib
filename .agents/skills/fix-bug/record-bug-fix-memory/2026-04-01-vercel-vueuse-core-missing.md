# 2026-04 Vercel `@vueuse/core` 外部化缺失

## 1. 问题现象

- Vercel 云函数加载 Element Plus 时找不到 `@vueuse/core`，返回 500。

## 2. 实际根因

- Vite SSR 默认外部化 workspace 包与 Element Plus；pnpm 符号链接和多版本 `@vueuse/core` 使 NFT 未追踪到正确依赖。

## 3. 关键误导点

- Nitro `inline` 介入得太晚；单独新增 `@vueuse/core` 也可能因 v12/v13/v14 兼容差异造成新问题。

## 4. 有效修复

- 在 `vite.ssr.noExternal` 中加入 workspace 包、Element Plus 及完整运行时依赖树；Windows trace 处理必须条件化，不能影响 Linux。

## 5. 验证方式

- 本地检查 server chunks 已内联关键依赖，并用实际 Vercel URL 确认 HTTP 200 与 Content API 正常。

## 6. 后续约束

- SSR 依赖缺失优先查 `vite.ssr.noExternal`；workspace 包及其传递依赖不能只凭本地符号链接推断。
