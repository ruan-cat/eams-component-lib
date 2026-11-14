# 2026-11-11 Nuxt 4 依赖升级与 shadcn-docs-nuxt 系列故障治理

> Agent 工具：Qoder Desktop（qoder-cn CLI）。AI 模型：本会话未暴露可靠模型标识，不臆造。
> 经验来源：`D:\code\ruan-cat\shadcn-docs-nuxt-production-repro` 实验仓（R01–R54、FINDINGS、HANDOFF、分支实验）+ memorix 会话记忆 + 本仓 `docs/reports/2026-8-31-fix-shadcn-docs-nuxt` 与 openspec 归档。
> 目标仓库：`eams-component-lib`，文档站 `packages/vue-element-cui-nuxt`，生产 https://vec.ruan-cat.com/ 。

## 0. 结论速览

| 验收项                                  | 结果                                                                                                                           | 证据                                                                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 1. 内置 Nuxt 为 4 而非 3                | ✅ 达成                                                                                                                        | `nuxt@4.6.4`（构建横幅 `Nuxt 4.6.4 (with Nitro 2.13.6, Vite 8.3.7 and Vue 3.5.45)`）                                           |
| 2. Nitro 必须 v3                        | ✅ 项目级达成（双应用，见 §15；**用户 2026-11-14 裁决接受该口径**）；强塞 docs 运行时不可行（§4）                              | 强制 `nitropack→npm:nitro@3.0.261103-rc` 后 `nuxt prepare`/build 均 exit 1：`Loading @nuxt/nitro-server server builder failed` |
| 3. h3 必须高版本(v2)                    | ✅ 项目级达成（双应用，见 §15；**用户 2026-11-14 裁决接受该口径**）；强塞 docs 运行时不可行（§4）                              | 单独 override `h3:^2.0.8` 同样 exit 1，同一报错                                                                                |
| 4. 清缓存+重装后 dev/preview 浏览器可用 | ✅ 达成                                                                                                                        | 全量隔离 node_modules/.turbo/dist/.nuxt/.vercel-output 后冷装；dev(3000)/preview(3210) 真实 Chrome 交互全绿（§5）              |
| 5. 分类提交 + 部署后生产可用            | ✅ 达成：分类提交完成；Nuxt4 已上线生产（§14），现行通道 Git-integration push 即部署（§17），生产真实浏览器复核全绿（§15/§17） | 见 §11                                                                                                                         |
| 6. 本报告                               | ✅                                                                                                                             | 本文件                                                                                                                         |

**核心发现（最终裁决）：脏补丁治的都是症状；真根因三处——Nuxt 4.6 buildDir 迁移（F50）、Vite 8 rolldown 对原生 addon 的优化崩溃（oxide）、element-plus 外部化 + popper alias 闭包缺包——各以一项精确配置根治（buildDir / 双 exclude / 条件准入 inline 全 UI 链），并以 overrides dedupe 源头消多版本 symlink。** 中间态曾写「零 overrides、~80 行」，后由 §12.2 订正；最终配方以 §0.5 为准，通道误归因教训见 §18。

> **阅读指南（2026-11-14 补）**：现行态以 §0.5 配方 + §14/§15 上线与复核 + §17 通道裁决 + §19 traceInclude/oxide 裁决为准。§11–§13 为历史中间态（含两包 inline 等不完全 hack、「上游阻塞」结论），保留作反面教材，**不得作现行态引用**；`docs/prompts/index.md:364` 引用的两包 inline snippet 同属中间态，现行配置以 `nuxt.config.ts:91-124` 为准。

## 0.5 核心落地经验（可直接复用到其他 shadcn-docs-nuxt / Nuxt 项目）

**已验证绿的最终配置组合**（本地 dev/preview/测试全绿）：

