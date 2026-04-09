# `eams-component-lib`

一个面向开源展示与求职叙事的现代组件库 monorepo。

## 仓库定位

这个仓库不再承载具体业务应用，而是聚焦在三件事：

- `packages/vue-element-cui`：现代 Vue 3 组件库本体
- `packages/vue-element-cui-nuxt`：组件库展示站与文档站
- `old/vue-element-cui`：Vue 2 时代旧组件库的历史实现，用于迁移对照

## 工程化能力

- `pnpm workspace` 统一管理多包
- `turbo` 组织构建、开发与任务编排
- `changesets` 维护发版链路
- `eslint`、`prettier`、`simple-git-hooks`、`lint-staged` 负责代码质量收敛
- `vitest` 覆盖组件库与文档站测试

## 目录结构

```plain
eams-component-lib/
├─ packages/
│  ├─ vue-element-cui/
│  └─ vue-element-cui-nuxt/
├─ old/
│  └─ vue-element-cui/
├─ docs/
├─ openspec/
├─ scripts/
└─ configs/
```

## 快速开始

```bash
pnpm install
pnpm lint
pnpm build
pnpm --filter @eams-monorepo/vue-element-cui test
pnpm --filter @eams-monorepo/vue-element-cui-nuxt dev
```

## 迁移叙事

仓库保留 `old/vue-element-cui`，用于展示旧组件库如何逐步迁移到现代 monorepo、测试体系、文档站与发布流程。这部分历史包是仓库叙事的一部分，但不参与当前主链路开发。

## License

MIT
