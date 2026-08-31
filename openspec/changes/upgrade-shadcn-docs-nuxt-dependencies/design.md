## Context

`packages/vue-element-cui-nuxt` 是 pnpm monorepo 中的 Nuxt 3 文档站。现有配置是在历史构建故障中逐步叠加形成的：workspace source alias、宽 `vite.ssr.noExternal`、宽 `nitro.externals.inline` 和 Windows 无条件 `trace:false` 同时存在；依赖则通过 `^` 范围解析，导致 `nuxt-og-image@5.1.13`、`@nuxt/kit@4.4.2` 和两代 `@nuxtjs/mdc` 混入 Nuxt 3 链路。用户要求以最新 `init-shadcn-docs-nuxt` 指导统一处理，并保留现有内容目录与真实组件 demo。

## Goals / Non-Goals

**Goals**

- 让文档包与锁文件形成可解释、可复现的 Nuxt 3 保守运行时闭包。
- 将兼容配置按首个失败门收敛，避免用宽 externalization 掩盖缺包或 OOM。
- 保留 document-driven Content prerender、Lucide 图标和现有信息架构/真实 demo。
- 标准化 MDC 与 Prettier 防护，提供可自动重复运行的语法检查。
- 形成 Windows、本地 Linux CI、`.output`、HTTP 和 Vercel 的分层证据记录。

**Non-Goals**

- 不迁移到 Nuxt 4，不重排内容信息架构，不重写组件库业务行为。
- 不启用 OG Image，不恢复 `routes.clear()` 或无条件关闭 NFT trace。
- 不修改用户已有的 `docs/prompts/index.md`，不凭本地结果宣称 Vercel 已通过。

## Decisions

### 1. 依赖基线与覆盖

文档包直接固定 `shadcn-docs-nuxt: 1.1.9`、`@ztl-uwu/nuxt-content: 2.13.9`、`nuxt: 3.21.2`、`h3: 1.15.11`；根 `package.json` 的 `pnpm.overrides` 固定 `nuxt-og-image: 5.1.9`。`vue`、`vue-router`、Tailwind 和组件库依赖保留现有兼容范围，避免无关升级。fresh install 后以 `pnpm why` 复核 `@nuxt/kit`、H3、MDC 与 OG Image 实际树；允许 shadcn 传递的 `@nuxt/kit@4.x` 工具包存在，但运行时必须保持 Nuxt 3/H3 v1。
组件库的 `tsdown@0.3.1` 当前 manifest 声明 `rolldown: nightly`，而公开 registry 无该版本；根 `pnpm.overrides` 额外以 `tsdown@0.3.1>rolldown: 1.0.0-beta.13-commit.024b632` 固定到锁文件中已验证的发布快照，避免 workspace fresh install 在无关的构建工具解析阶段阻断。该覆盖只匹配 tsdown，不影响 Nuxt/Vite 的 rolldown 版本。文档包仍显式声明 `entities: ^7.0.1`，因为 Vercel runtime 会由 `@vue/compiler-core` 直接加载 `entities/decode`，根 override 不能替代部署包 manifest。

### 2. 配置边界

保留 `extends`、单语 i18n、Content highlight、Icon lucide server bundle、Tailwind 对主题包的扫描和 `ogImage.enabled=false`。workspace alias 只在 `NODE_ENV=development` 且 `SHADCN_DOCS_USE_WORKSPACE_SOURCE=1` 时启用；生产默认返回空 alias。删除无证据的宽 `noExternal`/`inline`，仅保留 debug shim 的窄 `noExternal`；Vercel `entities/decode` 缺口已通过 manifest 显式依赖与多次远端对照确认仍未闭合，暂不把无效白名单固化。Windows trace workaround 改为 `SHADCN_DOCS_SKIP_NFT_TRACE=1` 显式开关，Linux/Vercel 保持默认 trace；Content prerender 不清空路由。

### 3. 脚本与部署

`predev`、`prebuild`、`postinstall` 统一执行 `nuxt prepare`。本仓库已有 Vercel/Turbo artifact 链，因此保留 `build`/`build:docs` → `pnpm run build:vercel`，由 `build:vercel` 负责 `--preset vercel` 与 `move-vercel-output-to-root`；不把提高 Node 堆上限当作依赖修复。`std-env` 作为文档配置的显式平台检测依赖保留，仅用于 Windows NFT opt-in 判断。由于 Vercel 以仓库根 manifest 生成函数闭包，root `package.json` 也显式声明 `entities: ^7.0.1`，与文档包声明共同保证 `@vue/compiler-core` 的 `entities/decode` 可追踪。Turbo outputs 补齐实际 `.output` 产物，只有诊断 cache 冲突时才使用 `--force`。

### 4. MDC 与样式

不改变现有 `content/` 层级，只校准 demo 容器语法。所有 demo 页面使用标准 `::demo-playground` + frontmatter + `#preview`/`#code`，并通过 `.prettierignore` 与 override 双保险防止格式化破坏。Tailwind 保持 `../../node_modules/shadcn-docs-nuxt` 扫描和现有 CSS 变量格式。

## Verification Strategy

1. 记录基线与工作区脏文件；创建 `agent-progress.md`/`agent-findings.md`。
2. 清理文档包依赖后执行 fresh install，检查锁文件和 `pnpm why`。
3. 单独执行 `nuxt prepare`，再在 Windows 单进程运行 `nuxi build`，保留日志/产物/退出码。
4. 在 Linux CI 使用 frozen install、prepare、build；不把 Windows workaround 泄漏到 CI。
5. 启动 `.output/server/index.mjs`，请求首页、组件页、Content cache/search API，记录响应体非空和 console 错误。
6. 如有 Vercel 项目与凭据，重复部署包构建/启动/HTTP smoke；否则报告外部门禁与下一步命令。

## Risks / Mitigations

- H3/Content 版本固定后可能暴露真实 API 不兼容：先以 `pnpm why` 和 prepare/build 首个失败门定位，不扩大 alias。
- 删除宽 inline 可能暴露 Element Plus runtime 缺口：仅在 `.output` 启动 + HTTP 请求复现后添加精确 manifest/入口修正。
- Windows NFT trace 仍可能长尾：先按技能记录阶段产物和资源，再临时使用显式环境变量；Linux/Vercel 必须独立验证。
- Vercel 凭据属于外部权限：不具备时只交付本地/CI 证据和可复现部署命令。
