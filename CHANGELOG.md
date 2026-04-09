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
