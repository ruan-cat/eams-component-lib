# Changelog

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
