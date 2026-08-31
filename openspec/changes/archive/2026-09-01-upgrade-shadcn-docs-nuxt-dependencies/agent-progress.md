# 长任务进度

- Change：`upgrade-shadcn-docs-nuxt-dependencies`
- 当前 checkpoint：Final / 任务 1-23 已完成；子任务 `fix-vercel-nitro-runtime-closure` 已完成。
- 状态：实现、分层验证与生产验收完成；OpenSpec 状态为 `complete`，当前仅待归档。
- 依赖基线：Nuxt 3.21.2、shadcn-docs-nuxt 1.1.9、@ztl-uwu/nuxt-content 2.13.9、h3 1.15.11、nuxt-og-image 5.1.9。
- 配置边界：保留 `std-env`、`build`/`build:docs` → `build:vercel`、debug 等窄兼容入口；`compatibilityDate` 使用 Cloudflare/Vercel 双平台对象并固定为 `2024-09-19`；生产不配置 `nitro.externals`，依赖通过 manifest/override 闭合。
- 依赖闭合：root 与文档包显式声明 `entities`；根 override 固定 `nuxt-og-image` 与 `tsdown@0.3.1>rolldown`；未恢复整族宽 externalization。
- 本地验证：隔离 checkout fresh install、`pnpm why`、Nuxt prepare、Windows trace opt-in build、node-server `.output` 启动、Content/MDC 测试（9 个文件/12 个测试）及 HTTP smoke 均通过。
- Linux/GitHub：最新 main CI `33413603476` 与 Release `33413603437` success；tag Release（两个 4.0.0 包与 root v2.0.2）均 success。
- Vercel：最新生产 deployment `dpl_Fn96o6sFRQHRrXQEg89vDDuRVCUX` 对应提交 `306d316`，状态 Ready/Promoted，Node 24.x；页面与 Content cache/search 共 7 个端点 HTTP 200，日志无 `entities/decode` 或 `MODULE_NOT_FOUND`。
- 浏览器：修复链路的生产首页与 Table demo 已由 agent-browser 验证，导航、SSR 内容、交互与代码面板正常，errors 为空。
- 历史记录：早期 F24/F17-F23 失败保留在 `agent-findings.md` 作为审计轨迹，最终 F24 已标记 resolved，不再作为当前阻塞。
- 用户边界：`docs/prompts/index.md` 是任务外既有修改，发版与归档均未触碰。
- 归档前注意：当前 `openspec/specs/` 没有这些 delta spec 的对应主规格文件，需明确选择“同步创建主规格”或“仅归档 change”。
