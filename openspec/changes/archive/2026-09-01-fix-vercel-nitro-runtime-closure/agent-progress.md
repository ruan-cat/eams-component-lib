# 子任务进度

- Change：`fix-vercel-nitro-runtime-closure`
- Parent：`upgrade-shadcn-docs-nuxt-dependencies`；本 change 是父任务 F24 的专项 Vercel/Nitro runtime closure 子任务。
- 当前 checkpoint：Final / 任务 1-14 已完成。
- 状态：实现、GitHub Actions、Vercel Git Integration、Function runtime、HTTP smoke 与 agent-browser 验收完成；OpenSpec 状态为 `complete`，当前仅待归档。
- 最终修复边界：通过依赖 manifest/override、窄 Vite SSR 兼容入口、Popper 绝对 ESM alias 与 workspace build 依赖边闭合运行时；生产 `nuxt.config.ts` 不保留 `nitro.externals` 宽 inline。
- 最新生产证据：deployment `dpl_Fn96o6sFRQHRrXQEg89vDDuRVCUX` 对应提交 `306d316`，Ready/Promoted，Node 24.x；首页、安装、Table、guidelines、updates、Content cache/search 共 7 个端点 HTTP 200，日志无 `entities/decode`、`MODULE_NOT_FOUND` 或 `FUNCTION_INVOCATION_FAILED`。
- CI/发布证据：GitHub main CI/Release 与三个 tag Release 均 success；子任务 strict validate 退出码 0。
- 浏览器证据：修复链路的生产首页与 Table demo 通过 agent-browser，可见导航、主题、SSR 内容、表格 demo 和代码面板，errors 为空。
- 历史记录：F24 及 F17-F23 的失败部署、绝对路径 artifact、entities/decode 首错保留在 `agent-findings.md`；最终 F11/F24 已标记 resolved。
- 用户边界：`docs/prompts/index.md` 是任务外既有修改，未被本子任务或归档摘要触碰。
- 归档前注意：本子任务存在 delta spec，但当前 `openspec/specs/` 没有对应主规格文件，需明确选择同步或仅归档。
