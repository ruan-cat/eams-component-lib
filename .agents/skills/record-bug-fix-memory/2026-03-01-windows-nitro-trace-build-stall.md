# 2026-03 Windows Nitro trace 构建假卡死

## 1. 问题现象

- PowerShell 构建长时间停在 Nitro 收尾，多次超时后看似彻底卡死。

## 2. 实际根因

- Windows + pnpm workspace 的 `nodeFileTrace` 收尾阶段消耗高 CPU/内存；超时中断与后台 `pnpm → cmd → node` 还会残留旧进程并叠加假象。

## 3. 关键误导点

- 只看最后一行日志，不先区分旧进程与当前进程，也没有确认 `.nuxt/dist/server` 与 `.output/server` 的产物边界。

## 4. 有效修复

- 先清理旧构建进程，再用单进程复现并确认卡点。历史上曾使用 `externals.inline = [/.*/]` 绕过本地 tracing；该做法已被后续 Vercel 案例标记为生产禁用。

## 5. 验证方式

- 单进程构建生成 `.output/server/index.mjs` 并打印完成日志，同时确认没有残留目标进程。

## 6. 后续约束

- 本地构建绕行不能直接推广到 Vercel；禁止无条件 `trace: false` 或 `inline: [/.*/]`，以当前生产约束为准。