| 项                                                       | 值                                                                                                            | 治什么                                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| nuxt                                                     | `4.6.4`                                                                                                       | 目标世代                                                                                |
| nitropack                                                | `2.13.6`（Nuxt4 官方运行时）                                                                                  | **2.13.4 只适配 Nuxt3，不可钉到 Nuxt4**                                                 |
| `buildDir`                                               | `".nuxt"`                                                                                                     | F50 内容库空 + Windows 畸形外部化路径（Nuxt4.6 默认迁 buildDir 到 node_modules/.cache） |
| `@popperjs/core`                                         | `npm:@sxzz/popperjs-es@^2.11.8`                                                                               | 真实包为 CJS，nitro 外部化报 named-export `placements`                                  |
| `nitro.externals.inline`                                 | 多版本包族（ufo/devalue/entities/hookable/unhead/parse5/source-map-js/vue-bundle-renderer/h3 + popper/UI 族） | 闭包 symlink 归零                                                                       |
| `pnpm.overrides`                                         | `entities:^7.0.1`、`source-map-js:^1.2.1`                                                                     | dedupe 多版本，避免 linkPackage 绝对 symlink                                            |
| `vite.optimizeDeps.exclude` + `ssr.optimizeDeps.exclude` | `@tailwindcss/oxide*`                                                                                         | Vite8 rolldown 把原生 .node 当 UTF-8 解析致 dev hydration 卡死                          |
| `pnpm-workspace.yaml`                                    | 仅 packages + allowBuilds + 2 条 dedupe override                                                              | 无脏钉版                                                                                |

**部署铁律**：

1. **Windows 构建产物不可移植**（symlink=0 仍含构建机绝对路径，上 Vercel Linux 即 500）→ **必须 Linux 构建**（CI prebuilt）。
2. **hoist 是反模式**（nuxt#13644 破坏 NFT 追踪）；不要靠 shamefully-hoist/node-linker=hoisted 修闭包。
3. **每次 push main 触发 Vercel Git 自动生产部署**，会覆盖手动 promote；上线 Nuxt4 前须暂停 Git 自动部署（`vercel git disconnect`）改走 CI prebuilt。
4. 恢复生产保活：`vercel promote <Nuxt3良好部署URL> --yes`。

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

**2026-11-14 冷缓存 A/B 复测**（vite 8.3.7 / rolldown 1.2.18 / oxide 4.3.5=最新）：移除 exclude 立即复现 `UNLOADABLE_DEPENDENCY`、dev 503；保留则 oxide 0 + 真实浏览器水合全绿（el-table 3 行 / 侧栏 29 / `__vue_app__` true）。该块是 **dev 侧精确守卫**：dev 直跑 `nuxt dev` 不经 turbo，与 turbo 缓存/dist 产物无关，也不影响云端构建。**删除条件** = vite/rolldown 上游修复后（8.3.8+）冷缓存复测通过；在此之前保留，非过时配置。

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

## 11. 部署复核与上游阻塞（最终态， supersede §7 的乐观表述）

### 11.1 turbo 远程缓存掩盖修复（用户担忧被证实）

升级后前两次 Vercel 部署 Duration 仅 **20s**（真实 Nuxt 构建约 2min），系命中 **turbo 远程缓存**，直接还原最早一次 Nuxt4 坏产物，导致后续 entities/hoist 修复全部不生效。处置：将 `build:vercel` 与 `do-build-nuxt-doc` 的 `cache` 置 `false`（commit 9140366），此后部署恢复真实构建（Duration ~1-2min）。**结论：部署链路不应信任 turbo 缓存；本地验收 likewise 必须冷缓存。**

### 11.2 Nuxt4 无法部署到 Vercel：函数闭包缺外部化依赖（上游/平台阻塞）

真实构建后生产仍 500，Vercel 函数日志逐包报 `ERR_MODULE_NOT_FOUND`：`entities`（parse5 导入）→ `ufo`（vue-bundle-renderer 导入）→ `devalue`（renderer chunk 导入）。已尝试并**均无效**：

| 尝试                                                            | 结果                          |
| --------------------------------------------------------------- | ----------------------------- |
| 恢复 `entities:^7.0.1` override                                 | entities 报错消失，前移到 ufo |
| `shamefully-hoist=true`                                         | 仍缺 ufo                      |
| `node-linker=hoisted`（真实拷贝、无 symlink）                   | 仍缺 ufo                      |
| `externals.inline:["vue-bundle-renderer","parse5"]`             | ufo 消失，前移到 devalue      |
| `externals.inline:[/node_modules/]`（8GiB 堆，本地 54s 无 OOM） | Vercel 仍缺 ufo               |

**关键对照**：本地 `build:vercel` 产出的 `.vercel/output/functions/__fallback.func/node_modules` **完整包含** ufo/devalue/entities/parse5/vue-bundle-renderer；而 Vercel 云端构建/裁剪后的闭包缺这些包。即差异不在我们的配置，而在 **Vercel 对 prebuilt 函数闭包的处理 / nitro 2.13.6 vercel preset 的外部化追踪**。本地 node-server 与 preview 全绿、本地 vercel 产物闭包完整，唯独 Vercel 运行态缺包 → 判定为上游/平台阻塞，非本仓配置可解。

