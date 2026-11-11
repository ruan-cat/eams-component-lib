# 2026-11-11 Nuxt 4 依赖升级与 shadcn-docs-nuxt 系列故障治理

> Agent 工具：Qoder Desktop（qoder-cn CLI）。AI 模型：本会话未暴露可靠模型标识，不臆造。
> 经验来源：`D:\code\ruan-cat\shadcn-docs-nuxt-production-repro` 实验仓（R01–R54、FINDINGS、HANDOFF、分支实验）+ memorix 会话记忆 + 本仓 `docs/reports/2026-8-31-fix-shadcn-docs-nuxt` 与 openspec 归档。
> 目标仓库：`eams-component-lib`，文档站 `packages/vue-element-cui-nuxt`，生产 https://vec.ruan-cat.com/ 。

## 0. 结论速览

| 验收项                                  | 结果                                 | 证据                                                                                                                           |
| --------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 1. 内置 Nuxt 为 4 而非 3                | ✅ 达成                              | `nuxt@4.6.4`（构建横幅 `Nuxt 4.6.4 (with Nitro 2.13.6, Vite 8.3.7 and Vue 3.5.45)`）                                           |
| 2. Nitro 必须 v3                        | ❌ **生态不可行**（实测判定，见 §4） | 强制 `nitropack→npm:nitro@3.0.261103-rc` 后 `nuxt prepare`/build 均 exit 1：`Loading @nuxt/nitro-server server builder failed` |
| 3. h3 必须高版本(v2)                    | ❌ **生态不可行**（实测判定，见 §4） | 单独 override `h3:^2.0.8` 同样 exit 1，同一报错                                                                                |
| 4. 清缓存+重装后 dev/preview 浏览器可用 | ✅ 达成                              | 全量隔离 node_modules/.turbo/dist/.nuxt/.vercel-output 后冷装；dev(3000)/preview(3210) 真实 Chrome 交互全绿（§5）              |
| 5. 分类提交 + 部署后生产可用            | ✅ 提交完成；部署与生产复核见 §7     | 6 个分类提交；push 触发 Vercel                                                                                                 |
| 6. 本报告                               | ✅                                   | 本文件                                                                                                                         |

**核心发现：过去堆在 `nuxt.config.ts` / `pnpm-workspace.yaml` 里的大量"脏补丁"，治的都是症状；真正的根因只有两处（Nuxt 4.6 的 buildDir 迁移、Vite 8 rolldown 对原生 addon 的优化崩溃），各用一行/一段配置即可根治。** 升级后 `pnpm-workspace.yaml` 零 overrides，`nuxt.config.ts` 从 124 行降到 ~80 行且不含任何 noExternal/alias/shim。

## 1. 升级前后版本矩阵

| 包                    | 升级前                          | 升级后                    | 说明                                                   |
| --------------------- | ------------------------------- | ------------------------- | ------------------------------------------------------ |
| nuxt                  | 3.21.2（精确钉）                | **4.6.4**（`^4.6.4`）     | 大版本升级，破坏性                                     |
| shadcn-docs-nuxt      | 1.1.9（精确钉）                 | **1.2.2**（`^1.2.2`）     | 层自身声明 nuxt-og-image ^6.5.0、mdc ^0.22.0           |
| @ztl-uwu/nuxt-content | 2.13.9（精确钉）                | **2.14.1**（`^2.14.1`）   | 仍为 content v2 世代 fork                              |
| vue                   | ^3.5.30 → 3.5.30                | ^3.5.44 → **3.5.45**      |                                                        |
| vue-router            | ^4.6.4                          | **^5.4.0**                | Nuxt 4 自带要求                                        |
| element-plus          | ^2.13.5（双版本 2.13.6+2.14.8） | **^2.14.8 单版本**        | 组件库与文档站范围统一后 dedupe                        |
| vite                  | ^8.0.0 → 8.0.1                  | **^8.3.5 → 8.3.7**        | 随 @nuxt/vite-builder                                  |
| nitropack             | 2.13.1                          | **2.13.6**                | Nuxt 4 官方运行时，**不是 nitro v3**                   |
| h3                    | 1.15.11（精确钉）               | **1.15.11**（`^1.15.11`） | Nuxt 4 服务端仍 h3 v1                                  |
| 死依赖                | tsdown / unplugin-vue / std-env | **移除**                  | tsdown 是 `tsdown>rolldown` 脏 override 的唯一存在理由 |

