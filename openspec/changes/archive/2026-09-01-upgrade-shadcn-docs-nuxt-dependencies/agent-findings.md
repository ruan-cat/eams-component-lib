# 长任务发现与风险

## F1 · active · 依赖跨世代漂移

- 结论：当前实际树不是 Nuxt 3 封闭基线。
- 证据：现状 `pnpm --filter @eams-monorepo/vue-element-cui-nuxt list/why` 输出 `nuxt-og-image@5.1.13`、`@nuxt/kit@4.4.2`、`h3@1.15.9`、`@nuxtjs/mdc@0.18.4 + 0.20.2`。
- 后续：任务 1/2 固定 manifest 与根 override，fresh install 后复核。

## F2 · active · 配置图过宽

- 结论：workspace source alias、宽 `vite.ssr.noExternal`、宽 `nitro.externals.inline` 会放大 production graph，不能作为默认闭包修复。
- 证据：`packages/vue-element-cui-nuxt/nuxt.config.ts` 当前 alias、noExternal 与 inline 清单覆盖 Element Plus、VueUse、entities 等整族依赖。
- 后续：任务 3 按 exact error 收敛；保留 Content prerender，Windows trace 改显式 opt-in。

## F3 · active · 外部部署证据边界

- 结论：仓库无 `vercel.json`，Vercel 依赖 Nitro preset 与自定义 artifact move；本地构建不等于 Vercel 完成。
- 证据：根/文档包无 vercel.json，Turbo 通过 `move-vercel-output-to-root` 生成 `.vercel/output`。
- 后续：最后单独检查凭据与项目可用性；不可用时明确披露，不伪造通过。

## F4 · active · 用户已有脏改动

- 结论：`docs/prompts/index.md` 是任务开始前已有修改，不属于本 change。
- 证据：启动时 `git status --short` 仅显示该文件 M。
- 后续：所有 diff/status 验证均排除并保护该文件。

## F5 · active · 首次实现代理未启动

- 结论：首次派工因所选模型容量不足失败，未产生代码或提交。
- 证据：代理返回 `Selected model is at capacity`，工作区仅有既有脏文件与 OpenSpec 工件。
- 后续：改用可用模型重派同一 brief，不改变技术路线。

## F6 · active · 第二次实现代理中断无报告

- 结论：第二次代理已修改 package/config，但在提交、锁文件更新和报告回写前被中断。
- 证据：工作区出现 `package.json`、`packages/vue-element-cui-nuxt/package.json`、`nuxt.config.ts` 改动；未生成 task-1-report.md，`pnpm-lock.yaml` 未变。
- 后续：主代理接管审计与最小修正，必须重新执行 install/why/prepare/build 验证后再更新任务状态。

## F7 · resolved · 镜像缺少 rolldown nightly

- 结论：首次 `pnpm install --lockfile-only` 在依赖解析阶段失败，当前镜像无法提供 `rolldown@nightly`（由 `tsdown@0.3.1` 请求）。
- 证据：命令输出 `ERR_PNPM_NO_MATCHING_VERSION ... rolldown@nightly ... https://registry.npmmirror.com/`。
- 后续：已通过精确 `tsdown@0.3.1>rolldown` override 消除解析阻断；仓库 `.npmrc` 未修改。

## F8 · resolved · 隔离 modules-dir 的绝对路径兼容性

- 结论：`pnpm install --modules-dir <绝对临时路径>` 能完成包下载，但 Windows hoist symlink 阶段把绝对路径拼成工作区相对路径，最终以 ENOENT 失败。
- 证据：输出目标变成 `D:\...\eams-component-lib\C:\Users\...\Temp\...`。
- 后续：已用临时相对 modules-dir 完成安装并清理临时目录；不改仓库配置。

## F9 · resolved · Windows 默认 NFT trace 长尾

- 结论：Windows 默认 `nuxt build` 在 Nitro trace 收尾阶段长时间高内存运行，未在预算内生成 `.output/server/index.mjs`；这是当前平台资源门失败，不应通过宽 inline 掩盖。
- 证据：临时 checkout `D:\eams-component-lib-verify` 中 `.nuxt/dist/server/server.mjs=True`、`.output/server` 为空；Nuxt PID 26092 工作集约 3.28 GB，持续超过 60 秒。
- 后续：已用 `SHADCN_DOCS_SKIP_NFT_TRACE=1` 完成 Vercel preset 构建；Linux/CI/Vercel 仍需外部环境复验默认 trace。

## F10 · resolved · tsdown nightly registry 阻断