### 11.3 生产恢复动作（保证"继续可用"）

`vercel rollback` 受 Pro 计划限制（402）。改用 `vercel promote https://vue-element-cui-nuxt-b85yf03xd-…`（升级前 Nuxt3 良好部署）提升为生产别名。复核：`https://vec.ruan-cat.com/` 200（503KB）、`/components/data-display/table` 200（528KB）；真实 Chrome：el-table 1/3 行、代码面板"收起↔展开"、主题 light→dark、console 零 error。**生产当前运行升级前 Nuxt3 部署，可用。**

### 11.4 当前仓库态与后续方向

- 仓库 main 已含完整 Nuxt4 升级（14 个分类提交），本地 dev/preview/测试/双 preset 构建全绿；`pnpm-workspace.yaml` 仅 packages+allowBuilds+entities override，`nuxt.config.ts` 无 noExternal/alias/shim/inline。
- **未决**：① Nuxt4 的 Vercel 部署（上游阻塞）；② nitro v3 / h3 v2 作为 Nuxt 运行时（生态不可行，§4）。
- 可选方向（需用户决策）：a) 生产暂留 Nuxt3，Nuxt4 待上游 nitro/Vercel 修复后再部署；b) 改部署目标为 node-server 自托管 / Cloudflare（绕开 Vercel NFT）；c) 向上游 nitro/nuxt 提 issue 附本报告证据链。

## 12. 二轮深挖修正（用户质疑后，memorix embedding + 官方文档 + 产物级取证）

### 12.1 真正根因：nitro 闭包内的 Windows 绝对 symlink

对本地 `.vercel/output/functions/__fallback.func/node_modules` 取证发现 **13 个 symlink**，目标为 Windows 绝对路径 `…/.func/node_modules/.nitro/<pkg>@<ver>`。成因：`ufo/devalue/hookable/unhead/entities/source-map-js` 等存在**多版本**，nitro `linkPackage` 用 symlink 而非拷贝。Vercel 运行时挂载点为 `/var/task` ≠ 构建路径，绝对 symlink 全部失效 → 逐包 `ERR_MODULE_NOT_FOUND`。**本地 Windows 构建路径==本地解析路径，故"本地绿、线上红"。** 官方文档证实 Vercel 对 prebuilt `.func` **原样部署、不二次裁剪**（Build Output API v3 Primitives），闭包完全由构建期 NFT 决定。

### 12.2 已验证有效的产物级修法

- `nitro.externals.inline` 目标性内联多版本包族 + `pnpm.overrides` dedupe `entities:^7.0.1`、`source-map-js:^1.2.1` → 本地 `.func` **symlink 归零**、闭包自包含（ufo/devalue/entities/hookable/element-plus 全 PRESENT）。
- `nitro.externals.traceOptions.exportsOnly:false`、`nitro.vercel.functions.runtime:"nodejs22.x"` 一并配置。
- 撤掉 hoist（nuxt#13644 实证 `--shamefully-hoist` **破坏** NFT 追踪，是反模式）；`@popperjs/core` 由 npm alias 改回真实包（alias 追踪漏包）。
- 该自包含产物经 `vercel deploy --prebuilt` 上传为预览部署 **Ready**，证明产物本身可部署。

### 12.3 仍未闭环：Vercel Git-integration 云端构建

云端（Linux）自行构建的闭包仍逐包缺包（ufo→hookable→@popperjs/core 打地鼠），与本地自包含产物不一致；判定为 **nitro 2.13.6 在 pnpm isolated 布局下 NFT 追踪不可靠（nitro#106 家族）+ Git-integration 云端构建路径**叠加。可靠路径为：**在 Linux CI 构建 prebuilt 产物后 `vercel deploy --prebuilt`**（或直接部署本地已验证的自包含产物），绕开云端 Git 构建。

### 12.4 生产最终态

`vercel promote` 回升级前 Nuxt3 良好部署（`dpl_HEML5X9vuovUZsSEXi862veRzQYx`），全路由 cache-busted 复核 200（/、/getting-started、/components/data-display/table、/guidelines/component-design、/updates/changelog）。**生产可用；Nuxt4 成果保留在 main 与本地，待部署路径决策后上线。**

## 13. 三轮深挖（memorix embedding + git 历史 + R53/F41 原始材料）与最终方案

