# 子任务发现与风险

## F1 · active · 父任务边界

- 结论：本 change 是 `upgrade-shadcn-docs-nuxt-dependencies` 的专项子任务，继承 Nuxt 3/H3/Content/OG 基线和配置减法。
- 证据：子 change proposal/design 与父 tasks Follow-up 条目均明确 Parent/Scope。
- 后续：不恢复父任务删除的宽 externalization；只处理 Vercel artifact closure。

## F2 · active · Vercel runtime 首错

- 结论：候选 Vercel 部署构建 READY，但函数请求报 `Cannot find module 'entities/decode'`。
- 证据：父任务 F24 及部署日志，调用链为 `@vue/compiler-core/dist/compiler-core.cjs.prod.js` → `vue` → `entities/decode`。
- 后续：先取得当前 artifact manifest 与外部 import，再决定修复阶段。

## F3 · active · 外部验收尚未完成

- 结论：当前 commit 尚未进入 GitHub Actions/Git Integration；agent-browser 可见浏览器验收也未完成。
- 证据：父任务 F11/F16；当前工作区仍有未提交改动。
- 后续：修复后必须分别执行 Linux CI、Vercel Git、HTTP 和 agent-browser，不把 CLI preview READY 当生产通过。

## F4 · active · 本地产物含绝对 file URL

- 结论：当前本地 `.vercel/output/functions/__fallback.func` 的 chunks 含 Windows `file://D:/.../node_modules/.pnpm/...` imports，不能直接作为 Vercel runtime artifact。
- 证据：`rg` 检查 `packages/vue-element-cui-nuxt/.vercel/output/functions/**` 命中 `unified`、`vue-router`、`vue` 等绝对路径；主工作区 `.output/server` 当前不存在。
- 后续：子任务必须在 Linux/Vercel 产物中确认无本机绝对路径，并以函数 manifest/trace 证据修复。

## F5 · active · agent-browser 对照结果

- 结论：可见浏览器能够打开旧生产域名；候选预览受 Vercel 保护并显示非应用页面，不能作为应用通过证据。
- 证据：`agent-browser --args --no-sandbox` 打开 `https://vec.ruan-cat.com/` 成功，snapshot 显示首页导航/主题按钮；候选 `https://vue-element-cui-nuxt-2lc50vw8u-ruancat-projects.vercel.app/` 未呈现应用，`vercel curl` 同 URL 返回 500。
- 后续：修复并获得 bypass/Git 主链后，再用 agent-browser 验证 console、hydration、主题、侧栏与 demo 交互。

## F6 · resolved · CLI 上传可能携带本地生成产物

- 结论：此前 CLI 上传的临时 checkout 曾包含本地 `.output/.vercel` 生成目录，可能污染远端构建输入并复用错误 artifact。
- 证据：Vercel deployment files API 显示 `src/packages/vue-element-cui-nuxt/.output/server/**` 被上传；这些文件来自 Windows 本地构建，含 `file://D:/...` imports。
- 结论：该假设已排除。排除所有 `.nuxt/.output/.vercel/node_modules` 的 `D:\eams-runtime-clean` 源码 checkout，经 Vercel 远端重新安装/构建后仍复现同一 500。

## F7 · active · Vercel runtime closure 架构阻塞

- 结论：截至当前最小实验，没有可证明的 `nuxt.config.ts` noExternal/inline 修复。clean checkout 依次验证了 `entities` 直接依赖、`entities`/Vue compiler inline、正则 `/entities/`、以及 workspace package SSR noExternal，所有部署均 READY 但 HTTP 仍返回 `FUNCTION_INVOCATION_FAILED`。
- 首错：Vercel function 启动时 `@vue/compiler-core/dist/compiler-core.cjs.prod.js` → `vue/dist/vue.cjs.prod.js` → `entities/decode`。
- 判定：不是“构建失败”，而是 Linux/Vercel 函数产物在运行时缺少 `entities/decode` 可解析闭包；当前公开配置层尝试不足以证明闭包已修复。
- 边界：任务 7-13 不得勾选。需要新的产物级方案（Vercel/Nitro adapter、函数 manifest/trace 修补或锁定兼容依赖）后，才能继续全链路验收。

## F8 · resolved · compatibilityDate 对象改写未改变首错

- 结论：按用户要求将 Nuxt 配置改为 Cloudflare/Vercel 双平台对象，保留日期 `2025-05-13`；Nuxt 3.21.2 prepare 和 Vercel preset build 均成功，但远端 HTTP 仍 500。
- 证据：隔离 fresh install、`nuxt prepare`、9 个测试文件/12 个测试通过；本地与 Vercel 构建日志均显示 `compatibility date: 2024-09-19`；Vercel `dpl_B2tGRVyezXBASWV6LDDhxFVrAUdJ` READY 后 `vercel curl /` 仍返回 `FUNCTION_INVOCATION_FAILED`。
- 判定：日期/对象形状不是 `entities/decode` runtime closure 修复；任务 7 继续保持未完成。该规范化配置已保留在主工作区。

## F9 · resolved · Git Integration 缺少 workspace build 依赖

- 结论：首次 Git Integration 生产构建在 Nuxt SSR 开始前失败，原因是干净 checkout 未先生成 workspace 组件库 `dist`，不是 `entities/decode` 运行时错误。
- 证据：Vercel 部署 `dpl_5RnvtodC7t5EnpHSemNJtAPjWhuJ` checkout commit `5b0c624` 后，在 `@eams-monorepo/vue-element-cui-nuxt#build:vercel` 报 `Failed to resolve entry for package "@eams-monorepo/vue-element-cui"`；隔离 clean checkout 加入 `packages/vue-element-cui-nuxt/turbo.json` 的 `build:vercel.dependsOn: ["^build"]` 后，组件库 build 成功并进入 Nuxt build。
- 修复：提交 `951272d` 增加该 Turbo 依赖边，避免 Git Integration 依赖旧缓存或本地上传产物。
- 边界：该修复尚未重新 push；push 后必须重新观察 Git Integration 生产构建及后续 Function HTTP 结果。
