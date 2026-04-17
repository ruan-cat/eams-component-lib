## v2.0.1

[compare changes](https://github.com/ruan-cat/eams-component-lib/compare/v2.0.1-beta.1...v2.0.1)

## v2.0.1-beta.1

[compare changes](https://github.com/ruan-cat/eams-component-lib/compare/v2.0.0...v2.0.1-beta.1)

### 📖 Documentation

- **release:** 同步新版发版约定说明 ([20aec5c](https://github.com/ruan-cat/eams-component-lib/commit/20aec5c))

### 🤖 CI

- **release:** 校正根级 changelog 来源注释 ([110692e](https://github.com/ruan-cat/eams-component-lib/commit/110692e))

### 🔧 更新配置

- **release:** ⚠️ 收敛根包发版推送语义 ([32eed80](https://github.com/ruan-cat/eams-component-lib/commit/32eed80))

#### ⚠️ Breaking Changes

- **release:** ⚠️ 收敛根包发版推送语义 ([32eed80](https://github.com/ruan-cat/eams-component-lib/commit/32eed80))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## v2.0.0

[compare changes](https://github.com/ruan-cat/eams-component-lib/compare/v1.0.8...v2.0.0)

### ✨ 新增功能

- **vercel:** 接入 Nuxt 文档站 monorepo Vercel 构建链路与产物回迁 ([1ccfbaa](https://github.com/ruan-cat/eams-component-lib/commit/1ccfbaa))

### 🐞 修复缺陷

- **nuxt-doc:** 为 Vercel 与 Cloudflare 拆分 Nitro compatibilityDate ([52ba0cf](https://github.com/ruan-cat/eams-component-lib/commit/52ba0cf))
- **nuxt-doc:** 用 inline 替换 trace:false 修复 Vercel 云函数依赖缺失 ([213d8d5](https://github.com/ruan-cat/eams-component-lib/commit/213d8d5))
- **nuxt-doc:** 移除 nitro externals.inline 修复 Vercel 运行时模块缺失 ([aab4edb](https://github.com/ruan-cat/eams-component-lib/commit/aab4edb))
- **nuxt-doc:** 显式声明 entities 依赖修复 Vercel 云函数模块缺失 ([211c662](https://github.com/ruan-cat/eams-component-lib/commit/211c662))
- **nuxt-doc:** 按平台区分 Nitro externals 并定点内联依赖 ([6d6061a](https://github.com/ruan-cat/eams-component-lib/commit/6d6061a))
- **nuxt-doc:** 通过 vite ssr.noExternal 修复 Vercel 云函数 @vueuse/core 模块缺失 ([159fabd](https://github.com/ruan-cat/eams-component-lib/commit/159fabd))
- **nuxt-doc:** 恢复预渲染修复生产环境 content 数据库为空 ([8d91882](https://github.com/ruan-cat/eams-component-lib/commit/8d91882))
- **cui-dialog:** 为 el-dialog 显式设置 append-to-body，修复遮罩层失效 ([c86237c](https://github.com/ruan-cat/eams-component-lib/commit/c86237c))
- **vue-element-cui-nuxt:** 修正文档站 GitHub 仓库跳转地址 ([d33eac7](https://github.com/ruan-cat/eams-component-lib/commit/d33eac7))

### 📖 Documentation

- **readme:** 收敛 monorepo 开发命令示例 ([1d8a5f5](https://github.com/ruan-cat/eams-component-lib/commit/1d8a5f5))
- **prompts:** 补充 Nuxt 文档站部署到 Vercel 的提示词条目 ([c2fe7ae](https://github.com/ruan-cat/eams-component-lib/commit/c2fe7ae))
- **memory:** 记录 Vercel 云函数依赖缺失事故经验 ([07d935c](https://github.com/ruan-cat/eams-component-lib/commit/07d935c))
- **vercel:** 补充 Nitro/Vercel entities 事故复盘与 CLAUDE 约束 ([c2c922d](https://github.com/ruan-cat/eams-component-lib/commit/c2c922d))
- **skills:** 补充 pnpm monorepo 幽灵依赖排错案例 ([1b7778f](https://github.com/ruan-cat/eams-component-lib/commit/1b7778f))
- **skills:** 补充 Vercel SSR 中 @vueuse/core 缺失事故复盘 ([c6b7eed](https://github.com/ruan-cat/eams-component-lib/commit/c6b7eed))
- **skills:** 补充 Nuxt Content 文档站 Vercel 生产环境连锁故障总复盘 ([77fd027](https://github.com/ruan-cat/eams-component-lib/commit/77fd027))
- 在 README 中补充线上文档站地址 ([9a60c6d](https://github.com/ruan-cat/eams-component-lib/commit/9a60c6d))
- 在 record-bug-fix-memory SKILL 中记录 CuiDialog 遮罩失效排错经验 ([4101c2c](https://github.com/ruan-cat/eams-component-lib/commit/4101c2c))
- **resume:** 新增 Dialog 遮罩层故障排查简历叙事素材 ([1087339](https://github.com/ruan-cat/eams-component-lib/commit/1087339))
- **resume:** 调整面试故事命名并清理过期报表备份 ([f19dc5d](https://github.com/ruan-cat/eams-component-lib/commit/f19dc5d))
- 新增 tsdown 构建事故面试叙事稿 ([f6e0d73](https://github.com/ruan-cat/eams-component-lib/commit/f6e0d73))
- **prompts:** 将 004 TODO 标记为已完成 ([fa4589f](https://github.com/ruan-cat/eams-component-lib/commit/fa4589f))
- **release:** 同步新版发版命令说明 ([f60a06e](https://github.com/ruan-cat/eams-component-lib/commit/f60a06e))

### 🔨 构建相关

- **monorepo:** ⚠️ 用 Turbo 统一 CI 与文档构建调度 ([5e710e0](https://github.com/ruan-cat/eams-component-lib/commit/5e710e0))

### 🏡 Chore

- **vue-element-cui-nuxt:** 为 package.json 添加 homepage 字段 ([e7d3c22](https://github.com/ruan-cat/eams-component-lib/commit/e7d3c22))

### ✅ Tests

- **vue-element-cui-nuxt:** 补充仓库链接配置回归测试 ([fab6af1](https://github.com/ruan-cat/eams-component-lib/commit/fab6af1))

### 🤖 CI

- **release:** 对齐根级 changelog 标题解析 ([e0c37d8](https://github.com/ruan-cat/eams-component-lib/commit/e0c37d8))

### 🔧 更新配置

- **memorix:** 统一多客户端 Memorix 钩子与 AI 指引配置 ([e39d7db](https://github.com/ruan-cat/eams-component-lib/commit/e39d7db))
- **gitignore:** 忽略 Cursor MCP 本地配置文件 ([46c86f9](https://github.com/ruan-cat/eams-component-lib/commit/46c86f9))
- 在根 package.json 中新增 homepage 字段 ([2a39616](https://github.com/ruan-cat/eams-component-lib/commit/2a39616))
- **release:** ⚠️ 移除旧根级发版链路 ([5d59c67](https://github.com/ruan-cat/eams-component-lib/commit/5d59c67))

#### ⚠️ Breaking Changes

- **monorepo:** ⚠️ 用 Turbo 统一 CI 与文档构建调度 ([5e710e0](https://github.com/ruan-cat/eams-component-lib/commit/5e710e0))
- **release:** ⚠️ 移除旧根级发版链路 ([5d59c67](https://github.com/ruan-cat/eams-component-lib/commit/5d59c67))

### ❤️ Contributors

- Ruan-cat <1219043956@qq.com>

## [1.0.8](https://github.com/ruan-cat/eams-component-lib/compare/v1.0.7...v1.0.8) (2026-04-09)

- 🦄 refactor(release)!: 调整包级 README 的发版触发标记 ([7e16b6e](https://github.com/ruan-cat/eams-component-lib/commit/7e16b6ef72ccc7b77e080bf6abe99639327d4298))

### BREAKING CHANGES

- 包级 README 中用于人工触发发版的注释标记已从旧的 `<!-- TODO: 故意触发发版 -->` 调整为 `<!-- TODO: 故意触发发版 1 -->`；依赖旧注释文本做脚本匹配或人工约定的流程需要同步更新。

## [1.0.7](https://github.com/ruan-cat/eams-component-lib/compare/v1.0.6...v1.0.7) (2026-04-09)

## [1.0.6](https://github.com/ruan-cat/eams-component-lib/compare/v1.0.5...v1.0.6) (2026-04-09)

- 🔨 build(release)!: 对齐 01s 的 relizy 与 bumpp 配置 ([58d41cb](https://github.com/ruan-cat/eams-component-lib/commit/58d41cbfb67db55b434ca0c1e8bb8d7294531df4))

### BREAKING CHANGES

- 根包发版命令集已切换为 01s 风格，原有 release:relizy、release:changelog 等命名不再保留，changelogithub.config.ts 现恢复为 .ts 扩展导入并依赖 allowImportingTsExtensions。

## [1.0.5](https://github.com/ruan-cat/eams-component-lib/compare/v1.0.4...v1.0.5) (2026-04-09)

## [1.0.4](https://github.com/ruan-cat/eams-component-lib/compare/v1.0.3...v1.0.4) (2026-04-09)

## [1.0.3](https://github.com/ruan-cat/eams-component-lib/compare/v1.0.2...v1.0.3) (2026-04-09)

## 1.0.2 (2026-04-09)

- ﻿🔨 build(release)!: 对齐 relizy 与 bumpp 的双轨发布流程 ([7cf793e](https://github.com/ruan-cat/eams-component-lib/commit/7cf793ee6b47bdfb57dacafb01b25cad949b3c62))
- ﻿🔨 build(release)!: 切换仓库级 relizy 发版工具链 ([493ee0f](https://github.com/ruan-cat/eams-component-lib/commit/493ee0fd0aee726bd0d18b9bde41252cafe123c6))
- 🦄 refactor(repo)!: 重命名 legacy 包并清理旧 hello-world tag ([95c0673](https://github.com/ruan-cat/eams-component-lib/commit/95c0673a5317733d3888f985d214bd8e3e5b15c5))

### BREAKING CHANGES

- 根仓 release 命令从单一路径 relizy 发版切换为 relizy 子包发版 + bumpp 根级发版 + follow-tags 推送的双轨流程；发布工作流不再使用 changelogithub 生成 Release。
- 根级 release 命令不再执行 changeset publish，改为使用 relizy 生成 CHANGELOG、release commit 与未来的 v\* tag，且不再通过该命令发布 npm 包。
- old/vue-element-cui 的包名已从 hello-world 改为 @eams-monorepo/vue-element-cui-legacy，且本地 hello-world@\* tag 已被移除；任何仍引用旧包名或旧 tag 的文档、脚本与发布说明都需要同步调整。

# Changelog

**Multiple Packages Updated** - 2026-04-09

## @eams-monorepo/vue-element-cui@3.0.0 (2026-04-09)

[compare changes](https://github.com/ruan-cat/eams-component-lib/compare/@eams-monorepo/vue-element-cui@2.0.1...@eams-monorepo/vue-element-cui@3.0.0)

### 🐞 修复缺陷

- **tsc,vue-element-cui:** 解决配置故障。移除掉过时的 baseUrl 配置。 ([a663563](https://github.com/ruan-cat/eams-component-lib/commit/a663563))

### 🦄 代码重构

- **release:** ⚠️ 调整包级 README 的发版触发标记 ([7e16b6e](https://github.com/ruan-cat/eams-component-lib/commit/7e16b6e))

  统一更新组件库与文档站 README 里的故意触发发版标记，避免继续沿用旧的占位写法。
  这次变更将包级 README 的发版触发注释收敛到新的编号形式，方便后续按文档变更继续触发版本流程。
  BREAKING CHANGE: 包级 README 中用于人工触发发版的注释标记已从旧的 `<!-- TODO: 故意触发发版 -->` 调整为 `<!-- TODO: 故意触发发版 1 -->`；依赖旧注释文本做脚本匹配或人工约定的流程需要同步更新。

### 🔧 更新配置

- **package.json,vue-element-cui-nuxt:** ⚠️ 移除保守的私包配置，避免出现无法生成版本号的情况。 ([fac697d](https://github.com/ruan-cat/eams-component-lib/commit/fac697d))

#### ⚠️ Breaking Changes

- **release:** ⚠️ 调整包级 README 的发版触发标记 ([7e16b6e](https://github.com/ruan-cat/eams-component-lib/commit/7e16b6e))

  统一更新组件库与文档站 README 里的故意触发发版标记，避免继续沿用旧的占位写法。
  这次变更将包级 README 的发版触发注释收敛到新的编号形式，方便后续按文档变更继续触发版本流程。
  BREAKING CHANGE: 包级 README 中用于人工触发发版的注释标记已从旧的 `<!-- TODO: 故意触发发版 -->` 调整为 `<!-- TODO: 故意触发发版 1 -->`；依赖旧注释文本做脚本匹配或人工约定的流程需要同步更新。

- **package.json,vue-element-cui-nuxt:** ⚠️ 移除保守的私包配置，避免出现无法生成版本号的情况。 ([fac697d](https://github.com/ruan-cat/eams-component-lib/commit/fac697d))

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

## @eams-monorepo/vue-element-cui-nuxt@3.0.0 (2026-04-09)

[compare changes](https://github.com/ruan-cat/eams-component-lib/compare/@eams-monorepo/vue-element-cui-nuxt@2.0.0...@eams-monorepo/vue-element-cui-nuxt@3.0.0)

### 🦄 代码重构

- **repo:** ⚠️ Flatten monorepo to repository root ([c9c0b44](https://github.com/ruan-cat/eams-component-lib/commit/c9c0b44))
- **vue-element-cui,config,vue-element-cui-nuxt:** 优化代码结构。 ([4272334](https://github.com/ruan-cat/eams-component-lib/commit/4272334))

  故意触发发版

- **release:** ⚠️ 调整包级 README 的发版触发标记 ([7e16b6e](https://github.com/ruan-cat/eams-component-lib/commit/7e16b6e))

  统一更新组件库与文档站 README 里的故意触发发版标记，避免继续沿用旧的占位写法。
  这次变更将包级 README 的发版触发注释收敛到新的编号形式，方便后续按文档变更继续触发版本流程。
  BREAKING CHANGE: 包级 README 中用于人工触发发版的注释标记已从旧的 `<!-- TODO: 故意触发发版 -->` 调整为 `<!-- TODO: 故意触发发版 1 -->`；依赖旧注释文本做脚本匹配或人工约定的流程需要同步更新。

### 📖 Documentation

- **repo:** Rewrite component library showcase narrative ([6f4441b](https://github.com/ruan-cat/eams-component-lib/commit/6f4441b))

### 🔧 更新配置

- **package.json,vue-element-cui-nuxt:** ⚠️ 移除保守的私包配置，避免出现无法生成版本号的情况。 ([fac697d](https://github.com/ruan-cat/eams-component-lib/commit/fac697d))

#### ⚠️ Breaking Changes

- **repo:** ⚠️ Flatten monorepo to repository root ([c9c0b44](https://github.com/ruan-cat/eams-component-lib/commit/c9c0b44))
- **release:** ⚠️ 调整包级 README 的发版触发标记 ([7e16b6e](https://github.com/ruan-cat/eams-component-lib/commit/7e16b6e))

  统一更新组件库与文档站 README 里的故意触发发版标记，避免继续沿用旧的占位写法。
  这次变更将包级 README 的发版触发注释收敛到新的编号形式，方便后续按文档变更继续触发版本流程。
  BREAKING CHANGE: 包级 README 中用于人工触发发版的注释标记已从旧的 `<!-- TODO: 故意触发发版 -->` 调整为 `<!-- TODO: 故意触发发版 1 -->`；依赖旧注释文本做脚本匹配或人工约定的流程需要同步更新。

- **package.json,vue-element-cui-nuxt:** ⚠️ 移除保守的私包配置，避免出现无法生成版本号的情况。 ([fac697d](https://github.com/ruan-cat/eams-component-lib/commit/fac697d))

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

**Multiple Packages Updated** - 2026-04-09

## @eams-monorepo/vue-element-cui@2.0.1 (2026-04-09)

[compare changes](https://github.com/ruan-cat/eams-component-lib/compare/@eams-monorepo/vue-element-cui@2.0.0...@eams-monorepo/vue-element-cui@2.0.1)

### 🦄 代码重构

- **vue-element-cui,config,vue-element-cui-nuxt:** 优化代码结构。 ([4272334](https://github.com/ruan-cat/eams-component-lib/commit/4272334))

  故意触发发版

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

**Multiple Packages Updated** - 2026-04-09

## @eams-monorepo/vue-element-cui@2.0.0 (2026-04-09)

[compare changes](https://github.com/ruan-cat/eams-component-lib/compare/@eams-monorepo/vue-element-cui@1.0.0...@eams-monorepo/vue-element-cui@2.0.0)

### 🦄 代码重构

- **repo:** ⚠️ Flatten monorepo to repository root ([c9c0b44](https://github.com/ruan-cat/eams-component-lib/commit/c9c0b44))

### 📖 Documentation

- **repo:** Rewrite component library showcase narrative ([6f4441b](https://github.com/ruan-cat/eams-component-lib/commit/6f4441b))
- **cui:** 补充双轨发版标记说明 ([a6de5c2](https://github.com/ruan-cat/eams-component-lib/commit/a6de5c2))

#### ⚠️ Breaking Changes

- **repo:** ⚠️ Flatten monorepo to repository root ([c9c0b44](https://github.com/ruan-cat/eams-component-lib/commit/c9c0b44))

### ❤️ Contributors

- Ruan-cat ([@ruan-cat](https://github.com/ruan-cat))

All notable changes to this repository will be documented in this file.