### 13.1 repro 既有经验（memorix #6155/#6152 + git 65c31d4/c119a0a/44051cc + R53.md）

- **R53/F41 verified**：Linux 产物 symlink 为**相对路径**（`css-tree -> .nitro/css-tree@2.3.1`，21B，可移植）；Windows 为**构建机绝对路径**（110B，换机即断，与 R22 `file://` 同族）。workspace 包被 bundle 内联、产物内无 workspace symlink。**repro 部署链走云端 Linux 构建，不经 Windows 产物，故无运行时故障。**
- **R52/F50**：Nuxt4 主 bundle buildDir 被改写为 `node_modules/.cache/nuxt/.nuxt` ⇒ content devStorage 基址错位 ⇒ 内容库空。本仓以 `buildDir:".nuxt"` 修复（与 R52 根因一致）。
- **nitropack 版本矩阵**：repro 绿 CI/Vercel 为 **Nuxt3 + nitropack 2.13.4**；2.13.5 引入 unstorage key 校验回归（R46）。**实测 nitropack 2.13.4 与 Nuxt4.6.4 的 `@nuxt/nitro-server` API 不兼容（本地 500），故 Nuxt4 不能钉 2.13.4**；Nuxt4 须用 2.13.6。
- **popper CJS**：真实 `@popperjs/core` 为 CJS，nitro 外部化时 named-export `placements` 报错；历史实证修法是 npm alias `@sxzz/popperjs-es`（ESM）。已恢复。

### 13.2 最终配置组合（本地全绿）

`nuxt 4.6.4 + nitropack 2.13.6 + buildDir:".nuxt" + popper ESM alias + externals.inline(多版本包族) + overrides dedupe(entities/source-map-js) + oxide exclude`。本地 node-server 4 路由 200、测试 12/12、`.func` symlink=0。

### 13.3 可靠部署路径（已落地 workflow，待 secrets）

新增 [`.github/workflows/deploy-vercel-prebuilt.yaml`](../../../.github/workflows/deploy-vercel-prebuilt.yaml)（**workflow_dispatch 专用，零 push 触发**，与 repro artifact-dump 同模式）：ubuntu + Node22 + pnpm12 冻结安装 → `turbo run do-build-nuxt-doc --force --concurrency=1` → 校验产物绝对 symlink=0 → `vercel deploy --prebuilt --prod`。需在仓库 Secrets 配置 `VERCEL_TOKEN/VERCEL_ORG_ID/VERCEL_PROJECT_ID` 后手动触发；并建议暂停 Vercel Git-integration 自动生产部署以避免双部署冲突。

### 13.4 结论

Nuxt4 依赖升级与本地验收**已完成**；Vercel 上线的剩余阻塞是**云端 Git 构建的 nitro/pnpm 闭包追踪回归**（非本仓配置可解），repro 亦未在其上部署过 Nuxt4（F48/F50 上游 #36792 待修复）。**合理方案 = Linux CI prebuilt 部署**（已提供 workflow），或待上游修复后恢复 Git-integration。生产当前运行 Nuxt3 良好部署，可用。

### 13.5 运行时实证：Windows 自包含产物亦不可移植（R53 结论的运行时验证）

将本地 `symlink=0` 的自包含 prebuilt 产物经 `vercel deploy --prebuilt` 上传并 promote 到生产，**仍 500**；而同一产物在本地 Windows node-server 全绿。证明 Windows 构建产物内含不可移植的构建机绝对路径（不止 symlink），**换机（Linux Vercel）即断**——与 R53「Windows 产物换机即断」的推断一致，本次为运行时实锤。**结论：Nuxt4 上 Vercel 必须在 Linux 构建**（CI prebuilt），Windows 本地产物仅用于本地 dev/preview 验收。

**落地路径（二选一，需授权）**：

- A. 启用 [`.github/workflows/deploy-vercel-prebuilt.yaml`](../../../.github/workflows/deploy-vercel-prebuilt.yaml)：配置 `VERCEL_TOKEN/VERCEL_ORG_ID/VERCEL_PROJECT_ID` secrets，并**暂停 Vercel Git-integration 自动生产部署**（否则每次 push 覆盖手动部署），手动 dispatch 上线 Nuxt4。
- B. 维持现状：生产运行 Nuxt3 良好部署；Nuxt4 保留在 main 与本地，待上游 nitro/#36792 修复后恢复 Git-integration。

