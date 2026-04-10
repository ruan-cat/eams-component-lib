# 现代组件库展示仓

本项目是一个面向开源展示与求职叙事的前端组件库 monorepo。

## Memorix MCP

- 如果当前会话暴露了 `mcp__memorix__*` 工具，在开始实施前优先使用 Memorix。
- 优先为当前工作区启动或刷新 Memorix 会话上下文，并加载近期上下文或执行与当前任务相关的项目内搜索。
- 如果本次会话没有暴露 Memorix MCP，不要把它理解成“项目没有历史”，而应把它视为当前环境缺少该能力。
- 在识别项目身份时，优先使用当前工作区根目录和当前 Git 状态，不要再依赖旧的嵌套路径。

## 项目术语

- `组件库`：`packages\\vue-element-cui\\package.json` 对应的现代 Vue 3 组件库。
- `组件库文档站`：`packages\\vue-element-cui-nuxt\\package.json` 对应的展示站与文档站。
- `旧组件库`：`old\\vue-element-cui\\package.json` 对应的 Vue 2 历史实现，仅用于迁移对照，不参与当前主链路开发。
- `仓库根`：当前 Git 根目录，同时也是唯一的 `pnpm workspace` 根目录；项目中已经不存在旧的嵌套 monorepo 目录层。

## 当前约束

- 本地 Git 只保留 `main` 分支，不再维护旧业务分支。
- 旧云效 remote 已断开；后续新增 remote 时不要破坏现有 tag。
- 现有 git tag 需要继续保留；如后续接入 GitHub，新 remote 需要显式推送 tag。
- `lint-staged.config.js` 保持当前的精细过滤策略，优先保障性能。
- `simple-git-hooks.mjs` 必须保持根目录简模式，禁止再使用切入旧嵌套目录的历史写法。
- `old/vue-element-cui` 必须保留，作为旧组件库迁移到现代架构的证据链。
- **禁止在 `nuxt.config.ts` 中使用 `nitro.externals.trace = false`**——它会导致 Vercel 云函数产物缺失运行时依赖。需要绕开 Windows + pnpm workspace 的 `@vercel/nft` 卡死时，用 `nitro.externals.inline = [/.*/]` 代替，让 Rollup 将全部依赖内联进 server bundle。对 `nitro.externals` 的任何改动，必须在构建后检查 `__fallback.func/` 目录结构确认产物完整性。

## 主动澄清

当需求存在边界不清、实现路径冲突、删除范围不明确时，应先澄清再动手。默认优先保护：

- git tag
- `old/vue-element-cui`
- `packages/vue-element-cui`
- `packages/vue-element-cui-nuxt`

## 测试规范

- 使用 `vitest` 编写测试。
- 测试文件命名为 `*.test.ts`。
- 测试目录优先放在 `tests/` 或 `src/tests/`。

## 报告规范

- 报告默认写入 `docs/reports/`。
- 文件名使用 `YYYY-MM-DD-<topic>.md`。
- 默认使用简体中文。

## 发版日志规范

- 使用 `pnpm dlx @changesets/cli add --empty` 新建 changeset。
- changeset 文件名应改成带日期和语义的名字。
- 发版说明围绕组件库、文档站和工程化设施展开，不再描述旧业务应用。