- 结论：`tsdown@0.3.1` 的 `rolldown: nightly` 在公开 registry 无法解析，workspace fresh install 会在 Nuxt 任务开始前失败。
- 证据：`pnpm install --lockfile-only` 在 npmmirror 与 npmjs 均返回 `ERR_PNPM_NO_MATCHING_VERSION rolldown@nightly`。
- 后续：已保留精确 `tsdown@0.3.1>rolldown` override，隔离 checkout frozen install 成功；未使用全局 rolldown override。

## F11 · active · 本机无 Linux 执行环境

- 结论：当前 Windows 主机未安装可用 WSL 发行版或 Docker，无法在本地执行 Linux CI build。
- 证据：`wsl -l -v` 返回帮助/无发行版；`docker` 命令不存在。
- 后续：以 `.github/workflows/ci.yml` 的真实 GitHub Actions 运行结果作为 Linux 门；未获得外部 run 证据前不宣称 Linux CI 通过。

## F12 · active · 主工作区 node_modules 受 VS Code 锁影响

- 结论：主工作区 frozen install 会被 VS Code NodeService 锁住 `@oxc-parser` native binding；隔离 checkout 可完成 fresh install/build/smoke。
- 证据：主路径 EPERM 指向 `parser.win32-x64-msvc.node`；精确审计显示 PID 15880 加载该文件；隔离路径 `D:\eams-component-lib-verify` 安装与构建通过。
- 后续：继续使用隔离 checkout 验证，主工作区不再强行删除 node_modules；交付时保留该环境边界。

## F13 · resolved · compatibilityDate 历史对象配置

- 结论：原配置使用 Cloudflare/Vercel 双键对象并固定到 2024-09-19，与共享技能 Nuxt 3 基线不一致。
- 证据：`packages/vue-element-cui-nuxt/nuxt.config.ts` 原 `compatibilityDate` 对象；模板基线要求字符串 `2025-05-13`。
- 后续：已改为共享字符串 `2025-05-13`，并完成 prepare、Vercel preset 与 node-server 构建；远端 HTTP 仍由 F24 单独阻塞。

## F14 · resolved · 独立 review 代理容量失败

- 结论：首次 pilot review 因模型容量不足失败，未产生审查结论。
- 证据：代理返回 `Selected model is at capacity`。
- 后续：已用可用轻量模型完成 scoped re-review，规格与测试修正均确认 addressed。

## F15 · resolved · 主工作区测试命令受 node_modules 锁影响

- 结论：主工作区测试入口因 VS Code 锁导致 node_modules 链接不完整，不能作为测试证据；隔离 checkout 使用同一源码/锁文件可复现执行。
- 证据：主路径 `pnpm --filter ... test` 返回 `'vitest' is not recognized`；`D:\eams-component-lib-verify` 返回 `Test Files 9 passed / Tests 12 passed`。
- 后续：交付报告明确测试证据来自隔离 checkout，并把主工作区 EPERM 作为环境边界，不伪造本地依赖健康。

## F16 · active · 当前变更尚无外部 CI/Vercel 证据

- 结论：GitHub CLI 只查到基线 SHA `947d477...` 的历史 CI 成功；当前未提交变更尚未进入 GitHub Actions，Vercel connector/凭据也未提供。
- 证据：`gh run list --repo ruan-cat/eams-component-lib` 返回 2026-08-27 CI run `33097414297`，head SHA 为基线；当前环境工具发现无 Vercel connector。
- 后续：保持 tasks 中 Linux CI/Vercel 为未完成；若用户后续授权推送/触发部署，再用当前 commit 重跑两道外部门。

## F17 · superseded · Vercel runtime 缺少 entities/decode

- 结论：删除文档包 `entities` 直接依赖后，Vercel 远端 Linux 构建虽 READY，但函数启动时报 `Cannot find module 'entities/decode'`；根 workspace override 不足以闭合部署包 runtime。
- 证据：部署 `dpl_94Cf1fwDZSKuGdt5bdz1DUydiWz6` 日志显示 `@vue/compiler-core` → `vue` Require Stack 缺少 `entities/decode`。
- 后续：文档包恢复显式 `entities: ^7.0.1`，重新生成锁文件、fresh install、Vercel build 与 HTTP smoke。

## F18 · superseded · root manifest 可能缺少 Vercel trace 入口

- 结论：文档包补回 `entities` 后，Vercel 函数仍无法解析 `entities/decode`；怀疑根构建以 root manifest/hoisted Vue compiler 链为 trace 入口。
- 证据：远端部署 `dpl_9ue2n2UvcPv4YbVrK7uKRHGUCqwc` 日志仍报 `@vue/compiler-core` → `entities/decode` 缺失；root `package.json` 原无 `entities` 直接依赖。
- 后续：增加 root `entities: ^7.0.1` 单变量假设，重新 lock/fresh/远端 build/smoke；若仍失败再评估精确 Nitro inline。