**操作警示**：每次 `git push main` 都会触发 Vercel Git 自动生产部署（Nuxt4 坏产物），覆盖手动 promote 的良好部署；恢复生产后须停止 push 或暂停 Git 自动部署。本轮已多次执行 `vercel promote …b85yf03xd… --yes` 恢复 Nuxt3 保活。

## 14. 上线成功（Linux CI prebuilt + UI 链 inline）

**最终打通路径**（用户授权后落地）：

1. `vercel pull --environment=production` 取 `orgId=team_cUeGw4TtOCLp0bbuH8kA7BYH` / `projectId=prj_7cDZNStr1RclXLCFbL8OsGE3RZ68`。
2. `gh secret set VERCEL_TOKEN / VERCEL_ORG_ID / VERCEL_PROJECT_ID -R ruan-cat/eams-component-lib`（token 仅经 stdin，不落文件/记忆/日志）。
3. `vercel git disconnect --yes` 暂停 Git 自动生产部署（避免 push 覆盖）。
4. **关键最后一修**：`externals.inline` 纳入 **element-plus 及整条 UI 依赖链**（@element-plus/icons-vue、@popperjs/core、@sxzz/popperjs-es、@vueuse/core/shared、reka-ui、defu、debug、lodash-es/unified、async-validator、memoize-one、normalize-wheel-es、@ctrl/tinycolor、dayjs）。此前 element-plus 被外部化、运行时 import `@popperjs/core`(alias) 而闭包缺包致 500；全链 inline 后构建期解析依赖。
5. `gh workflow run deploy-vercel-prebuilt.yaml` → Linux 构建 + symlink 校验 + `vercel deploy --prebuilt --prod` 全绿。

**生产验收（真实 Chrome）**：`https://vec.ruan-cat.com/` 200（58068B，Nuxt4）；`/components/data-display/table` 200，el-table 1/3 行、代码面板"收起↔展开"、暗色 dark↔light、侧栏 29 链接、26 图标，交互全活。**Nuxt4 已上线生产。**

**已知 minor（cosmetic，不阻塞访问与使用）**：header logo 经 `/_ipx/_/logo.svg`、`logo-dark.svg` 404（@nuxt/image ipx 在 Vercel 对 SVG 优化失败）。后续可将 logo 改 plain `<img>` 或配置 image provider 绕过 ipx。

**复用要点**：Nuxt4 + shadcn-docs-nuxt 上 Vercel 的完整可行配方 = §0.5 配置组合 + **element-plus 全 UI 链 inline** + **Linux CI prebuilt 部署**（Git 自动部署须暂停）。Windows 本地产物仅用于 dev/preview 验收。

## 15. 无假阳性三环境复核 + nitro v3/h3 v2 API 包

**三环境独立起服务 + 真实 Chrome 交互 + console 三重验证**（排除假阳性）：

| 环境                  | 版本证据                                                                 | 交互证据                                         | console                          |
| --------------------- | ------------------------------------------------------------------------ | ------------------------------------------------ | -------------------------------- |
| dev :3000             | 日志 `Nuxt 4.6.4 (with Nitro 2.13.6, Vite 8.3.7)`；`@vite/client` 在     | el-table 1/3 行、代码面板切换、暗色切换、侧栏 29 | 零 error                         |
| preview :3210         | `.output/nitro.json` framework nuxt 4.6.4、preset node-server            | el-table 1/3 行、代码面板、暗色切换              | —                                |
| 生产 vec.ruan-cat.com | CI 从 main(Nuxt4) 部署、Git 已断开；页面体量 58068B(Nuxt4)≠Nuxt3 503672B | el-table 1/3 行、代码面板切换                    | 仅 logo `/_ipx/` 404（cosmetic） |

> entry 哈希本地与生产不同属 Linux CI 重构建的平台差异，非假阳性信号；生产身份由"CI 从 main 部署 + Git 断开 + Nuxt4 体量页面"三重认定。

**nitro v3 + h3 v2 API 包**（`packages/api`，repro 双应用架构）：`nitro 3.0.261103-rc` + `h3 2.0.8`，`serverDir:"server"` + `server/routes/health.get.ts`（`defineHandler`）。`nitro build` exit 0，`/health` 返回 `{"ok":true,"nitro":3,"h3":2}`。**项目级 nitro=v3、h3=v2 成立（验收 2/3）**；文档站保持 Nuxt4 官方运行时（nitropack2/h3v1 为 Nuxt 内置，不可替换）。

