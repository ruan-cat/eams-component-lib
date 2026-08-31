## Why

本变更是父任务 `upgrade-shadcn-docs-nuxt-dependencies` 的专项子任务，不是新的独立产品需求。父任务已完成 Nuxt 3 依赖基线与配置收敛，但真实 Vercel 预览请求仍在函数启动阶段报 `Cannot find module 'entities/decode'`；必须把 Vercel/Nitro 生产 artifact 的 runtime closure 单独拆出，才能继续验证而不重新扩大父任务的依赖白名单。

错误链为 `@vue/compiler-core` 的 Vue 模板编译器 CJS 入口 → `entities/decode` HTML entity 解码子路径。Nuxt Content/MDC SSR 会触发这条通用 Vue 编译链，但现有证据指向 Vercel 产物追踪/外部化闭包缺口，而不是 Markdown 内容语法错误。

## What Changes

- **BREAKING** 明确 Vercel Git/CLI 构建的 Root Directory、Turbo artifact 搬运、Nitro functions 入口与 runtime manifest 的单一口径。
- 以可复现的 Vercel Linux 构建产物为对象，定位 `entities/decode` 首个失败门，区分 Vite SSR transform、Nitro inline、NFT trace、函数 package manifest 和运行时启动阶段的职责。
- 设计并验证最小 runtime closure 修复（优先 manifest/产物边界，只有 exact error 证据支持时才引入窄 inline 或 noExternal），禁止恢复整族依赖白名单。
- 在当前 commit 经过 GitHub Actions Linux、Vercel Git Integration、`.output`/functions 启动和真实 HTTP smoke 后，使用 agent-browser 完成页面、Content API、console/hydration 与交互验收。
- 将旧生产域名、候选预览部署和当前 commit 的证据分开记录；任何 READY 无 HTTP 证据不得标记完成。

## Parent Task Relationship

- Parent change: `openspec/changes/upgrade-shadcn-docs-nuxt-dependencies/`
- Relationship: 本 change 是父 change 的 Vercel/Nitro runtime closure 子任务；父 change 的依赖世代、MDC 标准和配置减法是本 change 的前置条件与不可回退边界。
- Scope rule: 本 change 不重新设计 Nuxt Content 依赖基线，不重排文档内容，不恢复父 change 已删除的宽 externalization；若需要升级 Nuxt/Content 世代，必须另行记录架构决策。

## Capabilities

### New Capabilities

- `vercel-nitro-runtime-closure`: 保障 Vercel/Nitro functions 产物能够在远端运行时解析全部直接依赖并通过 HTTP smoke。
- `vercel-artifact-e2e-verification`: 建立 Git/CI/Vercel/agent-browser 的端到端证据链，区分构建成功与运行时成功。

### Modified Capabilities

无。

## Impact

- 受影响文件：`packages/vue-element-cui-nuxt/nuxt.config.ts`、文档包/root `package.json`、`pnpm-lock.yaml`、Turbo 配置、Vercel 项目设置和 OpenSpec 证据文件。
- 外部系统：GitHub Actions、Vercel Project `vue-element-cui-nuxt-doc`、预览/生产 URL、agent-browser 可见浏览器会话。
- 当前父 change 的用户已有 `docs/prompts/index.md` 修改必须保持不变。
