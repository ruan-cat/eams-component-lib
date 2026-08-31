# 2026-09-01 Nuxt 客户端 hydration 被依赖入口打断

## 1. 问题现象

- 暗黑模式无法切换、侧栏折叠无效等交互全部失效。

## 2. 实际根因

- 客户端 hydration 被 ESM/CJS 依赖入口兼容问题打断，首个可信错误为 `dayjs.min.js does not provide an export named 'default'`，并可能串出 `debug`、`mermaid` 等入口错误。

## 3. 关键误导点

- 视觉症状容易被误判成 CSS 问题；真正线索来自浏览器 console，而不是页面外观。

## 4. 有效修复

- 保持 `extends: ["shadcn-docs-nuxt"]`；在 Vite 层修正依赖入口、补充 `optimizeDeps.include`、`resolve.dedupe` 与必要的 `ssr.noExternal`。

## 5. 验证方式

- 使用 Chrome console 确认 hydration 与模块导入错误消失，再验证暗黑模式和侧栏交互恢复。

## 6. 后续约束

- 排错顺序固定为：console 模块错误 → 依赖入口 → 样式层。
