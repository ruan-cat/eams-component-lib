## Why

`packages/vue-element-cui-nuxt` 当前虽然能够启动，但 fresh 解析树已经出现 Nuxt 3/Nuxt 4 混杂：`nuxt-og-image` 未锁定到 Nuxt 3 兼容版本、`@nuxt/kit` 与 `@nuxtjs/mdc` 存在多代并存，同时 Nuxt 配置用宽 source alias、`noExternal` 和 Nitro inline 清单掩盖生产闭包风险。现在需要依据最新 `init-shadcn-docs-nuxt` 规范收敛依赖与配置，并用跨平台构建、产物启动、真实 HTTP 与 Vercel 证据把问题闭环。

## What Changes

- **BREAKING** 将文档站核心运行时依赖固定到 Nuxt 3 保守兼容基线：`shadcn-docs-nuxt@1.1.9`、`@ztl-uwu/nuxt-content@2.13.9`、`nuxt@3.21.2`、`h3@1.15.11`，并通过根 `pnpm.overrides` 固定 `nuxt-og-image@5.1.9`。
- 增加精确的 `tsdown@0.3.1>rolldown` 发布版本覆盖，消除当前 `rolldown@nightly` 无法从 registry 解析导致的 workspace fresh install 阻断。
- **BREAKING** 删除无 exact error 证据支撑的宽 workspace source alias、`vite.ssr.noExternal` 和 `nitro.externals.inline`，仅保留可复现错误对应的窄兼容入口；Windows NFT trace 改为显式 opt-in workaround。
- 统一 `nuxt prepare` 生命周期脚本、Tailwind 扫描范围和 Nuxt Icon 集合配置，保持 document-driven Content prerender，不使用 `routes.clear()` 历史 workaround。
- 将全部内容页的 MDC 用法校准为标准 `::demo-playground` 容器、frontmatter、`#preview`/`#code` slots，并建立 Prettier 双保险和自动扫描测试。
- 新增可恢复的 OpenSpec checkpoint 状态记录，按 fresh install → why → prepare → Windows/Linux build → artifact startup → HTTP smoke → Vercel 顺序验收；外部凭据不可用时明确披露边界。

## Capabilities

### New Capabilities

- `shadcn-docs-runtime-baseline`: 固定 Nuxt 3 文档站运行时依赖世代、生产依赖闭包和统一脚本配置。
- `shadcn-docs-config-hardening`: 收敛 alias、SSR externalization、Nitro trace/prerender、Tailwind 与 Icon 配置，按证据启用兼容补丁。
- `shadcn-docs-mdc-standardization`: 标准化内容页 MDC 容器语法并提供 Prettier 防护与自动验证。
- `shadcn-docs-cross-platform-verification`: 建立跨平台安装、构建、产物启动、HTTP 和部署证据矩阵。

### Modified Capabilities

无（仓库当前没有主 `openspec/specs/` 能力规范；本变更新建能力契约）。

## Impact

- 代码与配置：`packages/vue-element-cui-nuxt/package.json`、`nuxt.config.ts`、`tailwind.config.js`、`workspace-aliases.ts`、Prettier 配置、`content/**/*.md`、测试文件及相关 CI/Turbo 配置。
- 锁文件：根 `pnpm-lock.yaml` 将发生依赖解析变化，必须在 fresh install 后提交。
- 运行时：Nuxt Content cache/search、MDC 渲染、`.output/server/index.mjs` 启动及 Vercel Nitro preset。
- 现有 `docs/prompts/index.md` 的用户未提交修改不属于本变更，必须保持不变。