**logo 404 已修**（`63b37e8`）：`nitro.routeRules` 将 `/_ipx/_/logo.svg`、`/_ipx/_/logo-dark.svg` redirect 到静态原图；生产实测 ipx 307→/logo.svg 200，header logo 可见，零可见缺陷。

## 16. 自我批判复盘（grill-me）：激进删除→补回的返工循环

**结论：是，前期过于激进、调研草率，返工自找。** 全局技能 `init-shadcn-docs-nuxt/references/incident-repair.md:179-192,227-228` 早已写明准入/可删除条件/禁广谱 inline/entities 先查多版本，我未先完整应用就动手。

**删除→补回循环（commit 对质）**：

| 激进删除                                                      | 被迫补回                                                            | 违反的技能条款                                                     |
| ------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `58355f4` 清空 overrides+移除 shamefully-hoist                | `b321e31` 恢复 entities override；`b5ba248` 恢复 shamefully-hoist   | "每一项都应有可删除条件"；"不在没有产物级回归证据时删除运行时补丁" |
| `409a957` 删 noExternal/alias/shim；`42b0041` 删 popper alias | `99b4ab0` 恢复 popper alias；`6d99df1` 补 element-plus UI 链 inline | noExternal/inline 精确准入；popper alias 为历史实证修法            |
| `ab71b76` `inline:[/node_modules/]` 广谱内联                  | 后续收窄为精确列表                                                  | 明禁 `inline:[/.*/]` 通用解                                        |
| `5664e8c` node-linker=hoisted                                 | `99b4ab0` 回退                                                      | hoist 反模式（nuxt#13644）                                         |

**草率归因**：`1de7835`"上游阻塞"、`cbff648`"Windows 产物不可移植" 均为未穷尽单变量实验前的过早结论；真根因（element-plus 外部化 + popper alias 闭包缺包）到 `6d99df1` 才定位。Windows 产物 symlink 问题真实存在（R53），但把它当"唯一根因"而忽略闭包 inline 配套，是归因不全。

**根因（5-Why）**：返工←激进删除+广谱 workaround←未先完整读/应用技能与 repro 台账←把"配置简化"目标置于"单变量、可删除条件、产物级回归证据"纪律之上←急于交付绿信号。

**纠正纪律（固化）**：① 动手前先读技能 incident-repair + repro FINDINGS/R53；② 删除任何运行时补丁前必须有产物级回归证据，否则保留；③ noExternal/inline/trace 精确准入、单变量、每项带可删除条件；④ 禁广谱 inline/hoist 通用解；⑤ 归因前穷尽单变量实验，不提前下"上游/平台"结论。

## 17. B 对照实验：工作流去留由数据裁决（已闭环）

**实验设计（单变量）**：重连 Git-integration → 推空提交触发云端自建（main 含 element-plus inline 修复）→ 实测生产。回滚锚点 `8vw81vnfg`（CI prebuilt 良好部署）。

**结果：绿。** 云端自建 `3yogcoepp`（Duration 2m=真实云构建）生产 200；真实 Chrome：el-table 1/3 行、代码面板切换、暗色切换、侧栏 29、图标 26、**console 零 error**；logo 经 Vercel 自带 `/_vercel/image?url=%2Flogo.svg` 正常加载（`naturalWidth>0`）——**Git-integration 下 @nuxt/image 走 Vercel image provider，ipx 404 不复存在**。

**裁决**：inline 修复后云端自建可靠 → **prebuilt 工作流属过度设计，删除**（`eb1c5f5`），恢复 Git-integration 自动部署（push 即部署，最简）。删除后生产复测 200。`VERCEL_*` secrets 保留备用。

**修正先前结论**：§14/§16 中"云端构建不可靠/必须 Linux CI prebuilt"的表述**作废**——那是 inline 修复前的观测；根因（element-plus 外部化+popper alias 闭包）修复后，Git-integration 云端自建与本地/CI 产物一致可靠。Windows 产物 symlink 不可移植（R53）仍成立，但只影响"本地 Windows 产物直接上传"，不影响云端 Linux 自建。

**最终部署形态**：Git-integration 自动部署（push main → Vercel 云端 Linux 自建 → 生产）。配置最简：无 prebuilt 工作流、无 node-linker/hoist、无广谱 inline；仅 §0.5 精确 inline 列表 + dedupe overrides + buildDir + popper alias + oxide exclude + logo routeRules（本地 ipx 回退用）。

