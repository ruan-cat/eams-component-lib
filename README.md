# `eams-component-lib`

一个面向开源展示与求职叙事的现代组件库 monorepo。

## 线上文档站

- 主域名： https://vec.ruan-cat.com
- 备用域名： https://vue-element-cui.ruan-cat.com

## 仓库定位

这个仓库不再承载具体业务应用，而是聚焦在三件事：

- `packages/vue-element-cui`：现代 Vue 3 组件库本体
- `packages/vue-element-cui-nuxt`：组件库展示站与文档站（部署至上述域名）
- `old/vue-element-cui`：Vue 2 时代旧组件库的历史实现，用于迁移对照

## 工程化能力

- `pnpm workspace` 统一管理多包
- `turbo` 组织构建、开发与任务编排
- `relizy` + `changelogen` 生成根级 `CHANGELOG.md` 与 release commit
- `GitHub Actions` + `gh release create` 从根级 `CHANGELOG.md` 提取内容创建 GitHub Release
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
pnpm test
pnpm build:docs
pnpm --dir packages/vue-element-cui-nuxt dev
```

## CI 自检

```bash
pnpm run ci
```

该命令会顺序执行根级 lint、Turbo 测试，以及 Turbo 文档构建。`test` 与 `build:docs` 都依赖 Turbo 的任务匹配和工作区依赖图：组件库与文档站不再通过 `--filter` 手工串联，而是由 `@eams-monorepo/vue-element-cui-nuxt -> @eams-monorepo/vue-element-cui` 的工作区依赖自动编排。GitHub Actions `ci.yml` 继续复用同一条命令链；当仓库配置了 `TURBO_TOKEN` 与 `TURBO_TEAM` 时，会自动接入 Turbo 远程缓存。

## 发版与 GitHub Release

```bash
pnpm run release
```

预演版本计划时使用：

```bash
pnpm run changelog:dry
pnpm run release:dry
```

如需单独重建根级 `CHANGELOG.md`，使用：

```bash
pnpm run changelog:root
```

当前仓库的发布边界如下：

- `pnpm run release` 会按顺序执行 `release:sub`、`release:root`、`git:push`。
- `release:sub`、`release:dry` 与 `release:root` 显式传递 `--yes`，避免 release 路径在无 TTY 环境卡在交互确认。
- 不执行 npm publish。
- `old/vue-element-cui` 只作为迁移对照保留，不参与新的 relizy bump 扫描。
- GitHub Actions 会在收到根级 `v*` tag 与 relizy 生成的 `@scope/package@*` tag 后，从根级 `CHANGELOG.md` 提取对应 section 创建 GitHub Release。

## 迁移叙事

仓库保留 `old/vue-element-cui`，用于展示旧组件库如何逐步迁移到现代 monorepo、测试体系、文档站与发布流程。这部分历史包是仓库叙事的一部分，但不参与当前主链路开发。

## License

MIT
