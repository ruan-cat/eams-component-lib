# 2026-04-09 GitHub Workflow / Relizy / Changelogithub 设计

## 背景

当前仓库已经完成“现代组件库展示仓”的结构重构，但还缺少一套面向 GitHub 的持续集成与发布基础设施。

用户希望这套基础设施满足以下目标：

- 基于 `turbo` 建立 GitHub Actions 自检链路
- 引入 `Relizy Runner + Changelogithub` 的发版体系
- 能生成根级 `CHANGELOG.md`
- 能生成 GitHub Release
- 不向 npm registry 发布任何 Node 包
- 保留现有历史 git tag，并在后续迁移到 GitHub 时继续推送这些 tag

用户明确指定参考：

- `D:\\code\\ruan-cat\\monorepo`
- `D:\\code\\ruan-cat\\01s-11comm`

其中：

- `monorepo` 提供 `pnpm + turbo + GitHub Actions` 的 CI 与远程缓存参考
- `01s-11comm` 提供 `Relizy Runner + Changelogithub`、但不真正 publish npm 包的发版参考

## 目标

1. 为当前仓库新增 GitHub Actions 自检 workflow
2. 为当前仓库新增 GitHub Actions release workflow
3. 通过 `Relizy Runner` 在本地生成 changelog、release commit 和 release tag
4. 通过 `Changelogithub` 在 GitHub 上生成 Release 页面内容
5. 保持 Turbo 远程缓存为可选能力，而不是强依赖
6. 保留全部历史 tag，并避免旧 tag 自动污染未来的 GitHub Releases 页面

## 非目标

1. 不执行 npm publish
2. 不接入 npm trusted publishing
3. 不删除或重写现有历史 tag
4. 不把 `old/vue-element-cui` 纳入新的主发布链
5. 不在本轮把整套发布体系重新设计成 `changesets/action` 主导

## 当前仓库事实

### 已有能力

- 根目录已经是唯一 workspace 根目录
- 根目录已有 `turbo.json`
- 根目录已有 `pnpm` / `eslint` / `prettier` / `simple-git-hooks`
- 根目录已有 `.changeset/`，但当前并未形成符合目标的 GitHub Release 体系
- 当前仓库没有 `.github/workflows/`
- 当前仓库没有 `CHANGELOG.md`
- 当前仓库没有 `changelog.config.ts`
- 当前仓库没有 `changelogithub.config.ts`
- 当前仓库没有 `relizy.config.ts`
- 当前仓库没有 `scripts/relizy-runner.ts`

### 已有历史 tag

当前仓库已经保留以下历史 tag 类型：

- `@eams-monorepo/vue-element-cui@x.y.z`
- `@eams-monorepo/vue-element-cui-nuxt@x.y.z`
- `hello-world@x.y.z`
- 以及旧业务包的历史 tag

这些 tag 继续保留，作为旧仓迁移到现代组件库展示仓的证据链，同时也可作为 future relizy baseline tag 的一部分。

## 核心决策

### 决策 1：CI 与 Release 分离

新增两个主 workflow：

- `ci.yml`
- `release.yml`

理由：

- CI 的职责是验证代码可安装、可 lint、可构建、可测试
- Release 的职责是基于 tag 生成 GitHub Release
- 将两者拆开后，失败定位更明确，也更贴近用户展示“现代工程设施”的目标

### 决策 2：发布体系采用 `Relizy Runner + Changelogithub`

发布链路不沿用 `changesets/action + npm publish`，而改为：

1. 本地执行 `pnpm release:relizy`
2. `Relizy Runner` 负责：
   - Windows GNU 工具兼容
   - independent baseline tag 检查
   - 调用 relizy
3. `relizy` 负责：
   - 更新 `CHANGELOG.md`
   - 生成 release commit
   - 生成 release tag
4. GitHub Actions 的 `release.yml` 监听未来新的 release tag
5. `changelogithub` 负责生成 GitHub Release

理由：

- 这套链路最贴近 `01s-11comm` 的成功实践
- 它能同时满足“本地生成 changelog”和“GitHub 生成 release 页面”
- 它不会强推仓库进入 npm publish 语义

### 决策 3：保留 `.changeset/`，但不作为当前主发布通道

当前仓库已有 `.changeset/`，本轮不删除，但也不让它主导 release workflow。

理由：

- 删除会破坏已有工程化设施的一致性
- 继续让其主导会偏离“不 publish npm 包”的目标
- 将其降级为历史预留设施，更符合当前阶段的仓库定位

### 决策 4：未来 GitHub Release 只由新的根级 `v*` tag 触发

历史 tag 继续保留，但不自动生成 GitHub Release。