## 18. 绕远路误区专记：误归因→过度设计部署通道→对照实验删除

与 §16 互补：§16 记**配置层**返工（激进删除→补回），本节记**部署架构层**返工（过度设计 workflow→删除）。两者同根：过早结论 + 跳过单变量纪律。memorix 专条 **#6268**（topic: `nuxt4/deployment-detour-lesson`）。

### 18.1 误区时间线

| 阶段 | 动作/结论                                                                             | commit/出处              | 问题                                                                                          |
| ---- | ------------------------------------------------------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------- |
| 1    | 云端 Git 构建 500：ERR_MODULE_NOT_FOUND ufo→hookable→@popperjs/core                   | —                        | 症状是闭包缺包，指向**配置**（externals/inline），不指向通道                                  |
| 2    | 过早归因「上游阻塞」                                                                  | `1de7835`                | 未穷尽单变量实验                                                                              |
| 3    | 把 R53「Windows 产物不可移植」当云端 500 唯一根因                                     | `cbff648`、§13.5         | R53 适用面仅「本地 Windows 产物直接上传」；云端 Linux 自建不经 Windows 产物——两个故障面被混淆 |
| 4    | 过度设计：dispatch-only prebuilt workflow + git disconnect + 3 secrets + symlink 校验 | `e8eead0`                | 用整套平行部署基础设施绕一个配置问题；push 即部署退化为手动 dispatch                          |
| 5    | 真修复仅一项精确配置：element-plus 及整条 UI 链 inline                                | `6d99df1`                | 闭包缺包消失                                                                                  |
| 6    | 把 CI prebuilt 绿归因于「通道可靠」                                                   | §14                      | **混淆变量**：修复与通道切换同时落地，成功不能归因于通道                                      |
| 7    | B 单变量对照：重连 Git、inline 不变、空提交触发云端自建                               | `1dfccdd`→`3yogcoepp` 绿 | 隔离通道变量 ⇒ 云端自建同样可靠                                                               |
| 8    | 删 workflow、恢复 Git 自动部署                                                        | `eb1c5f5`、§17           | 过度设计清除，回归最简                                                                        |

### 18.2 最隐蔽的一步：混淆变量

当时 CI prebuilt 绿其实是 **inline 修复**的功劳，但因为它发生在**新通道**上，就被误认为通道是原因——等于「同时吃两种药把病治好，却归功于第二种」。B 实验是补做的归因对照：inline 修复保持不变、只换通道变量，结果绿 ⇒ 通道不是原因。**修复与基础设施变更同时落地时，成功归因无效**；必须补单变量对照，再决定基础设施去留。

### 18.3 成本账

- 加了又删：1 个 workflow（`e8eead0`→`eb1c5f5`）、git disconnect→reconnect、多次手动 dispatch/promote；secrets 保留备用。
- 生产通道 push 即部署→手动 dispatch→push 即部署；期间每次 push 都须防覆盖（§13.5 操作警示即过度设计的产物）。
- 同一根因产出三版 serial 作废结论（§13.4 上游阻塞→§13.5 Windows 唯一根因→§14 必须 CI prebuilt）——过早结论的代价是串行返工。

### 18.4 可复用纪律（其他项目同样适用）

1. **配置优先、通道最后**：构建/运行时 500 先穷尽配置级单变量实验（externals/inline/alias/overrides）；基础设施（CI workflow、换通道、换平台）是最后手段，不是第一手段。
2. **修复与基础设施同时落地 ⇒ 归因无效**，补对照再定去留（§18.2）。
3. **「云端/平台/上游不可靠」结论须对照实验支撑**；平台性事实限定适用面（R53 不泛化到云端自建）。
4. **每加一层写明可删除条件**：本例 workflow 的可删除条件 =「含 inline 修复的云端自建绿」，B 实验命中即删。
5. **动手前交叉核对技能与台账**：技能 incident-repair 早已写明 inline 精确准入、禁广谱 workaround；repro 台账早已限定 R53 适用面——先读可避免大部分绕路。

### 18.5 证据索引

- commits：`1de7835`/`cbff648`（过早结论）、`e8eead0`（workflow 新增）、`6d99df1`（inline 真修复）、`1dfccdd`（B 触发）、`eb1c5f5`（workflow 删除）、`22ce69c`（§17 裁决）。
- memorix：#6266（配置层返工）、#6267（B 裁决）、**#6268（本绕远路误区）**。
- §13.4/§13.5/§14 保留作废老结论作反面教材；现行态以 §17 与本节为准。