`pnpm-workspace.yaml` 升级前含 7 条 overrides（unconfig、sass、@intlify/core-base、@intlify/shared、entities、nuxt-og-image、`tsdown@0.3.1>rolldown`）+ 失效的 onlyBuiltDependencies 块；升级后**仅 packages + allowBuilds**。`.npmrc` 移除 `shamefully-hoist=true`。

## 2. 根因一：Nuxt 4.6 生产 buildDir 迁移（同时解释 F50 与畸形外部化路径）

源码证据：`@nuxt/kit@4.6.4/dist/index.mjs:985`

```js
if (!opts.overrides?._prepare && !nuxtConfig.dev && !nuxtConfig.buildDir && existsSync(defaultBuildDir))
	nuxtConfig.buildDir = join(nuxtConfig.rootDir, "node_modules/.cache/nuxt/.nuxt");
```

即**生产构建**时若未显式设置 `buildDir`，Nuxt 4.6 把它迁进 `node_modules/.cache/nuxt/.nuxt`。该迁移造成两个独立故障：

1. **Windows SSR 外部化路径算错**：nitro externals 以 buildDir 为基准做相对化，迁移后产出畸形绝对路径，运行态全 500：
   `ERR_MODULE_NOT_FOUND: 'D:\element-plus@2.13.6_typescr_…\node_modules\element-plus\es\components\icon\index.mjs'`（丢失 `…\node_modules\.pnpm\` 前缀）。
2. **F50 内容库为空**：`@ztl-uwu/nuxt-content` 的 `devStorage["cache:content"].base` 由 `nuxt.options.buildDir` 解析；预热写旧目录、`_snapshot` 读新目录 → 产物 bundled 内容缓存为 0。repro 仓曾判定"无用户侧规避、等上游 nuxt/nuxt#36792"。

**修复（一行）**：`nuxt.config.ts` 显式 `buildDir: ".nuxt"`。

**验证探针**（构建后无需启服务）：

```log
grep -ac "nitro:bundled:cache:content" .output/server/chunks/_/nitro.mjs
# 修复前 = 0（F50 中招）；修复后 = 39（内容库真实 bundled）
```

修复后运行态：`/`、`/getting-started`、`/components/data-display/table`、`/guidelines/component-design` 全 200；`/api/_content/cache.<ts>.json` 200 + 471KB 真实 contents；`/api/_content/search-<ts>` 200 + documentCount 82。**这是 repro 仓 F50 的首个已验证用户侧规避，可直接复用到其他 Nuxt 4.6 + content 项目。**

## 3. 根因二：Vite 8 rolldown 把原生 .node 当 UTF-8 解析 → dev hydration 卡死

dev 首启日志：

```log
ERROR [unhandledRejection] Error during dependency optimization:
[UNLOADABLE_DEPENDENCY] Could not load …/@tailwindcss/oxide-win32-x64-msvc/tailwindcss-oxide.win32-x64-msvc.node
  ╭─[ …/@tailwindcss/oxide/index.js:131:33 ]
  131 │ const binding = require('@tailwindcss/oxide-win32-x64-msvc')
      ╰─ stream did not contain valid UTF-8