未来只让新的 relizy 根级 tag 触发 release workflow，例如：

- `v1.0.0`
- `v1.1.0`

理由：

- 旧 tag 的主要价值是历史追溯和 baseline 校验
- 如果让旧 tag 也生成 GitHub Release，会把 Releases 页面污染成旧业务痕迹
- 根级 `v*` tag 更适合当前“组件库展示仓”的对外叙事

### 决策 5：Turbo 远程缓存是可选增强，不是硬依赖

`ci.yml` 与 `release.yml` 都支持读取：

- `TURBO_TOKEN`
- `TURBO_TEAM`

当这些 secrets 存在时，workflow 额外执行 `turbo login` 与 `turbo link`；不存在时直接跳过。

理由：

- 当前仓库还未接入新的 GitHub remote 与 secrets
- 首次落地时应优先确保 workflow “无 secrets 也能跑通”
- 远程缓存属于性能增强，不应变成发布链路的阻塞条件

## 目标文件清单

### 新增

- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
- `changelog.config.ts`
- `changelogithub.config.ts`
- `relizy.config.ts`
- `scripts/relizy-runner.ts`
- `CHANGELOG.md`

### 修改

- `package.json`
- `README.md`
- `pnpm-lock.yaml`

### 保留但不主导

- `.changeset/config.json`

## CI Workflow 设计

文件：

- `.github/workflows/ci.yml`

### 触发条件

- `pull_request` 指向 `main`
- `push` 到 `main`
- `workflow_dispatch`

### 结构

采用单 workflow、单主 job：

- job 名称：`verify`
- 运行环境：`ubuntu-latest`

### 核心步骤

1. `actions/checkout@v4`
   - `fetch-depth: 0`
2. `pnpm/action-setup@v4`
3. `actions/setup-node@v4`
   - Node 22
   - 开启 `pnpm` cache
4. `pnpm install --frozen-lockfile`
5. 输出版本信息：
   - `node -v`
   - `pnpm -v`
   - `turbo --version`
6. 可选 Turbo 远程缓存登录与链接
7. 执行自检命令：
   - `pnpm lint`
   - `pnpm build`
   - `pnpm --filter @eams-monorepo/vue-element-cui test`
   - `pnpm --filter @eams-monorepo/vue-element-cui-nuxt build`

### 设计理由

- 直接复用当前已经验证通过的本地命令
- 避免首版过早拆成多 job 导致安装重复和调试成本上升
- `pnpm build` 会通过 turbo 带上 `old/vue-element-cui` 构建，保留迁移证据链

## Release Workflow 设计

文件：

- `.github/workflows/release.yml`

### 触发条件

- `push` 到匹配 `v*` 的 tag
- `workflow_dispatch`

### 不监听的 tag

以下历史 tag 不应触发 GitHub Release：

- `@eams-monorepo/*@*`
- `hello-world@*`

### 结构

采用单 workflow、单 job：

- job 名称：`release`
- 运行环境：`ubuntu-latest`

### 核心步骤

1. `actions/checkout@v4`
   - `fetch-depth: 0`
2. `pnpm/action-setup@v4`
3. `actions/setup-node@v4`
   - Node 22 或 `lts/*`
   - 开启 `pnpm` cache
4. `pnpm install --frozen-lockfile`
5. 输出版本信息
6. 可选 Turbo 远程缓存登录与链接
7. 执行：
   - `pnpm dlx changelogithub`

### 权限

建议显式配置：

- `contents: write`
- `pull-requests: write`

同时预留：

- `id-token: write`

虽然本轮不用 npm trusted publishing，但预留该权限有利于未来演进。

## Changelog 设计

### `changelog.config.ts`

职责：

- 生成根级 `CHANGELOG.md`
- 统一提交类型与标题模板
- 输出内容围绕：
  - 组件库
  - 文档站
  - 工程化设施

不再围绕旧业务应用叙事。

### `changelogithub.config.ts`

职责：

- 从 `changelog.config.ts` 继承提交类型映射
- `output: false`
- 仅供 GitHub Release 页面生成使用

不负责回写本地 `CHANGELOG.md`。

## Relizy Runner 设计

文件：

- `scripts/relizy-runner.ts`

### 核心职责

1. 在 Windows 本地补齐 `grep` / `head` / `sed`
2. 在执行 `release` / `bump` 前做 baseline tag 检查
3. 将参数原样转发给 `relizy`

### baseline tag 设计

runner 继续沿用 independent 模式对 package tag 的检查逻辑，检查形态为：

- `@eams-monorepo/vue-element-cui@*`
- `@eams-monorepo/vue-element-cui-nuxt@*`