## 19. traceInclude 方案作废裁决与免 hack 依赖配置终态（2026-11-12 用户质询补录）

### 19.1 traceInclude 已过时且错误：实机证伪 + 机理错配

- **实机证伪**（技能 init-shadcn-docs-nuxt 1.9.0 `dependency-triage.md` §6.3，2026-09-05 Vercel linux 生产）：nitro 在 pnpm 下把 traceInclude 包名 resolve 成 `<pkg>/sharp` 伪路径交给 `@vercel/nft`，nft 对不存在文件抛硬错误 → 构建失败。且该分支**仅非 win32 生效**，Windows 本地构建永远走不到——跨平台构建分支必须在目标平台实测后才能合入。
- **机理错配**：traceInclude 只往 NFT trace 加路径，**不改变 nitro 外部化决策**。Nuxt4 云端 500 的真根因是 element-plus 外部化 + popper alias 运行时 import 闭包缺包（§14，`6d99df1`）；多版本 Windows 绝对 symlink 由 overrides dedupe 源头消除（§12.2）。这两个故障面 traceInclude 都解决不了：加 trace 路径救不了「外部化包的运行时 import」，也消不掉 linkPackage symlink。
- **历史定位**：traceInclude 与 `isWindows ? trace:false` 同属历史 workaround 族——后者已被 inline 替换（CHANGELOG `213d8d5`），前者被实机证伪作废。**现行 eams `nuxt.config.ts` 无任何 traceInclude**（仅 `traceOptions.exportsOnly:false`，:122）。

### 19.2 报告与 memorix 的成熟方案（质询回答）

- **报告已有成熟方案**：§0.5 配置配方 + §12.2 产物级修法（inline 多版本包族 + dedupe 闭包 symlink 归零）+ §14/§17 终态（Git-integration 云端自建）。本节补 traceInclude 的显式作废登记。
- **memorix 已有正式方案**：#6262（配置矩阵与配方）、#6267/#6268（通道裁决与绕远路误区）、**#6270（traceInclude 作废专条）**；#6261–6264 的中间结论已于 2026-11-12 作废标注。
- **技能已固化**：`nuxt4-upgrade.md` §5/§6（dedupe + 条件 inline 配方）、`dependency-triage.md` §6.3（traceInclude 禁用铁律）、SKILL.md 事故 #22。

### 19.3 优雅、免 hack 的依赖配置终态

1. **默认最小**：不消费 element-plus 的文档站完全不配 `nitro.externals`（技能禁改项）。
2. **条件精确准入**：消费 element-plus 的文档站用 §0.5 / `nuxt4-upgrade.md` §6 精确 inline 列表，每项带可删除条件；上游 NFT pnpm isolated 追踪修复（nuxt#13644 家族）后凭产物级回归证据整表退役——inline 是「有证据、可删除的精确准入」，不是盲 hack。
3. **源头消多版本**：overrides dedupe `entities`/`source-map-js`（pnpm 12 写 pnpm-workspace.yaml），linkPackage 不再产绝对 symlink——属配置治理，非运行时补丁。
4. **世代与对象作用域**：`buildDir:".nuxt"`（F50）、popper ESM alias（manifest 声明）、oxide 双 exclude（dev）、ogImage disabled、compatibilityDate 按对象分域。
5. **四禁**：`trace:false`、`traceInclude`、hoist/shamefully-hoist、广谱 inline——均有实机证伪或反模式证据。
6. **通道终态**：Git-integration push 即部署（§17）；Windows 产物仅本地 dev/preview 验收（R53 适用面）。

**一句话回答**：traceInclude 已作废；成熟方案在报告 §0.5/§12.2/§17、memorix #6262/#6267/#6268/#6270、技能 1.9.0；免 hack 的本质 = 默认最小 + 条件精确准入 + 源头 dedupe + 可删除条件，而不是堆 trace 补丁。

### 19.4 证据索引

- 技能 `dependency-triage.md` §6.3（2026-09-05 实机证伪）、SKILL.md 事故 #22；CHANGELOG `213d8d5`（inline 替换 trace:false）；eams `nuxt.config.ts:122`（现状无 traceInclude）。
- memorix #6270（traceInclude 作废专条）；报告 §12.2/§14/§17/§18。
