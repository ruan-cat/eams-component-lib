# 2026-04 Nuxt Content 生产环境连锁故障总复盘

## 1. 问题现象

- Vercel 先后出现 `entities/decode`、`@vueuse/core` 缺失，以及 Content 数据库为空导致的运行时错误。

## 2. 实际根因

- 为 Windows 本地构建添加的 `trace: false`、全量 `inline` 和清空预渲染路由等补丁，在 Vercel Linux 的 NFT、workspace 依赖与 document-driven 预渲染链路中互相放大。

## 3. 关键误导点

- “本地能跑”被当成生产完成证据，忽略了构建平台、pnpm 链接结构和预渲染阶段不同。

## 4. 有效修复

- 让 Vercel 使用默认 trace；以 `vite.ssr.noExternal` 内联 workspace 运行时依赖；统一 `entities`；恢复 `crawlLinks` 与 Content 预渲染。

## 5. 验证方式

- 同时执行本地构建检查与实际 Vercel URL/API 验证，确认云函数启动、页面 HTTP 200、文档内容可读取。

## 6. 后续约束

- 禁止无条件 `trace: false`、`inline: [/.*/]` 和 `routes.clear()`；任何 Windows workaround 都必须评估 Linux 生产影响。