明确不把 `hello-world` 纳入新的 baseline 检查。

理由：

- `hello-world` 对应 `old/vue-element-cui`
- 旧组件库必须保留其历史 tag，但不参与新的主发布链
- baseline 检查应只覆盖新的主发布包，避免 runner 因历史包阻塞未来 release

### 发布范围

主发布链建议纳入：

- `packages/vue-element-cui`
- `packages/vue-element-cui-nuxt`

明确排除：

- `old/vue-element-cui`

理由：

- 旧组件库是历史迁移对照，不应参与新的主线 bump
- 但其历史 tag 仍保留在仓库内，不做破坏

## Relizy 配置设计

文件：

- `relizy.config.ts`

### 关键配置目标

- `versionMode: "independent"`
- `changelog.rootChangelog: true`
- `release.changelog: true`
- `release.commit: true`
- `release.push: true`
- `release.gitTag: true`
- `release.clean: true`
- `release.publish: false`
- `release.providerRelease: false`

### 语义解释

这意味着：

- relizy 负责生成 changelog、commit 和 tag
- 但不做 npm publish
- 也不在本地直接创建 GitHub Release

GitHub Release 由 GitHub Actions 在 tag push 后生成。

## 包与 tag 关系设计

### 历史 tag

继续保留并允许后续推送到 GitHub：

- `@eams-monorepo/admin@*`
- `@eams-monorepo/stu-app@*`
- `@eams-monorepo/tea-app@*`
- `@eams-monorepo/vue-element-cui@*`
- `@eams-monorepo/vue-element-cui-nuxt@*`
- `hello-world@*`

这些 tag：

- 是历史证据链
- 也是 baseline 历史参考来源
- 但不会自动生成 GitHub Release

### 新 release tag

未来主线 release 采用根级 `v*` tag，例如：

- `v1.0.0`
- `v1.1.0`

只有这类 tag 会触发 `release.yml` 并生成 GitHub Release。

## `package.json` 调整设计

新增或调整根脚本：

- `release`
- `release:relizy`
- `format:changelog`

脚本语义应与 `01s-11comm` 保持一致，即：

- 默认发布入口走 `relizy-runner`
- 明确关闭 npm publish 与 provider release

## `README.md` 调整设计

需要新增“CI / Release / Changelog”说明，明确当前仓库的发布语义：

- 有 CI 自检
- 有 GitHub Release
- 有根级 `CHANGELOG.md`
- 不 publish npm 包
- 未来 push 新的 `v*` tag 才会生成 GitHub Release

## Secrets 设计

### 必要

- `GITHUB_TOKEN`

### 可选

- `TURBO_TOKEN`
- `TURBO_TEAM`

### 不需要

- `NPM_TOKEN`

## 验证方案

### 本地验证

1. `pnpm install`
2. `pnpm lint`
3. `pnpm build`
4. `pnpm --filter @eams-monorepo/vue-element-cui test`
5. `pnpm --filter @eams-monorepo/vue-element-cui-nuxt build`
6. `pnpm release:relizy -- --dry-run --no-clean`

目标：

- 确认 relizy runner 能在当前仓库运行
- 确认不会触发 npm publish
- 确认能生成 release 计划与 changelog 结果

### GitHub Actions 验证

1. 手动触发 `ci.yml`
2. 创建一个测试 `v*` tag 并推送到 GitHub
3. 观察 `release.yml` 是否执行 `changelogithub`
4. 检查 GitHub Release 是否生成

## 风险与缓解

### 风险 1：independent baseline tag 与当前历史 tag 体系不完全匹配

缓解：

- runner 保留显式 baseline 检查
- 在首次真正执行 relizy 前，先通过 `--dry-run` 验证

### 风险 2：`old/vue-element-cui` 被误纳入新发布链

缓解：

- 在 `relizy.config.ts` 明确限制发布包范围
- 在 spec 实施阶段额外做 dry-run 验证

### 风险 3：GitHub Release 被历史 tag 污染

缓解：

- `release.yml` 只监听 `v*`
- 历史 `@scope/pkg@version` tag 不纳入 workflow 触发条件

### 风险 4：没有 Turbo secrets 时 workflow 行为不一致

缓解：

- 把 Turbo 远程缓存写成条件步骤
- 保证无 secrets 时仍能完整跑通 CI 与 Release

## 实施边界

本轮只建立：

- GitHub Actions CI
- GitHub Actions Release
- Relizy Runner
- Changelog / GitHub Release 基础设施

本轮不负责：

- 真正 npm publish
- 自动部署站点
- 对旧历史 tag 反向补 GitHub Release
- 发布视觉页或 release announcement 页面设计