## F19 · superseded · entities 需要 Vite SSR 窄 externalization

- 结论：root 与文档包双 manifest 声明仍不足以闭合 Vercel 函数，`entities/decode` 缺口发生在 Vite SSR externalization 后的 runtime closure。
- 证据：连续 Vercel 远端部署仍在 HTTP 请求时报 `Cannot find module 'entities/decode'`；原配置宽 noExternal 曾包含 `/entities/`。
- 后续：将 `entities` 加入 `vite.ssr.noExternal` 作为 exact error 窄修复，远端 build/smoke 通过后再关闭本条风险；不恢复整族 inline。

## F20 · superseded · entities 需要 Nitro inline 对照

- 结论：root manifest 与 Vite noExternal 均未修复 Vercel runtime 缺包，最后尝试 Nitro 单包 inline。
- 证据：`dpl_6sDvBe...` 与 `dpl_2V9gXma...` 远端日志仍报 `Cannot find module 'entities/decode'`；构建输出未见 entities 被内联。
- 后续：仅验证 `nitro.externals.inline: ["entities"]`；若仍 500，停止叠加配置并将问题升级为 production artifact closure 架构阻塞。

## F21 · superseded · entities bare inline 未匹配子路径

- 结论：`nitro.externals.inline: ["entities"]` 未覆盖远端 `entities/decode` runtime 入口，需用 `/entities/` 精确单包正则复验。
- 证据：部署 `dpl_Havfiqg...` 仍报同一 `Cannot find module 'entities/decode'`；历史可运行配置使用 `/entities/`。
- 后续：只做正则匹配这一轮；若仍失败，不再扩展 inline/noExternal 清单，转为产物搬运/项目构建边界问题。

## F22 · superseded · Vite noExternal 需要 entities 子路径正则

- 结论：Vite `noExternal: ["entities"]` 不一定覆盖 `entities/decode` 子路径，实际首个导入仍被 externalize；应使用历史同等范围的 `/entities/` 正则。
- 证据：Vercel 远端连续部署在 `@vue/compiler-core` 处报 `entities/decode`；原基线配置使用 `/entities/`。
- 后续：验证 `noExternal: ["debug", /entities/]`；若仍 500，停止继续扩大生产图并上报架构阻塞。

## F23 · superseded · 最小 Vue compiler runtime 闭包对照

- 结论：Vercel 错误链明确经过 Vue CJS 与 `@vue/compiler-core`，单包 entities inline 未能让函数闭包可启动。
- 证据：连续部署仍报 `@vue/compiler-core/dist/compiler-core.cjs.prod.js` 缺少 `entities/decode`；本地 server bundle 对 entities 已无外部 import，但远端函数仍缺包。
- 后续：仅验证 `vue`、`@vue/compiler-core`、`@vue/compiler-dom` 与 `entities` 的窄 noExternal/inline 闭包；若仍失败，停止继续扩大配置并转架构阻塞。

## F24 · resolved · Vercel production artifact closure 架构阻塞

- 结论：root/docs 显式 entities、Vite noExternal、Nitro inline 多轮单变量对照均无法修复远端 `entities/decode`；继续堆依赖白名单会违反生产图边界。
- 证据：多次 Vercel 预览部署（含 `dpl_94Cf1fw...`、`dpl_9ue2n2...`、`dpl_6sDvBe...`、`dpl_5Wdjei1...`、`dpl_C8Kyqv...`）均 READY，但 HTTP 触发 `@vue/compiler-core` → `entities/decode` 500；本地产物与旧生产域名 `https://vec.ruan-cat.com` 可正常运行。
- 状态：resolved；子 change 通过依赖图统一与精确 SSR bundle/alias 处理闭合 runtime，最终生产 deployment `dpl_E3ShR447tNh6SqjBbLQXfWeWQwhz` READY，HTTP 与浏览器 smoke 通过。

## F25 · resolved · 已拆分专项子任务

- 结论：F24 不再继续堆叠在父 change 内，已建立 `fix-vercel-nitro-runtime-closure` 作为专项子 change。
- 证据：子 change proposal/design 明确 Parent change、继承边界与专项验收；父 tasks 已新增 Follow-up 关联条目。
- 后续：无；子 change 已完成 Vercel/Nitro artifact closure 与 Git/浏览器 E2E，父 change 保持依赖/配置交付边界。
