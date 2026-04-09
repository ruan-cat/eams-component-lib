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