```

优化器崩溃留下**半写的 deps 缓存**：浏览器网络面板可见 `…/.cache/vite/client/deps/nostics.js [pending]` 永不完成 → 整个客户端模块图停滞 → SSR HTML 在但 hydration 失效（el-table 0 行、主题/代码按钮无响应），且 console 无报错（极易误判为"正常"）。

**修复**：`vite.optimizeDeps.exclude` 与 `vite.ssr.optimizeDeps.exclude` 均排除 `@tailwindcss/oxide`、`@tailwindcss/oxide-win32-x64-msvc`；并清掉 `node_modules/.cache/vite` 后重启。修复后 oxide 报错计数 0，dev hydration 全绿。

**排查教训**：dev"页面能打开"≠"可用"。必须用真实浏览器验证**交互**（按钮状态变化、表格行数、主题 class 切换），并用网络面板找 `[pending]` 的优化依赖请求；console 干净不代表模块图健康。

## 4. Nitro v3 / h3 v2 实验：生态结构性不可行（今日实测）

npm 元数据（2026-11-11，registry.npmjs.org）：

- `nuxt@4.6.4` → `@nuxt/nitro-server@4.6.4` → `nitropack ^2.13.6` + `h3 ^1.15.11`。
- `nitro@3.0.261103-rc`（v3）依赖 `h3 ^2.0.8`，是**独立服务端包**，API 与 nitropack 不兼容。
- 没有任何已发布 Nuxt 版本（含 4.6.4）以 nitro v3 为运行时。

受控实验（分支 `experiment/nitro3-h3v2`，已删除，仅留结论）：

| 臂  | overrides                                         | install | build  | 报错                                               |
| --- | ------------------------------------------------- | ------- | ------ | -------------------------------------------------- |
| A   | `h3:^2.0.8` + `nitropack:npm:nitro@3.0.261103-rc` | exit 1  | exit 1 | `Loading @nuxt/nitro-server server builder failed` |
| B   | 仅 `h3:^2.0.8`                                    | exit 1  | exit 1 | 同上                                               |

`@nuxt/nitro-server` 在**模块加载期**即调用 h3 v1 / nitropack API，故 v2/v3 在加载期就崩，连 prerender 都到不了。与 repro 仓 R45（h3 2.0.8 → prerender 全 500）方向一致，且本仓把失败点前移到了更早期。

**结论与建议**：验收标准 2、3 与标准 1 在"Nuxt 渲染的文档站"这一形态下**互斥**。若组织内确需 Nitro v3 + h3 v2，唯一正确形态是**独立 API 应用**（repro 仓 `apps/api` 即 `nitro 3.x + h3 2.x`），而非改造文档站运行时。文档站应接受 Nuxt 4 官方的 nitropack 2.13.6 + h3 1.15.11。**不要**用 override 强塞，那会把可部署站点变成不可构建。

## 5. 浏览器实机验收（真实 Chrome，browser-use MCP）

清理动作：根 + 2 包级 `node_modules`、根 + 2 包级 `.turbo`、`packages/vue-element-cui/dist`、`.nuxt`、`.vercel/output`、垃圾目录 `--port/` 全部**改名隔离**到 `D:\code\ruan-cat\_eams-quarantine-20261111`（不删除，可回溯），随后 `pnpm install --no-frozen-lockfile` 冷装。`.pnpm` 恢复 1678 目录，**悬空 symlink 52 → 0**。

| 环境         | 路由                           | HTTP | 交互证据                                                                                                                |
| ------------ | ------------------------------ | ---- | ----------------------------------------------------------------------------------------------------------------------- |
| preview 3210 | /components/data-display/table | 200  | el-table 1 / 3 行；代码面板"展开代码↔收起代码"；搜索输入"表格"返回 4 条真实结果；主题 light→dark；console 零 error/warn |
| dev 3000     | /components/data-display/table | 200  | el-table 1 / 3 行；代码面板切换生效；主题 light→dark                                                                    |
| dev 3000     | /                              | 200  | 中文 h1、5 导航链接、Tailwind v4 oklab 配色、23 iconify 图标、无裸 MDC 标记                                             |

截图见会话内 browser-use 附图（Table 页侧栏导航树 + Live Demo 真实 Element Plus 表格）。

测试：`vitest` 9 文件 12 用例全绿。构建：node-server 48.9s / vercel 49.0s，均 exit 0，F50 探针 39。

## 6. 布局迁移与重名冲突（Nuxt 4 必做）

Nuxt 4 将 srcDir 切到 `app/`。本仓原为混合布局（根级 pages/components/…… + 惰性 `app/components/`）。迁移：

- `pages/ composables/ plugins/ assets/ app.config.ts components/` 全量 `git mv` 进 `app/`（保留历史）。
- 仅靠显式 import 消费的 demo 包装器（`<DemoDataDisplayTableBasicDemo />` 这类模板壳）从 `app/components/demo/*.vue` 移到 **`app/demos/`**，退出组件自动扫描，消除与嵌套实现的自动注册重名（Nuxt 会对相邻重复段去重，导致 `DemoSelectorsOverviewDemo` 撞名、包装器引用的自动导入名消失）。
- `~/app/components/**` 引用改 `~/components/**`；tailwind `@config/@source` 与 content globs 按新层级修正；4 个测试文件导入路径同步修正；7 篇文档示例围栏路径改 `~/demos/*.vue`。

## 7. 提交与部署

6 个分类提交（git-commit 技能，commitlint --strict 全过）：

```log
93be9cd 🦄 refactor(nuxt-doc)!: 迁移到 Nuxt 4 原生 app/ 目录布局
db70bc9 📦 deps(nuxt-doc)!: 升级 Nuxt 4 与 shadcn-docs-nuxt 全量最新依赖
58355f4 🔧 config(workspace): 清空脏 overrides 并移除 shamefully-hoist
409a957 🐞 fix(nuxt-doc): 修复 Nuxt 4.6 buildDir 迁移与 Vite 8 原生 addon 优化崩溃
7de86b3 🧪 test(nuxt-doc): 适配 app/ 布局的测试导入路径
5ad66b6 📃 docs(nuxt-doc): 修正示例代码中的组件导入路径为 Nuxt 4 别名
```

用户未提交改动 `docs/prompts/index.md` **全程保护、未纳入任何提交**。
部署链路：Vercel Git Integration，Project `vue-element-cui-nuxt-doc`，Root Directory=仓库根，Build=`pnpm run build:docs:nuxt-doc`，Output=`.vercel/output`。push main 触发生产部署；生产复核见会话后续记录（https://vec.ruan-cat.com/ ）。

## 8. 内存与孤儿进程治理（agent 协作场景）

- 本机 31.86 GB RAM；升级构建峰值未触 OOM（`--max-old-space-size=8192` 保留为护栏）。repro 仓结论：默认 heap ~4.1 GiB 时 blanket `externals.inline` 才会 OOM；本仓未用 inline，故无此风险。
- **真正的内存/稳定性杀手是孤儿进程**：`TaskStop`/超时只杀 pnpm 外壳，`nuxt.mjs dev/preview` 子进程存活并持有 Nuxt 锁与文件锁，导致后续 build 报 `Another Nuxt dev server is already running (PID …)`、node_modules 改名 EPERM。处置：按端口 `Get-NetTCPConnection` + `Win32_Process.CommandLine` 精确定位后 `Stop-Process`，**不要**盲杀全部 node。
- 本机曾累积 4 个 memorix serve、3 个 chrome-devtools-mcp、2 个 context7 等重复 MCP 长连接（29 个 node 进程 / ~1.4 GB）。建议会话收尾统一清理。
- Windows 文件锁：IDE/tsserver/codegraph 持有原生 `.node` 时目录改名 EPERM；改用 PowerShell `Move-Item`（不同 API 路径）或先杀占用进程。多语句 PowerShell 一律写 `.ps1` 再 `-File` 执行，避免 bash 吞 `$var` 与反斜杠转义。

## 9. 给其他项目的复用清单

1. Nuxt 4.6+ 生产构建**显式 `buildDir: ".nuxt"`**；用 `grep -ac "nitro:bundled:cache:content" .output/server/chunks/_/nitro.mjs` 做 F50 早判（0=中招）。
2. Vite 8 + tailwind v4：`optimizeDeps.exclude`/`ssr.optimizeDeps.exclude` 排除 `@tailwindcss/oxide*`；dev 异常先清 `node_modules/.cache/vite`。
3. 迁 Nuxt 4 先做 `app/` 布局迁移；显式 import 的壳组件移出 `components/` 扫描目录。
4. 删 `shamefully-hoist`；用 `pnpm why` 确认单版本后再删对应 override；死依赖（tsdown 等）连同其 override 一起删。
5. **不要**给 Nuxt 文档站 override nitro v3 / h3 v2；需要 v3/v2 就建独立 nitro API 应用。
6. 验收必须真实浏览器验**交互**+网络面板查 `[pending]`；console 干净≠健康。
7. 清缓存用"改名隔离"而非删除；turbo 缓存在仓库根 `.turbo/cache`，隔离 node_modules 清不掉它，需单独处理。
8. 杀 dev/preview 要杀到 `nuxt.mjs` 子进程，否则 Nuxt 锁与文件锁残留。

## 10. 遗留与上游阻塞

- Nitro v3 / h3 v2 作为 Nuxt 文档站运行时：上游结构性限制，等 Nuxt 官方切换 nitro v3（目前无时间表）。
- `@nuxtjs/mdc` 经 content 注入的 10 条 `vite.optimizeDeps.include` 悬空声明（NUXT_B7002）为上游系统性脱节，**不要用"加依赖"治**，属 cosmetic warning。
- dev 入口脚本 URL 含 Windows 绝对路径（`/_nuxt/D:/…`）为 Nuxt 4.6 dev 态表现，可正常解析，不影响生产产物。
